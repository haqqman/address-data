// scripts/seed.ts
import { seedGeographyData } from '../app/actions/seedActions';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });


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
    console.error("An unexpected error occurred during seeding:", error);
  }
}

runSeed();
