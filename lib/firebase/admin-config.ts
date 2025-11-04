
import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS as string
);

export const initAdmin = () => {
  if (admin.apps.length > 0) {
    return;
  }
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};
