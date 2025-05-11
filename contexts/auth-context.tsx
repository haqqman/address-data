
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
import { auth, db } from '@/lib/firebase/config'; // Added db
import type { User } from '@/types';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Added getDoc, setDoc

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  signInWithGitHub: () => Promise<FirebaseUser | null>;
  signInWithEmail: (email: string, pass: string, isConsole?: boolean) => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Fetch user data from Firestore to get the role
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let role: User['role'] = 'user'; // Default role

        if (userDocSnap.exists()) {
          const userDataFromFirestore = userDocSnap.data() as User;
          role = userDataFromFirestore.role;
        } else {
          // If user doc doesn't exist, create it with a default role or derive it
          // This logic is crucial if users are created only via Firebase Auth initially
          // For console users, their specific roles should be set during seed or first login if possible
          if (firebaseUser.email === "webmanager@haqqman.com") {
            role = 'cto';
          } else if (firebaseUser.email === "joshua+sandbox@haqqman.com") {
            role = 'manager';
          } else if (firebaseUser.email?.endsWith('@haqqman.com')) {
            role = 'administrator';
          }
          // Optionally, save this derived role back to Firestore if it's the first time
          // await setDoc(userDocRef, { email: firebaseUser.email, name: firebaseUser.displayName, role: role }, { merge: true });
        }
        
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: role,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSuccessfulLogin = async (firebaseUser: FirebaseUser, isConsole: boolean = false) => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    let userDocSnap = await getDoc(userDocRef);
    let role: User['role'] = 'user';

    if (firebaseUser.email === "webmanager@haqqman.com") {
      role = 'cto';
    } else if (firebaseUser.email === "joshua+sandbox@haqqman.com") {
      role = 'manager';
    } else if (firebaseUser.email?.endsWith('@haqqman.com')) {
      role = 'administrator';
    }

    if (!userDocSnap.exists()) {
      // Create user document in Firestore if it doesn't exist
      await setDoc(userDocRef, {
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
        role: role,
        createdAt: new Date(),
        authProvider: firebaseUser.providerData[0]?.providerId || 'password',
      });
       userDocSnap = await getDoc(userDocRef); // Re-fetch after creation
    } else {
        // If user exists, ensure role is updated if it differs from the derived one
        // This is particularly for console users if their roles were not set correctly initially
        const existingData = userDocSnap.data();
        if (existingData && existingData.role !== role && (role === 'cto' || role === 'manager' || role === 'administrator')) {
             await setDoc(userDocRef, { role: role }, { merge: true });
        }
    }
    
    const finalRole = userDocSnap.exists() ? (userDocSnap.data() as User).role : role;

    const appUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      role: finalRole,
    };
    setUser(appUser);
    setLoading(false);

    if (isConsole) {
      if (finalRole === 'cto' || finalRole === 'administrator' || finalRole === 'manager') {
        router.push('/console/dashboard');
      } else {
        await firebaseSignOut(auth); // Sign out if not a console role
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
      if (result.user) {
        return await handleSuccessfulLogin(result.user);
      }
      setLoading(false);
      return null;
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
       if (result.user) {
        return await handleSuccessfulLogin(result.user);
      }
      setLoading(false);
      return null;
    } catch (error)
       {
      console.error("Error signing in with GitHub:", error);
      setLoading(false);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string, isConsole: boolean = false): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      if (isConsole) {
        if (email === "webmanager@haqqman.com" || email === "joshua+sandbox@haqqman.com" || email.endsWith('@haqqman.com') ) {
           // Proceed
        } else {
             setLoading(false);
             throw new Error("Console access restricted to specific @haqqman.com emails or general @haqqman.com domain.");
        }
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        return await handleSuccessfulLogin(userCredential.user, isConsole);
      }
       setLoading(false);
      return null;
    } catch (error) {
      console.error("Error signing in with email:", error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
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
