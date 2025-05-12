"use client";

import type { ReactNode} from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { User as FirebaseUser} from 'firebase/auth';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  signInWithGitHub: () => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, pass: string, isConsole?: boolean) => Promise<FirebaseUser | null>;
  signOut: (isConsole?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const determineUserRole = (email: string | null | undefined): User['role'] => {
    if (!email) return 'user';
    // Specific emails for CTO and manager roles
    if (email === "webmanager@haqqman.com") return 'cto';
    if (email === "joshua+sandbox@haqqman.com") return 'manager';
    // General rule for other @haqqman.com emails
    if (email.endsWith('@haqqman.com')) return 'administrator';
    return 'user';
  };

  const syncUserWithFirestore = async (firebaseUser: FirebaseUser, determinedRole: User['role']): Promise<User> => {
    if (!db) {
      console.error("Firestore (db) is not initialized. Cannot sync user.");
      throw new Error("Firestore not available. User sync failed.");
    }
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    let finalRole = determinedRole;
    let userFirstName = firebaseUser.displayName?.split(' ')[0] || firebaseUser.email?.split('@')[0] || 'User';
    let userLastName = firebaseUser.displayName?.split(' ').slice(1).join(' ') || '';
    
    const baseDataFromAuth: Partial<User> = {
        email: firebaseUser.email,
        firstName: userFirstName,
        lastName: userLastName,
        name: firebaseUser.displayName || `${userFirstName} ${userLastName}`.trim() || 'Anonymous User',
        role: determinedRole,
        authProvider: firebaseUser.providerData[0]?.providerId || 'password',
        phoneNumber: firebaseUser.phoneNumber || null, 
    };

    if (userDocSnap.exists()) {
        const existingData = userDocSnap.data() as User;
        
        const consoleRoles: User['role'][] = ['cto', 'manager', 'administrator'];
        // Role protection: if existing role is a console role, don't downgrade it unless new role is also console.
        // Prefer existing console role if current determinedRole is just 'user'.
        // Allow upgrade to higher console roles (cto > manager > admin).
        if (existingData.role && consoleRoles.includes(existingData.role)) {
            if (determinedRole === 'cto') finalRole = 'cto';
            else if (determinedRole === 'manager' && existingData.role !== 'cto') finalRole = 'manager';
            else if (determinedRole === 'administrator' && existingData.role !== 'cto' && existingData.role !== 'manager') finalRole = 'administrator';
            else finalRole = existingData.role; // Keep existing console role
        } else {
            finalRole = determinedRole; // Set to new role if existing isn't console or no existing role
        }


        const finalFirstName = existingData.firstName || baseDataFromAuth.firstName;
        const finalLastName = existingData.lastName || baseDataFromAuth.lastName;
        
        const dataToUpdate: Partial<User> & { lastLogin: any } = {
            email: baseDataFromAuth.email,
            firstName: finalFirstName,
            lastName: finalLastName,
            name: existingData.name || `${finalFirstName} ${finalLastName}`.trim(),
            role: finalRole,
            phoneNumber: existingData.phoneNumber !== undefined ? existingData.phoneNumber : (baseDataFromAuth.phoneNumber ?? null),
            lastLogin: serverTimestamp(),
            authProvider: baseDataFromAuth.authProvider,
        };
        
        if (dataToUpdate.phoneNumber === undefined) {
            dataToUpdate.phoneNumber = null;
        }

        await setDoc(userDocRef, dataToUpdate, { merge: true });

        return {
            id: firebaseUser.uid,
            ...dataToUpdate,
            createdAt: existingData.createdAt instanceof Timestamp ? existingData.createdAt.toDate() : (existingData.createdAt || new Date()), // Ensure createdAt is a Date
            lastLogin: new Date(), 
        } as User;

    } else { 
        const dataToSet: Partial<User> & { createdAt: any, lastLogin: any } = {
            ...baseDataFromAuth,
            role: finalRole, 
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            phoneNumber: baseDataFromAuth.phoneNumber ?? null,
        };

        await setDoc(userDocRef, dataToSet);
        
        return {
            id: firebaseUser.uid,
            ...dataToSet,
            createdAt: new Date(), 
            lastLogin: new Date(),
        } as User;
    }
  };


  useEffect(() => {
    if (!auth || !db) {
      console.error("Firebase auth or db service is not initialized. AuthProvider cannot function.");
      setUser(null);
      setLoading(false);
      return; // Exit if Firebase services are not available
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        const determinedRole = determineUserRole(firebaseUser.email);
        try {
          const appUser = await syncUserWithFirestore(firebaseUser, determinedRole);
          setUser(appUser);
        } catch (error) {
          console.error("Error in onAuthStateChanged > syncUserWithFirestore:", error);
          setUser(null); 
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleSuccessfulLogin = async (firebaseUser: FirebaseUser, isConsole: boolean = false) => {
    setLoading(true);
    const determinedRole = determineUserRole(firebaseUser.email);
    const appUser = await syncUserWithFirestore(firebaseUser, determinedRole);
    setUser(appUser);
    setLoading(false);

    const consoleRoles: User['role'][] = ['cto', 'administrator', 'manager'];
    if (isConsole) {
      if (appUser.role && consoleRoles.includes(appUser.role)) {
        router.push('/console/dashboard');
      } else {
        await firebaseSignOut(auth); // Sign out if not an authorized console role
        setUser(null);
        const authError = new Error("Access Denied. Not a valid console user role.");
        (authError as any).code = 'auth/unauthorized-console-role';
        throw authError;
      }
    } else {
      router.push('/dashboard');
    }
    return firebaseUser;
  };

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
    if (!auth) throw new Error("Firebase auth not initialized.");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await handleSuccessfulLogin(result.user);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
      throw error;
    }
  };

  const signInWithGitHub = async (): Promise<FirebaseUser | null> => {
    if (!auth) throw new Error("Firebase auth not initialized.");
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await handleSuccessfulLogin(result.user);
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string, isConsole: boolean = false): Promise<FirebaseUser | null> => {
    if (!auth) throw new Error("Firebase auth not initialized.");
    setLoading(true);
    try {
      const determinedRole = determineUserRole(email);
      const consoleRoles: User['role'][] = ['cto', 'administrator', 'manager'];
      if (isConsole && !consoleRoles.includes(determinedRole)) {
         setLoading(false);
         const authError = new Error("Access restricted. This email is not authorized for console access.");
         (authError as any).code = 'auth/unauthorized-console-access'; 
         throw authError;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      return await handleSuccessfulLogin(userCredential.user, isConsole);
    } catch (error) {
      console.error("Error signing in with email:", error);
      setLoading(false);
      throw error; 
    }
  };

  const signOut = async (isConsole: boolean = false) => {
    if (!auth) {
      console.error("Firebase auth not initialized. Cannot sign out.");
      // Attempt to clear local state and redirect anyway
      setUser(null);
      setLoading(false);
      router.push(isConsole ? '/console' : '/login');
      return;
    }
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      router.push(isConsole ? '/console' : '/login');
    } catch (error) {
      console.error("Error signing out:", error);
      // Still try to clear local state and redirect
      setUser(null);
      router.push(isConsole ? '/console' : '/login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithGitHub,
    signInWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
