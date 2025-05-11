"use server";

import { z } from "zod";
import { flagAddressDiscrepancies } from "@/ai/flows/flag-address-discrepancies";
import type { AddressSubmission } from "@/types";

const addressSchema = z.object({
  streetAddress: z.string().min(1, "Street address is required"),
  areaDistrict: z.string().min(1, "Area/District is required"),
  city: z.string().min(1, "City is required"),
  lga: z.string().min(1, "LGA is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

// Mock database for submissions
let submissionIdCounter = 1;
let mockAddressSubmissions: AddressSubmission[] = [
  {
    id: (submissionIdCounter++).toString(),
    userId: "abdulhaqq_cto_id", 
    userName: "Abdulhaqq Sule",
    userEmail: "webmanager@haqqman.com",
    submittedAddress: {
      streetAddress: "1 Tech Avenue, Victoria Island",
      areaDistrict: "Innovation Hub",
      city: "Lagos",
      lga: "Eti-Osa",
      state: "Lagos",
      country: "Nigeria",
      zipCode: "101241",
    },
    googleMapsSuggestion: "1 Tech Avenue, Victoria Island, Lagos 101241, Nigeria",
    status: "approved", 
    aiFlaggedReason: undefined,
    submittedAt: new Date(2024, 4, 10, 10, 0, 0), 
    reviewedAt: new Date(2024, 4, 10, 11, 0, 0),
    reviewerId: "mockAdminId",
  },
  {
    id: (submissionIdCounter++).toString(),
    userId: "joshua_manager_id", 
    userName: "Joshua Ajorgbor",
    userEmail: "joshua+sandbox@haqqman.com",
    submittedAddress: {
      streetAddress: "25 Market Road, GRA Phase 2",
      areaDistrict: "Commerce District",
      city: "Port Harcourt",
      lga: "Port Harcourt City",
      state: "Rivers",
      country: "Nigeria",
      zipCode: "500272",
    },
    googleMapsSuggestion: "25 Market Rd, GRA Phase 2, Port Harcourt 500272, Rivers, Nigeria",
    status: "pending_review", 
    aiFlaggedReason: "Street name variation compared to Google Maps.",
    submittedAt: new Date(2024, 5, 1, 14, 30, 0), 
  },
   {
    id: (submissionIdCounter++).toString(),
    userId: "another_user_id", 
    userName: "Regular User",
    userEmail: "user@example.com",
    submittedAddress: {
      streetAddress: "15 Main Street, Test Discrepancy Layout", // To trigger AI flag
      areaDistrict: "Residential Area",
      city: "Abuja",
      lga: "AMAC",
      state: "FCT",
      country: "Nigeria",
      zipCode: "900001",
    },
    googleMapsSuggestion: "15 Main St, Residential Area, Abuja 900001, Nigeria",
    status: "pending_review", 
    aiFlaggedReason: "The user provided 'Test Discrepancy Layout' which is not found in Google Maps for this street.",
    submittedAt: new Date(2024, 5, 15, 9, 15, 0), 
  }
];


// Simulate fetching Google Maps address
async function fetchGoogleMapsAddress(addressParts: z.infer<typeof addressSchema>): Promise<string> {
  // In a real app, this would query Google Maps API
  const { streetAddress, areaDistrict, city, state, country, zipCode } = addressParts;
  // Simulate a common discrepancy: Google Maps might use a more formal name or add postal code
  if (streetAddress.toLowerCase().includes("test discrepancy")) {
     return `${streetAddress.replace(", Test Discrepancy Layout", "")}, ${areaDistrict}, ${city}, ${state} ${zipCode || ''}, ${country}`.replace(/,\s*,/g, ',').trim();
  }
  return `${streetAddress}, ${areaDistrict}, ${city}, ${state}, ${zipCode || ''}, ${country}`.replace(/,\s*,/g, ',').trim();
}

export async function submitAddress(formData: FormData) {
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

    // For new submissions via form, we'll use a generic mock user or one from auth context in a real app
    // This example assumes a generic user for direct form submissions for now
    const newSubmission: AddressSubmission = {
      id: (submissionIdCounter++).toString(),
      userId: "formSubmitUserId", // Placeholder for actual authenticated user ID
      userName: "Form User", // Placeholder
      userEmail: "formuser@example.com", // Placeholder
      submittedAddress: submittedAddressData,
      googleMapsSuggestion: googleMapsAddress,
      status: status,
      aiFlaggedReason: aiFlaggedReason,
      submittedAt: new Date(),
    };
    mockAddressSubmissions.unshift(newSubmission); 

    return {
      success: true,
      message: `Address submitted. Status: ${status}.${aiFlaggedReason ? ` Reason: ${aiFlaggedReason}` : ''}`,
      submission: newSubmission,
    };

  } catch (error) {
    console.error("Error submitting address:", error);
    return {
      success: false,
      message: "An error occurred while submitting the address.",
      errors: null,
    };
  }
}

export async function getAddressSubmissions(userId: string): Promise<AddressSubmission[]> {
  // If userId is "mockAdminId", return all submissions. Otherwise, filter by userId.
  // This allows admin users to see all submissions, while regular users see only their own.
  if (userId === "mockAdminId" || userId === "abdulhaqq_cto_id" || userId === "joshua_manager_id") {
    return mockAddressSubmissions;
  }
  return mockAddressSubmissions.filter(sub => sub.userId === userId);
}

export async function getFlaggedAddresses(): Promise<AddressSubmission[]> {
  return mockAddressSubmissions.filter(sub => sub.status === "pending_review");
}

export async function updateAddressStatus(submissionId: string, newStatus: "approved" | "rejected", reviewNotes?: string, reviewerId?: string): Promise<{success: boolean, message: string}> {
  const submissionIndex = mockAddressSubmissions.findIndex(s => s.id === submissionId);
  if (submissionIndex === -1) {
    return { success: false, message: "Submission not found." };
  }
  
  const submission = mockAddressSubmissions[submissionIndex];
  
  const updatedSubmission: AddressSubmission = {
    ...submission,
    status: newStatus,
    reviewedAt: new Date(),
    reviewerId: reviewerId || "mockAdminId", // Use provided reviewerId or default
    // In a real app, reviewNotes would be handled more robustly (e.g., appended to a list of notes)
    // For this mock, if reviewNotes are provided, we can store them.
    // We might want to differentiate AI reason from manual review notes.
    // Let's assume aiFlaggedReason remains, and reviewNotes are for manual review.
  };
   if(reviewNotes){
    // Example: Storing review notes directly or in a specific field
    // updatedSubmission.reviewNotes = reviewNotes; // if you add reviewNotes to AddressSubmission type
   }


  mockAddressSubmissions[submissionIndex] = updatedSubmission;
  
  return { success: true, message: `Submission ${submissionId} status updated to ${newStatus}.` };
}

    