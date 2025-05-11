
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
let mockAddressSubmissions: AddressSubmission[] = [];
let submissionIdCounter = 1;

// Simulate fetching Google Maps address
async function fetchGoogleMapsAddress(addressParts: z.infer<typeof addressSchema>): Promise<string> {
  // In a real app, this would query Google Maps API
  // For now, return a slightly modified version or a fixed one for testing discrepancies
  const { streetAddress, city, state, country } = addressParts;
  // Simulate a common discrepancy: Google Maps might use a more formal name or add postal code
  if (streetAddress.toLowerCase().includes("test discrepancy")) {
     return `${streetAddress}, ${city}, ${state} 100001, ${country}`;
  }
  return `${streetAddress}, ${city}, ${state}, ${country}`;
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

  const submittedAddress = validation.data;

  try {
    const userSubmittedString = `${submittedAddress.streetAddress}, ${submittedAddress.areaDistrict}, ${submittedAddress.city}, ${submittedAddress.lga}, ${submittedAddress.state}, ${submittedAddress.country}`;
    
    // Simulate fetching Google Maps data
    const googleMapsAddress = await fetchGoogleMapsAddress(submittedAddress);

    // Call AI flow
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
      status = "approved"; // Auto-approved
    }

    // Save to mock database
    const newSubmission: AddressSubmission = {
      id: (submissionIdCounter++).toString(),
      userId: "mockUserId", // Replace with actual user ID in a real app
      userName: "Mock User",
      userEmail: "mock@example.com",
      submittedAddress: submittedAddress,
      googleMapsSuggestion: googleMapsAddress,
      status: status,
      aiFlaggedReason: aiFlaggedReason,
      submittedAt: new Date(),
    };
    mockAddressSubmissions.unshift(newSubmission); // Add to the beginning of the array

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
  // In a real app, filter by userId
  return mockAddressSubmissions.filter(sub => sub.userId === userId || userId === "mockAdminId"); // Temp logic for admin to see all
}

export async function getFlaggedAddresses(): Promise<AddressSubmission[]> {
  return mockAddressSubmissions.filter(sub => sub.status === "pending_review");
}

export async function updateAddressStatus(submissionId: string, newStatus: "approved" | "rejected", reviewNotes?: string): Promise<{success: boolean, message: string}> {
  const submission = mockAddressSubmissions.find(s => s.id === submissionId);
  if (!submission) {
    return { success: false, message: "Submission not found." };
  }
  submission.status = newStatus;
  submission.reviewedAt = new Date();
  // submission.reviewerId = "mockAdminId"; // From authenticated admin user
  if(reviewNotes) {
    // In a real app, append to existing notes or store properly
    // submission.reviewNotes = reviewNotes;
  }
  return { success: true, message: `Submission ${submissionId} status updated to ${newStatus}.` };
}
