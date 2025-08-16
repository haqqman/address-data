/* eslint-disable no-console */
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: './.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

// --- IMPORTANT ---
// 1. Go to your Firebase Console -> Authentication -> Users tab.
// 2. Find the user with the email "webmanager@haqqman.com".
// 3. Copy the "User UID" for that user.
// 4. Paste the UID here, replacing "REPLACE_WITH_ACTUAL_UID_FROM_FIREBASE_AUTH".
const ctoUserUid = "REPLACE_WITH_ACTUAL_UID_FROM_FIREBASE_AUTH"; 
// --- IMPORTANT ---


const ctoUserData = {
  email: "webmanager@haqqman.com",
  firstName: "Abdulhaqq",
  lastName: "Sule",
  name: "Abdulhaqq Sule",
  role: "cto",
  phoneNumber: "+2347011568196",
  authProvider: "password", // or the provider they used, e.g., 'google.com'
  createdAt: serverTimestamp(),
  lastLogin: serverTimestamp(),
};


const seedConsoleUser = async () => {
    if (ctoUserUid === "REPLACE_WITH_ACTUAL_UID_FROM_FIREBASE_AUTH") {
        console.error("\n\n❌ ERROR: Please replace the placeholder UID in the scripts/seed-console-user.ts file with the actual User UID from your Firebase Authentication console.\n\n");
        return;
    }

    console.log(`Starting to seed the console user profile for ${ctoUserData.email}...`);
    
    const userDocRef = doc(db, "users", ctoUserUid);

    try {
        await setDoc(userDocRef, ctoUserData);
        console.log(`\n--- Seeding Complete! ---`);
        console.log(`Successfully created Firestore profile for user UID: ${ctoUserUid}`);
    } catch (error) {
        console.error("An error occurred during the console user seeding process:", error);
    }
};

seedConsoleUser().catch(error => {
    console.error("Failed to execute console user seeder:", error);
});
