
import admin from "firebase-admin";

export const initAdmin = () => {
  if (admin.apps.length > 0) {
    return;
  }

  const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!serviceAccountString) {
    console.error("Firebase Admin SDK credentials are not set in GOOGLE_APPLICATION_CREDENTIALS.");
    return;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e) {
    console.error("Failed to parse or initialize Firebase Admin SDK credentials:", e);
  }
};
