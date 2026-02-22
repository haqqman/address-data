
"use server";

import { z } from "zod";
import { flagAddressDiscrepancies } from "@/ai/flows/flag-address-discrepancies";
import type { AddressSubmission, User } from "@/types";
import { adminDb } from "@/firebase/server";
import { verifyServerSession } from "@/lib/auth/server-utils";
import { Timestamp } from "firebase-admin/firestore";

const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  areaDistrict: z.string().optional(),
  city: z.string().min(1, "City is required"),
  lga: z.string().min(1, "LGA is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().optional(),
  propertyType: z.enum(["residential", "commercial"]),
}).refine(data => {
    // If state is FCT, the district field becomes required.
    if (data.state === 'FCT') {
        return !!data.areaDistrict && data.areaDistrict.length > 0;
    }
    return true;
}, {
    message: "District is required for FCT.",
    path: ["areaDistrict"], 
});


// Helper function to convert Firestore Timestamps to Date objects
const convertTimestamps = (docData: any): any => {
  const data = { ...docData };
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    } else if (typeof data[key] === 'object' && data[key] !== null && !(data[key] instanceof Date)) {
      convertTimestamps(data[key]); 
    }
  }
  return data;
};

// Simplified unique code generation
const generateADC = (state: string, city: string): string => {
  const stateCode = state.substring(0, 3).toUpperCase();
  const cityCode = city.substring(0, 3).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ADC-${stateCode}${cityCode}-${randomPart}`;
};


// Simulate fetching Google Maps address - This remains a mock as it's external
async function fetchGoogleMapsAddress(addressParts: z.infer<typeof addressSchema> & {country: string}): Promise<string> {
  const { street, areaDistrict, city, state, zipCode, country } = addressParts;
  if (street.toLowerCase().includes("test discrepancy")) {
     return `${street.replace(", Test Discrepancy Layout", "")}, ${areaDistrict}, ${city}, ${state} ${zipCode || ''}, ${country}`.replace(/,\s*,/g, ',').trim();
  }
  return `${street}, ${areaDistrict || ''}, ${city}, ${state}, ${zipCode || ''}, ${country}`.replace(/,\s*,/g, ',').trim();
}

interface SubmitAddressParams {
  formData: FormData;
  user: Pick<User, 'id' | 'displayName' | 'email'> | null;
}

export async function submitAddress({ formData, user }: SubmitAddressParams) {
  // Verify session securely on server
  const sessionUser = await verifyServerSession();
  
  // Note: We currently allow submitting if sessionUser exists. 
  // If the user is unauthenticated, we might block them or allow guest submissions depending on business logic.
  // The original code returned "User authentication required." if !user
  if (!sessionUser) {
    return {
      success: false,
      message: "User authentication required.",
      errors: null,
    };
  }

  const rawFormData = {
    street: formData.get("street") as string,
    areaDistrict: formData.get("areaDistrict") as string,
    city: formData.get("city") as string,
    lga: formData.get("lga") as string,
    state: formData.get("state") as string,
    zipCode: formData.get("zipCode") as string | undefined,
    propertyType: formData.get("propertyType") as "residential" | "commercial",
  };

  const validation = addressSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  const submittedAddressData = validation.data;
  const country = "Nigeria";

  try {
    const userSubmittedString = [
      submittedAddressData.street,
      submittedAddressData.areaDistrict,
      submittedAddressData.city,
      submittedAddressData.lga,
      submittedAddressData.state,
      submittedAddressData.zipCode,
      country
    ].filter(Boolean).join(', ');
    
    const googleMapsAddress = await fetchGoogleMapsAddress({...submittedAddressData, country});

    const aiResult = await flagAddressDiscrepancies({
      address: userSubmittedString,
      googleMapsAddress: googleMapsAddress,
    });

    let status: AddressSubmission['status'] = "pending-review";
    let aiFlaggedReason: string | undefined = undefined;
    let adc: string | null = null;

    if (aiResult.isDiscrepant) {
      status = "pending-review";
      aiFlaggedReason = aiResult.reason;
    } else {
      status = "approved"; 
      adc = generateADC(submittedAddressData.state, submittedAddressData.city);
    }
    
    const submittedAddressDataForDB = {
      streetAddress: submittedAddressData.street,
      areaDistrict: submittedAddressData.areaDistrict || "",
      city: submittedAddressData.city,
      lga: submittedAddressData.lga,
      state: submittedAddressData.state,
      zipCode: submittedAddressData.zipCode || "",
      country: country,
    };

    const newSubmissionData = {
      userId: sessionUser.id,
      userName: sessionUser.displayName || "User",
      userEmail: sessionUser.email || "user@example.com",
      submittedAddress: submittedAddressDataForDB,
      adc: adc,
      googleMapsSuggestion: googleMapsAddress,
      propertyType: submittedAddressData.propertyType,
      status: status,
      aiFlaggedReason: aiFlaggedReason || undefined,
      submittedAt: new Date(), 
      reviewedAt: status === 'approved' ? new Date() : null,
      reviewerId: status === 'approved' ? 'system-ai' : null,
      reviewNotes: status === 'approved' ? 'Auto-approved by AI.' : undefined,
    };

    const docRef = await adminDb.collection("addressSubmissions").add(newSubmissionData);
    
    return {
      success: true,
      message: `Address submitted. Status: ${status}.${aiFlaggedReason ? ` Reason: ${aiFlaggedReason}` : ''}`,
      submission: { 
        id: docRef.id, 
        ...newSubmissionData, 
        submittedAt: new Date(), 
        reviewedAt: null 
      }, 
    };

  } catch (error) {
    console.error("Error submitting address to Firestore:", error);
    return {
      success: false,
      message: "An error occurred while submitting the address.",
      errors: null,
    };
  }
}

export async function getAddressSubmissions(userId?: string): Promise<AddressSubmission[]> {
  try {
    const submissionsCol = adminDb.collection("addressSubmissions");
    let query;

    if (userId) {
       // If a userId is provided, fetch only for that user
      query = submissionsCol.where("userId", "==", userId).orderBy("submittedAt", "desc");
    } else {
       // If no userId, fetch all submissions (for the "All Contributions" view)
      query = submissionsCol.orderBy("submittedAt", "desc");
    }

    const querySnapshot = await query.get();
    const submissions: AddressSubmission[] = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...convertTimestamps(doc.data()) } as AddressSubmission);
    });
    return submissions;
  } catch (error) {
    console.error("Error fetching address submissions from Firestore:", error);
    return []; 
  }
}

export async function getFlaggedAddresses(): Promise<AddressSubmission[]> {
  try {
    const submissionsCol = adminDb.collection("addressSubmissions");
    const query = submissionsCol.where("status", "==", "pending-review").orderBy("submittedAt", "desc");
    
    const querySnapshot = await query.get();
    const submissions: AddressSubmission[] = [];
    querySnapshot.forEach((doc) => {
      submissions.push({ id: doc.id, ...convertTimestamps(doc.data()) } as AddressSubmission);
    });
    return submissions;
  } catch (error) {
    console.error("Error fetching flagged addresses from Firestore:", error);
    return [];
  }
}

export async function updateAddressStatus(
  submissionId: string, 
  newStatus: "approved" | "rejected", 
  reviewerId: string, 
  reviewNotes?: string
): Promise<{success: boolean, message: string}> {
  try {
    // Security Check: Verify the reviewer
    const sessionUser = await verifyServerSession();
    if (!sessionUser) {
        return { success: false, message: "Unauthorized." };
    }
    
    const isConsole = ['cto', 'administrator', 'manager'].includes(sessionUser.role);
    if (!isConsole) {
        return { success: false, message: "Permission denied." };
    }

    const submissionRef = adminDb.collection("addressSubmissions").doc(submissionId);
    
    const docSnap = await submissionRef.get();
    if (!docSnap.exists) {
      return { success: false, message: "Submission not found." };
    }

    const submissionData = docSnap.data() as AddressSubmission;

    const updateData: any = { 
      status: newStatus,
      reviewedAt: new Date(),
      reviewerId: sessionUser.id, 
    };

    if (reviewNotes) updateData.reviewNotes = reviewNotes;

    // Generate ADC on approval if it doesn't exist
    if (newStatus === "approved" && !submissionData.adc) {
      updateData.adc = generateADC(submissionData.submittedAddress.state, submissionData.submittedAddress.city);
    }

    await submissionRef.update(updateData);
    
    return { success: true, message: `Submission ${submissionId} status updated to ${newStatus}.` };
  } catch (error) {
    console.error("Error updating address status in Firestore:", error);
    return { success: false, message: "Failed to update submission status." };
  }
}
