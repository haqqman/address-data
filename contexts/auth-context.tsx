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
    if (email === "webmanager@haqqman.com") return 'cto';
    if (email === "joshua+sandbox@haqqman.com") return 'manager';
    if (email.endsWith('@haqqman.com')) return 'administrator';
    return 'user';
  };

  const syncUserWithFirestore = async (firebaseUser: FirebaseUser, determinedRole: User['role']): Promise<User> => {
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
        if (existingData.role && consoleRoles.includes(existingData.role) && !consoleRoles.includes(determinedRole)) {
            finalRole = existingData.role;
        } else if (determinedRole === 'cto' || (determinedRole === 'manager' && existingData.role !== 'cto')) {
            finalRole = determinedRole;
        } else if (existingData.role) {
            finalRole = existingData.role;
        }

        const finalFirstName = existingData.firstName || baseDataFromAuth.firstName;
        const finalLastName = existingData.lastName || baseDataFromAuth.lastName;
        
        const dataToSet: Partial<User> & { lastLogin: any } = {
            email: baseDataFromAuth.email,
            firstName: finalFirstName,
            lastName: finalLastName,
            name: existingData.name || `${finalFirstName} ${finalLastName}`.trim(),
            role: finalRole,
            // Prefer existing phoneNumber, then auth provider's, then default to null
            phoneNumber: existingData.phoneNumber !== undefined ? existingData.phoneNumber : baseDataFromAuth.phoneNumber, 
            lastLogin: serverTimestamp(),
            authProvider: baseDataFromAuth.authProvider,
        };
        
        // Ensure phoneNumber is explicitly null if it ended up undefined
        if (dataToSet.phoneNumber === undefined) {
            dataToSet.phoneNumber = null;
        }

        await setDoc(userDocRef, dataToSet, { merge: true });

        return {
            id: firebaseUser.uid,
            ...dataToSet,
            createdAt: existingData.createdAt instanceof Timestamp ? existingData.createdAt.toDate() : (existingData.createdAt || undefined),
            lastLogin: new Date(), 
        } as User;

    } else { 
        const dataToSet: Partial<User> & { createdAt: any, lastLogin: any } = {
            ...baseDataFromAuth,
            role: finalRole, 
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            // Ensure phoneNumber is null if not provided by auth and it's a new user
            phoneNumber: baseDataFromAuth.phoneNumber === undefined ? null : baseDataFromAuth.phoneNumber,
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        const determinedRole = determineUserRole(firebaseUser.email);
        const appUser = await syncUserWithFirestore(firebaseUser, determinedRole);
        setUser(appUser);
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
        await firebaseSignOut(auth);
        setUser(null);
        throw new Error("Access Denied. Not a valid console user role.");
      }
    } else {
      router.push('/dashboard');
    }
    return firebaseUser;
  };

  const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
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
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      router.push(isConsole ? '/console' : '/login');
    } catch (error) {
      console.error("Error signing out:", error);
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

