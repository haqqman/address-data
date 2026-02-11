
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
let serviceAccountStr = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const serviceKeyLine = envContent.split('\n').find(line => line.startsWith('FIREBASE_SERVICE_ACCOUNT='));
  if (serviceKeyLine) {
    // Extract the value part after "FIREBASE_SERVICE_ACCOUNT="
    let value = serviceKeyLine.substring('FIREBASE_SERVICE_ACCOUNT='.length).trim();
    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    // Only unescape quotes. Do NOT unescape newlines as JSON.parse expects \n to represent newline.
    // In the .env file, \" is used for quotes inside the string.
    serviceAccountStr = value.replace(/\\"/g, '"'); 
  }
} catch (err) {
  console.error('Error reading .env.local:', err);
  process.exit(1);
}

if (!serviceAccountStr) {
  console.error('FIREBASE_SERVICE_ACCOUNT not found in .env.local');
  process.exit(1);
}

let serviceAccount;
try {
   serviceAccount = JSON.parse(serviceAccountStr);
   // Check private key format
   if (serviceAccount.private_key) {
      console.log('Private Key sample:', serviceAccount.private_key.substring(0, 50));
      console.log('Has newline char:', serviceAccount.private_key.includes('\n'));
      console.log('Has literal \\n:', serviceAccount.private_key.includes('\\n'));
      // Fix newlines if necessary
      if (!serviceAccount.private_key.includes('\n') && serviceAccount.private_key.includes('\\n')) {
          console.log('Fixing newlines in private key...');
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }
   }
} catch (e) {
   console.error("Failed to parse service account JSON", e);
   process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const email = 'test@haqqman.com';
const password = 'Password123!';
const displayName = 'Test Admin';

async function createOrUpdateUser() {
  try {
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log(`User ${email} already exists. Updating password...`);
      await admin.auth().updateUser(userRecord.uid, {
        password: password,
        displayName: displayName,
        emailVerified: true,
      });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log(`Creating user ${email}...`);
        userRecord = await admin.auth().createUser({
          email: email,
          password: password,
          displayName: displayName,
          emailVerified: true,
        });
      } else {
        throw error;
      }
    }

    console.log(`User ${email} setup complete.`);
    console.log(`UID: ${userRecord.uid}`);
    
    // Also ensure the user is in the Firestore `consoleUsers` collection
    const db = admin.firestore();
    const userDocRef = db.collection('consoleUsers').doc(userRecord.uid);
    await userDocRef.set({
      email: email,
      displayName: displayName,
      role: 'administrator',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    console.log(`User added to consoleUsers collection.`);

  } catch (error) {
    console.error('Error creating/updating user:', error);
  }
}

createOrUpdateUser();
