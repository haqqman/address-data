'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth, db } from '@/firebase/client'
import type { User } from '@/types'
import { useRouter } from 'next/navigation'
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { sendWelcomeEmail } from '@/emails'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<FirebaseUser | null>
  signInWithGitHub: () => Promise<FirebaseUser | null>
  signInWithEmail: (
    email: string,
    pass: string,
    isConsole?: boolean,
  ) => Promise<import('firebase/auth').UserCredential | null>
  signOut: (isConsole?: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const determineUserRole = (
    email: string | null | undefined,
  ): User['role'] => {
    if (!email) return 'user'
    if (email === 'webmanager@haqqman.com') return 'cto'
    if (email.endsWith('@haqqman.com')) return 'administrator' // Simplified default for haqqman emails
    return 'user'
  }

  const isConsoleRole = (role: User['role']) =>
    ['cto', 'administrator', 'manager'].includes(role)

  const syncUserWithFirestore = async (
    firebaseUser: FirebaseUser,
  ): Promise<User> => {
    if (!db) throw new Error('Firestore not available. User sync failed.')

    const determinedRole = determineUserRole(firebaseUser.email)
    const useConsoleCollection = isConsoleRole(determinedRole)
    const collectionName = useConsoleCollection ? 'consoleUsers' : 'users'
    const userDocRef = doc(db, collectionName, firebaseUser.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      // User exists, update their last login and return their profile
      const existingData = userDocSnap.data() as User
      try {
        await updateDoc(userDocRef, { lastLogin: serverTimestamp() })
      } catch (error) {
        console.warn(
          '[AuthProvider] Failed to update lastLogin timestamp. Proceeding with login.',
          error,
        )
      }

      // Ensure local user object has JS Dates, not Firestore Timestamps
      const appUser: User = {
        ...existingData,
        id: firebaseUser.uid,
        lastLogin: new Date(), // Set to now
        createdAt:
          existingData.createdAt instanceof Timestamp
            ? existingData.createdAt.toDate()
            : existingData.createdAt || new Date(),
      }
      return appUser
    } else {
      // New user registration
      if (useConsoleCollection) {
        // Prevent social logins from creating a console user profile directly
        const isPassword = firebaseUser.providerData.some(
          (p) => p.providerId === 'password'
        )
        if (!isPassword && firebaseUser.providerData.length > 0) {
          throw new Error(
            'Social logins are not permitted for initial console access. Please use email/password.',
          )
        }
      }

      const userFirstName =
        firebaseUser.displayName?.split(' ')[0] ||
        firebaseUser.email?.split('@')[0] ||
        'User'
      const userLastName =
        firebaseUser.displayName?.split(' ').slice(1).join(' ') || ''

      const newUserProfile: Omit<User, 'id' | 'createdAt' | 'lastLogin'> & {
        createdAt: any
        lastLogin: any
      } = {
        email: firebaseUser.email,
        firstName: userFirstName,
        lastName: userLastName,
        displayName:
          firebaseUser.displayName || `${userFirstName} ${userLastName}`.trim(),
        role: determinedRole, // Assign correct role instead of hardcoding 'user'
        authProvider: firebaseUser.providerData[0]?.providerId || 'unknown',
        phoneNumber: firebaseUser.phoneNumber || null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }

      await setDoc(userDocRef, newUserProfile)

      // Send welcome email to new user
      if (newUserProfile.email) {
        sendWelcomeEmail({
          name: newUserProfile.displayName || 'there',
          email: newUserProfile.email,
        })
      }

      return {
        id: firebaseUser.uid,
        ...newUserProfile,
        createdAt: new Date(),
        lastLogin: new Date(),
      } as User
    }
  }

  useEffect(() => {
    if (!auth || !db) {
      console.error(
        '[AuthProvider] Firebase auth or db service is not initialized. AuthProvider cannot function.',
      )
      setUser(null)
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        setLoading(true)
        if (firebaseUser) {
          try {
            // Check collections based on email domain to avoid permission errors
            const portalDocRef = doc(db!, 'users', firebaseUser.uid)
            const isHaqqmanEmail = firebaseUser.email?.endsWith('@haqqman.com')

            let consoleDocSnap
            if (isHaqqmanEmail) {
              const consoleDocRef = doc(db!, 'consoleUsers', firebaseUser.uid)
              consoleDocSnap = await getDoc(consoleDocRef)
            }
            const portalDocSnap = await getDoc(portalDocRef)

            let userDocSnap
            if (consoleDocSnap?.exists()) {
              userDocSnap = consoleDocSnap
            } else if (portalDocSnap.exists()) {
              userDocSnap = portalDocSnap
            }

            if (userDocSnap?.exists()) {
              const appUser = {
                id: firebaseUser.uid,
                ...userDocSnap.data(),
              } as User
              // Ensure timestamps are JS Dates
              if (appUser.createdAt && appUser.createdAt instanceof Timestamp)
                appUser.createdAt = appUser.createdAt.toDate()
              if (appUser.lastLogin && appUser.lastLogin instanceof Timestamp)
                appUser.lastLogin = appUser.lastLogin.toDate()
              setUser(appUser)
            } else {
              // First login may not have a profile document yet.
              // Bootstrap it instead of immediately signing out.
              console.warn(
                `[AuthProvider] User ${firebaseUser.uid} authenticated but not found in any user collection.`,
              )
              const appUser = await syncUserWithFirestore(firebaseUser)
              setUser(appUser)
            }
          } catch (error) {
            console.error(
              '[AuthProvider] Error in onAuthStateChanged > user sync:',
              error,
            )
            setUser(null)
            await firebaseSignOut(auth!)
          }
        } else {
          setUser(null)
        }
        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [])

  const handleSuccessfulLogin = async (
    firebaseUser: FirebaseUser,
    isConsoleAttempt: boolean = false,
  ) => {
    setLoading(true)

    // Check for user in Firestore collections
    const portalDocRef = doc(db!, 'users', firebaseUser.uid)
    const portalDocSnap = await getDoc(portalDocRef)

    // Only check consoleUsers if necessary
    const isHaqqmanEmail = firebaseUser.email?.endsWith('@haqqman.com')
    let consoleDocSnap

    if (isConsoleAttempt || isHaqqmanEmail) {
      const consoleDocRef = doc(db!, 'consoleUsers', firebaseUser.uid)
      consoleDocSnap = await getDoc(consoleDocRef)
    }

    // If it's a console login attempt, the user MUST exist in `consoleUsers` or be a valid haqqman email trying to create one.
    if (isConsoleAttempt && (!consoleDocSnap || !consoleDocSnap.exists())) {
      if (!isHaqqmanEmail) {
        console.warn(
          '[AuthProvider] Console login attempted by non-console user.',
        )
        await firebaseSignOut(auth!)
        setUser(null)
        setLoading(false)
        const authError = new Error('Access Denied. Not a valid console user.')
          ; (authError as any).code = 'auth/unauthorized-console-user'
        throw authError
      }
    }

    try {
      const appUser = await syncUserWithFirestore(firebaseUser)

      // Server actions rely on this cookie for auth context.
      const idToken = await firebaseUser.getIdToken()
      const sessionEndpoint = isConsoleRole(appUser.role)
        ? '/api/console/login'
        : '/api/portal/login'
      const sessionRes = await fetch(sessionEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      if (!sessionRes.ok) {
        throw new Error('Session could not be established. Please try again.')
      }

      setUser(appUser)
      setLoading(false)
      const redirectPath = isConsoleRole(appUser.role)
        ? '/console/dashboard'
        : '/dashboard'
      router.push(redirectPath)
      return firebaseUser
    } catch (e) {
      console.error('[AuthProvider] Error in handleSuccessfulLogin:', e)
      await firebaseSignOut(auth!)
      setUser(null)
      setLoading(false)
      throw e
    }
  }

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
    if (!auth) throw new Error('Firebase auth not initialized.')
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return await handleSuccessfulLogin(result.user, false)
    } catch (error) {
      console.error('[AuthProvider] Error signing in with Google:', error)
      setLoading(false)
      throw error
    }
  }

  const signInWithGitHub = async (): Promise<FirebaseUser | null> => {
    if (!auth) throw new Error('Firebase auth not initialized.')
    setLoading(true)
    try {
      const provider = new GithubAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return await handleSuccessfulLogin(result.user, false)
    } catch (error) {
      console.error('[AuthProvider] Error signing in with GitHub:', error)
      setLoading(false)
      throw error
    }
  }

  const signInWithEmail = async (
    email: string,
    pass: string,
    isConsole: boolean = false,
  ): Promise<import('firebase/auth').UserCredential | null> => {
    if (!auth) throw new Error('Firebase auth not initialized.')
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass)
      await handleSuccessfulLogin(userCredential.user, isConsole)
      return userCredential
    } catch (error) {
      console.error('[AuthProvider] Error signing in with email:', error)
      setLoading(false)
      throw error
    }
  }

  const signOut = async (isConsole: boolean = false) => {
    if (!auth) {
      console.error('Firebase auth not initialized. Cannot log out.')
      setUser(null)
      setLoading(false)
      router.push(isConsole ? '/console' : '/login')
      return
    }
    setLoading(true)
    try {
      await firebaseSignOut(auth)
      setUser(null)
      const logoutEndpoint = isConsole
        ? '/api/console/logout'
        : '/api/portal/logout'
      await fetch(logoutEndpoint, {
        method: 'POST',
      })
      router.push(isConsole ? '/console' : '/login')
    } catch (error) {
      console.error('Error signing out:', error)
      setUser(null)
      router.push(isConsole ? '/console' : '/login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
