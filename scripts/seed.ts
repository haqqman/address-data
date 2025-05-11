// scripts/seed.ts
import { seedAllMockData } from '../app/actions/seedActions';
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


async function runSeed() {
  console.log("Starting all mock data seeding processes...");
  try {
    const result = await seedAllMockData();
    console.log("\n--- Overall Seeding Summary ---");
    console.log(result.message);
    
    console.log("\n--- Detailed Results ---");
    result.results.forEach(res => {
      console.log(`\nType: ${res.type}`);
      console.log(`  Success: ${res.success}`);
      console.log(`  Message: ${res.message}`);
      if (res.operationsCount !== undefined) {
        console.log(`  Operations Count: ${res.operationsCount}`);
      }
    });

    if (!result.success) {
      console.error("\nOne or more seeding processes failed. Please check the logs above.");
    } else {
      console.log("\nAll seeding processes reported success.");
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("\nAn unexpected error occurred during the main seeding script execution:", errorMessage);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  }
}

runSeed();