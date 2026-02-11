
import "server-only";
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  try {
    if (serviceAccountString) {
      const serviceAccount = JSON.parse(serviceAccountString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Fallback to default application credentials if env var is missing
      // This is useful for Cloud Run or when not setting manual credentials
      admin.initializeApp();
    }
  } catch (e) {
    console.error("Failed to parse or initialize Firebase Admin SDK credentials:", e);
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export default admin;
