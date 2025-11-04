
import admin from "firebase-admin";

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS 
  ? JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  : undefined;

export const initAdmin = () => {
  if (admin.apps.length > 0) {
    return;
  }
  if (!serviceAccount) {
    console.error("Firebase Admin SDK credentials are not set. Check GOOGLE_APPLICATION_CREDENTIALS.");
    return;
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

// Export admin itself for dynamic import
export default admin;
