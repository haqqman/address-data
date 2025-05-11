
// scripts/seed.ts
import { db } from '../lib/firebase/config'; // Adjusted path
import { collection, doc, writeBatch, Timestamp } from "firebase/firestore";
import { stateOptions, addressData } from "../lib/geography-data"; // Adjusted path
import type { StateOption, StateData } from "../lib/geography-data"; // Adjusted path
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Debug log to check if the API key is loaded
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (apiKey && apiKey.length > 10) {
    console.log(`[DEBUG] Firebase API Key loaded. Starts with: ${apiKey.substring(0, 10)}...`);
} else if (apiKey) {
    console.log(`[DEBUG] Firebase API Key loaded (short or unusual): ${apiKey}`);
} else {
    console.error("[ERROR] Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) was NOT LOADED from .env.local. Please check the file path and format.");
    process.exit(1); // Exit if API key is not loaded
}

async function seedGeographyData(): Promise<{ success: boolean; message: string; operationsCount?: number }> {
  try {
    const batch = writeBatch(db);
    let operationsCount = 0;

    for (const stateOpt of stateOptions) {
      const stateDocRef = doc(db, "nigerianGeography", stateOpt.value); // Using state value (e.g., "lagos") as doc ID
      batch.set(stateDocRef, {
        name: stateOpt.title, // User-friendly name (e.g., "Lagos")
        capital: "", // Capital is not in current source data, can be added later
      });
      operationsCount++;

      const foundStateData: StateData | undefined = addressData.find(
        (data: StateData) => data.state === stateOpt.value
      );

      if (foundStateData) {
        for (const lgaData of foundStateData.lgas) {
          const lgaDocId = lgaData.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-"); // Sanitize LGA name for ID
          const lgaCollectionRef = collection(stateDocRef, "lgas");
          const lgaDocRef = doc(lgaCollectionRef, lgaDocId);
          
          batch.set(lgaDocRef, { name: lgaData.name }); // Store original LGA name
          operationsCount++;

          for (const cityData of lgaData.cities) {
            const cityDocId = cityData.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-"); // Sanitize city name for ID
            const cityCollectionRef = collection(lgaDocRef, "cities");
            const cityDocRef = doc(cityCollectionRef, cityDocId);

            batch.set(cityDocRef, { name: cityData.name }); // Store original city name
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


async function runSeed() {
  console.log("Starting data seeding process...");
  
  // --- Geography Data Seeding ---
  console.log("\nAttempting to seed Nigerian Geography data (States, LGAs, Cities)...");
  try {
    const geoResult = await seedGeographyData();
    console.log(`Geography Data Seeding Result: ${geoResult.message} (Success: ${geoResult.success})`);
    if (geoResult.operationsCount) {
        console.log(`Geography operations: ${geoResult.operationsCount}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error seeding geography data.";
    console.error("Error during geography data seeding:", errorMessage);
  }

  // --- Other Seeding (Removed/Commented Out) ---
  // console.log("\nMock address submissions and API keys are no longer seeded by this script.");
  // console.log("These should be managed via the application UI or direct Firestore operations.");
  
  // Example: Seeding admin users - This should ideally be done once manually in Firebase Auth
  // and then their profile data (if any) in Firestore.
  // For this script, we will not create Firebase Auth users.
  // We can ensure their profiles exist in a 'users' collection if needed by other parts of the app.

  console.log("\nSeeding process complete. Check logs for details.");
  console.log("Remember to manually create admin users in Firebase Authentication console if not already done.");
  console.log("Refer to `docs/mock_user_credentials.md` for intended admin credentials.");
}

runSeed().catch(error => {
  console.error("Critical error in seeding script execution:", error);
});
