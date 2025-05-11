// scripts/seed.ts
import { seedGeographyData } from '../app/actions/seedActions';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Debug log to check if the API key is loaded
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
if (apiKey && apiKey.length > 10) {
    console.log(`[DEBUG] API Key loaded. Starts with: ${apiKey.substring(0, 10)}...`);
} else if (apiKey) {
    console.log(`[DEBUG] API Key loaded (short or unusual): ${apiKey}`);
}
else {
    console.error("[DEBUG] Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) was NOT LOADED from .env.local. Please check the file path and format.");
}


async function runSeed() {
  console.log("Starting geography data seeding...");
  try {
    const result = await seedGeographyData();
    if (result.success) {
      console.log("Seeding successful:", result.message);
      if (result.operationsCount) {
        console.log("Total operations:", result.operationsCount);
      }
    } else {
      console.error("Seeding failed:", result.message);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("An unexpected error occurred during seeding:", errorMessage);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  }
}

runSeed();
