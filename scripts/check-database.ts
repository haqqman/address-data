import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * DATABASE INTEGRITY CHECK SCRIPT
 * 
 * This script checks for:
 * 1. Legacy status strings (e.g. 'pending_review' instead of 'pending-review')
 * 2. Missing estateCode for verified estates
 * 3. Invalid roles in consoleUsers
 * 
 * Usage: npx tsx scripts/check-database.ts [.env file]
 */

async function main() {
  console.log("--- AddressData Database Check ---");

  // Load environment variables
  const envFile = process.argv[2] || ".env.local";
  const envPath = path.resolve(process.cwd(), envFile);
  console.log(`Using environment file: ${envFile}`);
  dotenv.config({ path: envPath });

  let saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!saJson) {
    console.error("Error: FIREBASE_SERVICE_ACCOUNT not found in environment.");
    console.log("Make sure you are pointing to the correct .env file.");
    process.exit(1);
  }

  // Cleaning the env string (handling quotes and newlines)
  saJson = saJson.trim();
  if (saJson.startsWith("'") && saJson.endsWith("'")) {
    saJson = saJson.substring(1, saJson.length - 1);
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(saJson);
    // Robust private key parsing
    if (serviceAccount.private_key) {
        let pk = serviceAccount.private_key;
        pk = pk.split('\\n').join('\n').replace(/\r/g, '');
        const header = "-----BEGIN PRIVATE KEY-----";
        const footer = "-----END PRIVATE KEY-----";
        const startIdx = pk.indexOf(header);
        const endIdx = pk.indexOf(footer);
        
        if (startIdx !== -1 && endIdx !== -1) {
            let body = pk.substring(startIdx + header.length, endIdx).replace(/\s+/g, '');
            while (body.length % 4 !== 0) body += '=';
            const lines = body.match(/.{1,64}/g) || [];
            serviceAccount.private_key = header + '\n' + lines.join('\n') + '\n' + footer + '\n';
        }
    }
  } catch (e: any) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT JSON:", e.message);
    process.exit(1);
  }

  // Initialize Firebase Admin
  try {
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
  } catch (e: any) {
    console.error("Firebase Initialization Failed:", e.message);
    process.exit(1);
  }

  const db = admin.firestore();
  const collections = ["estates", "addressSubmissions", "consoleUsers"];
  const issuesFound: string[] = [];

  for (const collName of collections) {
    console.log(`\nChecking collection: ${collName}...`);
    try {
      const snapshot = await db.collection(collName).get();
      console.log(`- Found ${snapshot.size} documents.`);

      snapshot.forEach(doc => {
        const data = doc.data();
        
        // 1. Check for legacy status strings
        if (data.status === "pending_review") {
          issuesFound.push(`[${collName.toUpperCase()}] ${doc.id}: Legacy status 'pending_review' found.`);
        }

        // 2. Collection-specific checks
        if (collName === "estates") {
          if (data.status === "verified" && !data.estateCode) {
            issuesFound.push(`[ESTATE] ${doc.id}: Missing estateCode for verified estate.`);
          }
        }
        
        if (collName === "consoleUsers") {
          const validRoles = ["cto", "administrator", "manager", "user"];
          if (data.role && !validRoles.includes(data.role)) {
            issuesFound.push(`[CONSOLE_USER] ${doc.id}: Invalid role '${data.role}'.`);
          }
        }
      });
    } catch (err: any) {
      console.error(`- Error reading ${collName}:`, err.message);
    }
  }

  console.log("\n--- Check Results ---");
  if (issuesFound.length === 0) {
    console.log("✅ No integrity issues found. Your data is healthy!");
  } else {
    console.log(`❌ Found ${issuesFound.length} issues:`);
    issuesFound.forEach(issue => console.log(`  - ${issue}`));
    console.log("\nRecommendation: Run migration scripts to fix these issues.");
  }
}

main().catch(console.error);
