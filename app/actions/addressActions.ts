"use server";

import { z } from "zod";
import { flagAddressDiscrepancies } from "@/ai/flows/flag-address-discrepancies";
import type { AddressSubmission, User } from "@/types";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  orderBy,
  getDoc
} from "firebase/firestore";

const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  areaDistrict: z.string().min(1, "Area/District is required"),
  city: z.string().min(1, "City is required"),
  lga: z.string().min(1, "LGA is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
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


// Simulate fetching Google Maps address - This remains a mock as it's external
async function fetchGoogleMapsAddress(addressParts: z.infer<typeof addressSchema>): Promise<string> {
  const { streetAddress, areaDistrict, city, state, country, zipCode } = addressParts;
  if (streetAddress.toLowerCase().includes("test discrepancy")) {
     return `${streetAddress.replace(", Test Discrepancy Layout", "")}, ${areaDistrict}, ${city}, ${state} ${zipCode || ''}, ${country}`.replace(/,\s*,/g, ',').trim();
  }
  return `${streetAddress}, ${areaDistrict}, ${city}, ${state}, ${zipCode || ''}, ${country}`.replace(/,\s*,/g, ',').trim();
}

interface SubmitAddressParams {
  formData: FormData;
  user: Pick<User, 'id' | 'name' | 'email'> | null;
}

export async function submitAddress({ formData, user }: SubmitAddressParams) {
  const rawFormData = {
    streetAddress: formData.get("streetAddress") as string,
    areaDistrict: formData.get("areaDistrict") as string,
    city: formData.get("city") as string,
    lga: formData.get("lga") as string,
    state: formData.get("state") as string,
    zipCode: formData.get("zipCode") as string | undefined,
    country: formData.get("country") as string,
  };

  const validation = addressSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: "Validation failed.",
    };
  }

  if (!user || !user.id) {
    return {
      success: false,
      message: "User authentication required.",
      errors: null,
    };
  }

  const submittedAddressData = validation.data;

  try {
    const userSubmittedString = `${submittedAddressData.streetAddress}, ${submittedAddressData.areaDistrict}, ${submittedAddressData.city}, ${submittedAddressData.lga}, ${submittedAddressData.state}, ${submittedAddressData.zipCode ? submittedAddressData.zipCode + ", " : ""}${submittedAddressData.country}`;
    
    const googleMapsAddress = await fetchGoogleMapsAddress(submittedAddressData);

    const aiResult = await flagAddressDiscrepancies({
      address: userSubmittedString,
      googleMapsAddress: googleMapsAddress,
    });

    let status: AddressSubmission['status'] = "pending_review";
    let aiFlaggedReason: string | undefined = undefined;

    if (aiResult.isDiscrepant) {
      status = "pending_review";
      aiFlaggedReason = aiResult.reason;
    } else {
      status = "approved"; 
    }
    
    const newSubmissionData: Omit<AddressSubmission, 'id' | 'submittedAt' | 'reviewedAt'> & { submittedAt: any, reviewedAt: any } = {
      userId: user.id,
      userName: user.name || "User",
      userEmail: user.email || "user@example.com",
      submittedAddress: submittedAddressData,
      googleMapsSuggestion: googleMapsAddress,
      status: status,
      aiFlaggedReason: aiFlaggedReason,
      submittedAt: serverTimestamp(), 
      reviewedAt: null, 
      reviewerId: null,
      reviewNotes: undefined, 
    };

    const docRef = await addDoc(collection(db, "addressSubmissions"), newSubmissionData);
    
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

export async function getAddressSubmissions(userId: string): Promise<AddressSubmission[]> {
  try {
    const submissionsCol = collection(db, "addressSubmissions");
    let q;
    
    const consoleUserIdentifiers = ["CONSOLE_USER_UID_ABDULHAQQ", "CONSOLE_USER_UID_JOSHUA"]; 
    const isAdminUser = consoleUserIdentifiers.includes(userId) || userId === "mockConsoleId";


    if (isAdminUser) { 
      q = query(submissionsCol, orderBy("submittedAt", "desc"));
    } else {
      q = query(submissionsCol, where("userId", "==", userId), orderBy("submittedAt", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const submissions: AddressSubmission[] = [];
    querySnapshot.forEach((docSnap) => {
      submissions.push({ id: docSnap.id, ...convertTimestamps(docSnap.data()) } as AddressSubmission);
    });
    return submissions;
  } catch (error) {
    console.error("Error fetching address submissions from Firestore:", error);
    return []; 
  }
}

export async function getFlaggedAddresses(): Promise<AddressSubmission[]> {
  try {
    const submissionsCol = collection(db, "addressSubmissions");
    const q = query(submissionsCol, where("status", "==", "pending_review"), orderBy("submittedAt", "desc"));
    
    const querySnapshot = await getDocs(q);
    const submissions: AddressSubmission[] = [];
    querySnapshot.forEach((docSnap) => {
      submissions.push({ id: docSnap.id, ...convertTimestamps(docSnap.data()) } as AddressSubmission);
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
    const submissionRef = doc(db, "addressSubmissions", submissionId);
    
    const docSnap = await getDoc(submissionRef);
    if (!docSnap.exists()) {
      return { success: false, message: "Submission not found." };
    }

    const updateData: Partial<AddressSubmission> & { reviewedAt: any } = { 
      status: newStatus,
      reviewedAt: serverTimestamp(),
      reviewerId: reviewerId, 
    };

    if (reviewNotes) updateData.reviewNotes = reviewNotes;

    await updateDoc(submissionRef, updateData);
    
    return { success: true, message: `Submission ${submissionId} status updated to ${newStatus}.` };
  } catch (error) {
    console.error("Error updating address status in Firestore:", error);
    return { success: false, message: "Failed to update submission status." };
  }
}
