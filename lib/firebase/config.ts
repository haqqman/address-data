import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (!getApps().length) {
    if (
      !firebaseConfig.apiKey ||
      !firebaseConfig.authDomain ||
      !firebaseConfig.projectId
    ) {
      throw new Error(
        "Firebase config values (apiKey, authDomain, projectId) are missing. Check your .env.local file and ensure NEXT_PUBLIC_ prefixes are used."
      );
    }
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  if (app) {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } else {
    // This case should ideally not be reached if the above error is thrown for missing config
    console.error("Firebase app could not be initialized.");
  }
} catch (e) {
  console.error("CRITICAL: Firebase initialization failed:", e);
  // app, auth, db, storage will remain null
}


export { app, auth, db, storage };