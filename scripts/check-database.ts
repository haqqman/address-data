
import { adminDb } from "../firebase/server";

async function checkDatabase() {
  console.log("--- Checking Database for Inconsistencies ---");

  const collections = ["users", "consoleUsers", "estates", "addressSubmissions", "apiKeys"];
  
  for (const collectionName of collections) {
    console.log(`\nChecking collection: ${collectionName}`);
    try {
      const snapshot = await adminDb.collection(collectionName).get();
      console.log(`Total documents: ${snapshot.size}`);

      snapshot.forEach(doc => {
        const data = doc.data();
        const id = doc.id;

        // 1. Check for 'pending_review' typo
        if (data.status === "pending_review") {
          console.log(`[ISSUE] Doc ${id} in ${collectionName} has legacy status 'pending_review'. Needs update to 'pending-review'.`);
        }

        // 2. Check estates for missing estateCode or location issues
        if (collectionName === "estates") {
          if (!data.estateCode && data.status === "approved") {
            console.log(`[ISSUE] Approved Estate ${id} is missing an estateCode.`);
          }
          if (!data.location || !data.location.state || (!data.location.city && !data.location.district)) {
             console.log(`[ISSUE] Estate ${id} has incomplete location data:`, data.location);
          }
        }

        // 3. Check consoleUsers for invalid roles
        if (collectionName === "consoleUsers") {
          const validRoles = ["cto", "administrator", "manager"];
          if (!validRoles.includes(data.role)) {
            console.log(`[ISSUE] Console User ${id} (${data.email}) has an invalid role: ${data.role}`);
          }
        }
      });
    } catch (error) {
      console.error(`Error checking collection ${collectionName}:`, error);
    }
  }

  console.log("\n--- Database Check Complete ---");
}

checkDatabase().catch(console.error);
