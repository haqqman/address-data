import 'server-only'
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const getApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0]
  }

  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT

  if (serviceAccountString) {
    try {
      // Filter out any potential characters that could break JSON parsing if env var is malformed
      const serviceAccount = JSON.parse(serviceAccountString.trim())
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    } catch (e) {
      console.error(
        '[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT:',
        e,
      )
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT environment variable.')
    }
  }

  // Fallback to default application credentials (e.g., for Cloud Run)
  try {
    return admin.initializeApp()
  } catch (e) {
    console.error(
      '[Firebase Admin] Failed to initialize with default credentials:',
      e,
    )
    throw e
  }
}

const app = getApp()

if (!app) {
  throw new Error('Firebase Admin failed to initialize.')
}

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
export default admin
