
// scripts/seed.ts
import { db } from '../lib/firebase/config';
import { collection, doc, writeBatch, Timestamp, getDoc, setDoc } from "firebase/firestore";
import { stateOptions, addressData as geographySourceData } from "../lib/geography-data";
import type { StateOption, StateData as GeographyStateData } from "../lib/geography-data";
import { config as dotenvConfig } from 'dotenv';
import type { User, AddressSubmission, APIKey } from '@/types'; // Ensure User type is imported

// Load environment variables from .env.local
dotenvConfig({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (!apiKey) {
    console.error("[ERROR] Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) was NOT LOADED. Please check your .env.local file and its path if running script from a different directory.");
    process.exit(1);
} else {
     console.log(`[INFO] Firebase API Key loaded successfully (starts with: ${apiKey.substring(0,10)}...).`);
}


interface SeedResult {
    success: boolean;
    message: string;
    operationsCount?: number;
}

const consoleUsersData = [
  {
    uid: "CONSOLE_USER_UID_ABDULHAQQ", // Replace with actual UID after creating in Firebase Auth
    email: "webmanager@haqqman.com",
    name: "Abdulhaqq Sule",
    role: "cto" as User['role'],
    phoneNumber: "+234 701 156 8196",
  },
  {
    uid: "CONSOLE_USER_UID_JOSHUA", // Replace with actual UID after creating in Firebase Auth
    email: "joshua+sandbox@haqqman.com",
    name: "Joshua Ajorgbor",
    role: "manager" as User['role'],
    phoneNumber: "+234 903 578 4325",
  }
];

async function seedConsoleUserProfiles(batch: FirebaseFirestore.WriteBatch): Promise<number> {
  let operationsCount = 0;
  console.log("\nAttempting to seed console user profiles to Firestore 'users' collection...");
  console.warn("IMPORTANT: Replace placeholder UIDs in `scripts/seed.ts` (CONSOLE_USER_UID_ABDULHAQQ, CONSOLE_USER_UID_JOSHUA) with actual Firebase Auth UIDs for these users for this seeding to work correctly.");

  for (const userData of consoleUsersData) {
    if (userData.uid.startsWith("CONSOLE_USER_UID_")) {
        console.warn(`Skipping user ${userData.email} due to placeholder UID. Please update the UID in the script.`);
        continue;
    }
    const userRef = doc(db, "users", userData.uid);
    const userDoc = await getDoc(userRef);

    const profileData = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        authProvider: "password", // Assuming password auth for console users
        createdAt: Timestamp.now() 
    };

    if (!userDoc.exists()) {
        batch.set(userRef, profileData);
        console.log(`Scheduled to CREATE profile for ${userData.email} with role ${userData.role}.`);
        operationsCount++;
    } else {
        batch.update(userRef, { role: userData.role, name: userData.name, phoneNumber: userData.phoneNumber }); // Ensure role is updated
        console.log(`Scheduled to UPDATE profile for ${userData.email} to ensure role ${userData.role}.`);
        operationsCount++;
    }
  }
  return operationsCount;
}


async function seedGeographyData(batch: FirebaseFirestore.WriteBatch): Promise<number> {
  let operationsCount = 0;
  console.log("\nAttempting to seed Nigerian Geography data (States, LGAs, Cities)...");

  for (const stateOpt of stateOptions) {
    const stateId = stateOpt.value.toLowerCase().replace(/\s+/g, "-");
    const stateDocRef = doc(db, "nigerianGeography", stateId);
    batch.set(stateDocRef, {
      name: stateOpt.title,
      capital: geographySourceData.find(s => s.state === stateOpt.value)?.capital || "", // Get capital if available
    });
    operationsCount++;

    const foundStateData: GeographyStateData | undefined = geographySourceData.find(
      (data: GeographyStateData) => data.state === stateOpt.value
    );

    if (foundStateData) {
      for (const lgaData of foundStateData.lgas) {
        const lgaDocId = lgaData.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
        const lgaDocRef = doc(collection(stateDocRef, "lgas"), lgaDocId);
        
        batch.set(lgaDocRef, { name: lgaData.name, stateId: stateId });
        operationsCount++;

        for (const cityData of lgaData.cities) {
          const cityDocId = cityData.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
          const cityDocRef = doc(collection(lgaDocRef, "cities"), cityDocId);

          batch.set(cityDocRef, { name: cityData.name, lgaId: lgaDocId, stateId: stateId });
          operationsCount++;
        }
      }
    }
  }
  return operationsCount;
}

const mockAddressSubmissions: Omit<AddressSubmission, 'id' | 'submittedAt' | 'reviewedAt'>[] = [
  {
    userId: "CONSOLE_USER_UID_ABDULHAQQ", // Replace with actual UID
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
    reviewerId: "CONSOLE_USER_UID_JOSHUA", // Replace with actual UID
    reviewNotes: "Looks good, verified via satellite.",
  },
  {
    userId: "CONSOLE_USER_UID_JOSHUA", // Replace with actual UID
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
    aiFlaggedReason": "Street name variation compared to Google Maps.",
  },
   {
    userId: "some_regular_user_id_placeholder", // Placeholder, or link to a generic test user
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
    aiFlaggedReason": "The user provided 'Test Discrepancy Layout' which is not found in Google Maps for this street.",
  }
];

async function seedAddressSubmissions(batch: FirebaseFirestore.WriteBatch): Promise<number> {
  let operationsCount = 0;
  console.log("\nAttempting to seed mock address submissions...");
  console.warn("Ensure UIDs in mockAddressSubmissions are updated if CONSOLE_USER_UID_... placeholders are used.");

  for (const submissionData of mockAddressSubmissions) {
     if (submissionData.userId.startsWith("CONSOLE_USER_UID_") || (submissionData.reviewerId && submissionData.reviewerId.startsWith("CONSOLE_USER_UID_"))) {
        console.warn(`Skipping/partially skipping submission for ${submissionData.userEmail} due to placeholder UID. Please update UIDs.`);
    }
    const submissionRef = doc(collection(db, "addressSubmissions"));
    batch.set(submissionRef, {
      ...submissionData,
      submittedAt: Timestamp.fromDate(new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30)), // Random time in last 30 days
      reviewedAt: submissionData.status === "approved" ? Timestamp.now() : null,
    });
    operationsCount++;
  }
  return operationsCount;
}

const mockApiKeys: Omit<APIKey, 'id' | 'createdAt' | 'lastUsedAt'>[] = [
  {
    userId: "developer_user_id_1_placeholder", // Placeholder
    userName: "Alice Wonderland",
    userEmail: "alice@example.com",
    publicKey: "pk_live_alicekeypublic123",
    privateKeyHash: "hashed_sk_live_alicekeyprivate123",
    isActive: true,
    name: "Alice's Main Key"
  },
  {
    userId: "developer_user_id_2_placeholder", // Placeholder
    userName: "Bob The Builder",
    userEmail: "bob@example.com",
    publicKey: "pk_live_bobkeypublic456",
    privateKeyHash: "hashed_sk_live_bobkeyprivate456",
    isActive: false,
    name: "Bob's Old Key"
  }
];

async function seedApiKeys(batch: FirebaseFirestore.WriteBatch): Promise<number> {
  let operationsCount = 0;
  console.log("\nAttempting to seed mock API keys...");

  for (const apiKeyData of mockApiKeys) {
    const apiKeyRef = doc(collection(db, "apiKeys")); // Auto-generate ID
    batch.set(apiKeyRef, {
      ...apiKeyData,
      createdAt: Timestamp.fromDate(new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 60)), // Random time in last 60 days
      lastUsedAt: apiKeyData.isActive && Math.random() > 0.5 ? Timestamp.now() : null,
    });
    operationsCount++;
  }
  return operationsCount;
}


async function runSeed() {
  console.log("Starting data seeding process...");
  const batch = writeBatch(db);
  let totalOperations = 0;

  try {
    // Seed Console User Profiles (Roles)
    const consoleUserOps = await seedConsoleUserProfiles(batch);
    totalOperations += consoleUserOps;
    console.log(`Console User Profiles: ${consoleUserOps > 0 ? `${consoleUserOps} operations scheduled.` : 'No operations (check UIDs).'}`);
    
    // Seed Geography Data
    const geographyOps = await seedGeographyData(batch);
    totalOperations += geographyOps;
    console.log(`Geography Data: ${geographyOps} operations scheduled.`);

    // Seed Address Submissions
    const submissionOps = await seedAddressSubmissions(batch);
    totalOperations += submissionOps;
    console.log(`Address Submissions: ${submissionOps} operations scheduled.`);

    // Seed API Keys
    const apiKeyOps = await seedApiKeys(batch);
    totalOperations += apiKeyOps;
    console.log(`API Keys: ${apiKeyOps} operations scheduled.`);

    if (totalOperations > 0) {
      await batch.commit();
      console.log(`\nBatch commit successful. Total operations: ${totalOperations}.`);
      console.log("Seeding process complete. Check Firestore console for data.");
    } else {
      console.log("\nNo operations were scheduled. Batch commit skipped. Ensure UIDs are updated in the script if seeding console users/submissions related to them.");
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during seeding.";
    console.error("Error during data seeding:", errorMessage);
    if ((error as any).details) {
        console.error("Error details:", (error as any).details);
    }
    process.exit(1); // Exit with error
  }
  
  console.log("\nRemember to manually create console users in Firebase Authentication if not already done, and update their UIDs in this script for profile seeding.");
  console.log("Refer to `docs/mock_user_credentials.md` for intended console user credentials.");
}

runSeed().catch(error => {
  console.error("Critical error in seeding script execution:", error);
});
