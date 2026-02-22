import 'server-only'
import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/firebase/server'
import { User } from '@/types'

export async function verifyServerSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value

  if (!sessionCookie) {
    return null
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    )
    const uid = decodedClaims.uid

    // Check consoleUsers first (prioritize admins)
    let userDoc = await adminDb.collection('consoleUsers').doc(uid).get()
    let collectionName = 'consoleUsers'

    if (!userDoc.exists) {
      userDoc = await adminDb.collection('users').doc(uid).get()
      collectionName = 'users'
    }

    if (!userDoc.exists) {
      // User authenticated but no profile found
      return null
    }

    const userData = userDoc.data() as Omit<User, 'id'>

    // Convert Firestore Timestamps to Dates
    const safeUserData = {
      ...userData,
      id: uid,
      createdAt: (userData.createdAt as any)?.toDate
        ? (userData.createdAt as any).toDate()
        : new Date(userData.createdAt),
      lastLogin: (userData.lastLogin as any)?.toDate
        ? (userData.lastLogin as any).toDate()
        : new Date(userData.lastLogin),
    } as User

    return safeUserData
  } catch (error) {
    console.error('Error verifying session cookie:', error)
    return null
  }
}

export async function requireRefroshAdmin(): Promise<User> {
  const user = await verifyServerSession()
  if (!user || !['cto', 'administrator', 'manager'].includes(user.role)) {
    throw new Error('Unauthorized: Admin access required.')
  }
  return user
}
