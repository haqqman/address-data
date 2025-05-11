"use server";

import { db } from "@/lib/firebase/config";
import { collection, doc, writeBatch, Timestamp } from "firebase/firestore";
import { stateOptions, addressData } from "@/lib/geography-data";
import type { StateOption, StateData } from "@/lib/geography-data";

// Mock data (derived from docs/seed-data.md)
const mockAddressSubmissions = [
  {
    id: "submission_1", // Example, Firestore can auto-generate
    userId: "abdulhaqq_cto_id", // Placeholder, replace with actual Firebase Auth UID
    userName: "Abdulhaqq Sule",
    userEmail: "webmanager@haqqman.com",
    submittedAddress: {
      streetAddress: "1 Tech Avenue, Victoria Island",
      areaDistrict: "Innovation Hub",
      city: "Lagos",
      lga: "Eti-Osa",
      state: "Lagos",
      country: "Nigeria",
      zipCode: "101241"
    },
    googleMapsSuggestion: "1 Tech Avenue, Victoria Island, Lagos 101241, Nigeria",
    status: "approved",
    aiFlaggedReason: null,
    submittedAt: Timestamp.fromDate(new Date("2024-05-10T10:00:00Z")),
    reviewedAt: Timestamp.fromDate(new Date("2024-05-10T11:00:00Z")),
    reviewerId: "mockAdminId"
  },
  {
    id: "submission_2",
    userId: "joshua_manager_id", // Placeholder
    userName: "Joshua Ajorgbor",
    userEmail: "joshua+sandbox@haqqman.com",
    submittedAddress: {
      streetAddress: "25 Market Road, GRA Phase 2",
      areaDistrict: "Commerce District",
      city: "Port Harcourt",
      lga: "Port Harcourt City",
      state: "Rivers",
      country: "Nigeria",
      zipCode: "500272"
    },
    googleMapsSuggestion: "25 Market Rd, GRA Phase 2, Port Harcourt 500272, Rivers, Nigeria",
    status: "pending_review",
    aiFlaggedReason: "Street name variation compared to Google Maps.",
    submittedAt: Timestamp.fromDate(new Date("2024-06-01T14:30:00Z")),
    reviewedAt: null,
    reviewerId: null
  },
  {
    id: "submission_3",
    userId: "another_user_id", // Placeholder
    userName: "Regular User",
    userEmail: "user@example.com",
    submittedAddress: {
      streetAddress: "15 Main Street, Test Discrepancy Layout",
      areaDistrict: "Residential Area",
      city: "Abuja",
      lga: "AMAC",
      state: "FCT",
      country: "Nigeria",
      zipCode: "900001"
    },
    googleMapsSuggestion: "15 Main St, Residential Area, Abuja 900001, Nigeria",
    status: "pending_review",
    aiFlaggedReason: "The user provided 'Test Discrepancy Layout' which is not found in Google Maps for this street.",
    submittedAt: Timestamp.fromDate(new Date("2024-06-15T09:15:00Z")),
    reviewedAt: null,
    reviewerId: null
  }
];

const mockApiKeys = [
  {
    id: "key_1", // Using this as Firestore Document ID
    userId: "user_A", // Placeholder
    userName: "Alice Wonderland",
    userEmail: "alice@example.com",
    publicKey: "pk_live_alicekeypublic123",
    privateKeyHash: "hashed_private_key_alice_placeholder", // Store a hash in real scenario
    createdAt: Timestamp.fromDate(new Date("2023-11-01T00:00:00Z")),
    lastUsedAt: Timestamp.fromDate(new Date("2024-01-15T00:00:00Z")),
    isActive: true,
    name: "Alice's Main Key"
  },
  {
    id: "key_2",
    userId: "user_B", // Placeholder
    userName: "Bob The Builder",
    userEmail: "bob@example.com",
    publicKey: "pk_live_bobkeypublic456",
    privateKeyHash: "hashed_private_key_bob_placeholder",
    createdAt: Timestamp.fromDate(new Date("2023-12-05T00:00:00Z")),
    lastUsedAt: null,
    isActive: false,
    name: "Bob's Old Key"
  },
  {
    id: "key_3",
    userId: "user_C", // Placeholder
    userName: "Charlie Brown",
    userEmail: "charlie@example.com",
    publicKey: "pk_live_charliekey789",
    privateKeyHash: "hashed_private_key_charlie_placeholder",
    createdAt: Timestamp.fromDate(new Date("2024-01-20T00:00:00Z")),
    lastUsedAt: null,
    isActive: true,
    name: "Charlie's App Key"
  }
];


export async function seedAllMockData(): Promise<{ success: boolean; message: string; results: Array<{type: string, success: boolean, message: string, operationsCount?: number }> }> {
  const results: Array<{type: string, success: boolean, message: string, operationsCount?: number }> = [];
  let overallSuccess = true;

  // Seed Geography Data
  try {
    const geoResult = await seedGeographyData();
    results.push({type: "Geography Data", ...geoResult});
    if (!geoResult.success) overallSuccess = false;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error seeding geography data.";
    results.push({type: "Geography Data", success: false, message: errorMessage});
    overallSuccess = false;
    console.error("Error during geography data seeding:", error);
  }

  // Seed Address Submissions
  try {
    const submissionsResult = await seedAddressSubmissionsData();
    results.push({type: "Address Submissions", ...submissionsResult});
    if (!submissionsResult.success) overallSuccess = false;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error seeding address submissions.";
    results.push({type: "Address Submissions", success: false, message: errorMessage});
    overallSuccess = false;
    console.error("Error during address submissions seeding:", error);
  }

  // Seed API Keys
  try {
    const apiKeysResult = await seedApiKeysData();
    results.push({type: "API Keys", ...apiKeysResult});
    if (!apiKeysResult.success) overallSuccess = false;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error seeding API keys.";
    results.push({type: "API Keys", success: false, message: errorMessage});
    overallSuccess = false;
    console.error("Error during API keys seeding:", error);
  }
  
  const finalMessage = overallSuccess ? "All mock data seeding processes completed." : "One or more mock data seeding processes failed or had issues.";
  return { success: overallSuccess, message: finalMessage, results };
}


async function seedGeographyData(): Promise<{ success: boolean; message: string; operationsCount?: number }> {
  try {
    const batch = writeBatch(db);
    let operationsCount = 0;

    for (const stateOpt of stateOptions) {
      const stateDocRef = doc(db, "nigerianGeography", stateOpt.value);
      batch.set(stateDocRef, {
        name: stateOpt.title,
        capital: "", // Capital is not provided in the source data
      });
      operationsCount++;

      const foundStateData: StateData | undefined = addressData.find(
        (data: StateData) => data.state === stateOpt.value
      );

      if (foundStateData) {
        for (const lgaData of foundStateData.lgas) {
          const lgaDocId = lgaData.name.replace(/\//g, "-");
          const lgaCollectionRef = collection(stateDocRef, "lgas");
          const lgaDocRef = doc(lgaCollectionRef, lgaDocId);
          
          batch.set(lgaDocRef, { name: lgaData.name });
          operationsCount++;

          for (const cityData of lgaData.cities) {
            const cityDocId = cityData.name.replace(/\//g, "-");
            const cityCollectionRef = collection(lgaDocRef, "cities");
            const cityDocRef = doc(cityCollectionRef, cityDocId);

            batch.set(cityDocRef, { name: cityData.name });
            operationsCount++;
          }
        }
      }
    }

    await batch.commit();
    return { 
        success: true, 
        message: `Successfully seeded geographical data. Total operations: ${operationsCount}.`,
        operationsCount 
    };

  } catch (error) {
    console.error("Error seeding geography data:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to seed geography data: ${errorMessage}` };
  }
}

async function seedAddressSubmissionsData(): Promise<{ success: boolean; message: string; operationsCount?: number }> {
  try {
    const batch = writeBatch(db);
    let operationsCount = 0;
    const submissionsCol = collection(db, "addressSubmissions");

    for (const submission of mockAddressSubmissions) {
      // Use the ID from mock data if provided, otherwise Firestore auto-generates
      const docRef = submission.id ? doc(submissionsCol, submission.id) : doc(submissionsCol);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...submissionData } = submission; // Exclude 'id' from data to be written if it's used for docRef
      batch.set(docRef, submissionData);
      operationsCount++;
    }

    await batch.commit();
    return {
      success: true,
      message: `Successfully seeded ${operationsCount} address submissions.`,
      operationsCount,
    };
  } catch (error) {
    console.error("Error seeding address submissions:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to seed address submissions: ${errorMessage}` };
  }
}

async function seedApiKeysData(): Promise<{ success: boolean; message: string; operationsCount?: number }> {
  try {
    const batch = writeBatch(db);
    let operationsCount = 0;
    const apiKeysCol = collection(db, "apiKeys");

    for (const apiKey of mockApiKeys) {
      const docRef = doc(apiKeysCol, apiKey.id); // Use apiKey.id as Document ID
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...apiKeyData } = apiKey; // Exclude 'id' from data to be written
      batch.set(docRef, apiKeyData);
      operationsCount++;
    }

    await batch.commit();
    return {
      success: true,
      message: `Successfully seeded ${operationsCount} API keys.`,
      operationsCount,
    };
  } catch (error) {
    console.error("Error seeding API keys:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to seed API keys: ${errorMessage}` };
  }
}