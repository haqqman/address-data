import 'server-only'
import { cookies } from 'next/headers'
import { adminAuth, adminDb } from '@/firebase/server'
import { User } from '@/types'

export async function verifyServerSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const consoleSessionCookie = cookieStore.get('console_session')?.value
  const portalSessionCookie = cookieStore.get('portal_session')?.value
  const legacySessionCookie = cookieStore.get('session')?.value

  const sessionCookie =
    consoleSessionCookie || portalSessionCookie || legacySessionCookie
  const preferredCollection = consoleSessionCookie ? 'consoleUsers' : 'users'

  if (!sessionCookie) return null

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    )
    const uid = decodedClaims.uid

    let userDoc = await adminDb.collection(preferredCollection).doc(uid).get()

    if (!userDoc.exists) {
      const fallbackCollection =
        preferredCollection === 'consoleUsers' ? 'users' : 'consoleUsers'
      userDoc = await adminDb.collection(fallbackCollection).doc(uid).get()
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
