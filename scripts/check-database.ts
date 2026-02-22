
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");
const dotenv = require("dotenv");

/**
 * DATABASE MIGRATION & INTEGRITY CHECK SCRIPT
 */

async function main() {
  console.log("--- AddressData Database Check ---");

  // Load environment variables
  const envPath = path.resolve(process.cwd(), ".env.local");
  dotenv.config({ path: envPath });

  let saJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  
  if (!saJson) {
    console.error("Error: FIREBASE_SERVICE_ACCOUNT not found. Ensure .env.local exists.");
    process.exit(1);
  }

  // Very aggressive cleaning of the env string before parsing
  saJson = saJson.trim();
  if (saJson.startsWith("'") && saJson.endsWith("'")) saJson = saJson.substring(1, saJson.length - 1);

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(saJson);
    
    // Fix private key: sometimes newlines are doubly escaped or lost
    if (serviceAccount.private_key) {
        let pk = serviceAccount.private_key;
        
        // Handle literal '\n' strings
        pk = pk.split('\\n').join('\n');
        
        // Remove potential carriage returns
        pk = pk.replace(/\r/g, '');
        
        // Ensure standard PEM format (64 chars per line)
        const header = "-----BEGIN PRIVATE KEY-----";
        const footer = "-----END PRIVATE KEY-----";
        const startIdx = pk.indexOf(header);
        const endIdx = pk.indexOf(footer);
        
        if (startIdx !== -1 && endIdx !== -1) {
            let body = pk.substring(startIdx + header.length, endIdx).replace(/\s+/g, '');
            // Attempt to fix potential truncation by adding base64 padding
            while (body.length % 4 !== 0) body += '=';
            // Re-wrap body at 64 chars
            const lines = body.match(/.{1,64}/g) || [];
            serviceAccount.private_key = header + '\n' + lines.join('\n') + '\n' + footer + '\n';
        } else {
             console.warn("Warning: Could not find PK headers. Using as-is.");
             serviceAccount.private_key = pk;
        }
    }
  } catch (e) {
    console.error("Error parsing FIREBASE_SERVICE_ACCOUNT JSON:", e.message);
    process.exit(1);
  }

  // Initialize Firebase
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (e) {
    console.error("Firebase Initialization Failed:", e.message);
    process.exit(1);
  }

  const db = getFirestore();
  const issuesFound = [];

  const collections = ["estates", "addressSubmissions", "consoleUsers"];
  
  for (const collName of collections) {
    console.log(`\nChecking '${collName}'...`);
    try {
      const snap = await db.collection(collName).get();
      console.log(`- Total: ${snap.size}`);
      
      snap.forEach(doc => {
        const data = doc.data();
        
        // Generic status check
        if (data.status === "pending_review") {
          issuesFound.push(`[${collName.toUpperCase()}] ${doc.id}: Legacy 'pending_review' status.`);
        }
        
        // Collection-specific checks
        if (collName === "estates") {
          if (data.status === "approved" && !data.estateCode) {
            issuesFound.push(`[ESTATE] ${doc.id}: Missing estateCode for approved estate.`);
          }
        }
        
        if (collName === "consoleUsers") {
          const validRoles = ["cto", "administrator", "manager"];
          if (data.role && !validRoles.includes(data.role)) {
            issuesFound.push(`[CONSOLE USER] ${doc.id}: Invalid role '${data.role}' found.`);
          }
        }
      });
    } catch (err) {
      console.error(`- Error reading ${collName}:`, err.message);
    }
  }

  console.log("\n--- Check Results ---");
  if (issuesFound.length === 0) {
    console.log("✅ No database inconsistencies found. Your data is healthy!");
  } else {
    console.log(`❌ Found ${issuesFound.length} issues:`);
    issuesFound.slice(0, 50).forEach(issue => console.log(issue));
    if (issuesFound.length > 50) console.log(`... and ${issuesFound.length - 50} more issues.`);
  }
}

main().catch(console.error);
