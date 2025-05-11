
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
import { auth } from '@/lib/firebase/config';
import type { User } from '@/types';
import { useRouter } from 'next/navigation'; // Import useRouter

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, pass: string, isAdmin?: boolean) => Promise<FirebaseUser | null>; // Return FirebaseUser or null
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const isAdminUser = firebaseUser.email?.endsWith('@haqqman.com');
        
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: isAdminUser ? 'admin' : 'user',
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
      throw error;
    }
    // setLoading(false) will be handled by onAuthStateChanged
  };

  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
       if (result.user) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setLoading(false);
      throw error;
    }
    // setLoading(false) will be handled by onAuthStateChanged
  };

  const signInWithEmail = async (email: string, pass: string, isAdmin: boolean = false): Promise<FirebaseUser | null> => {
    setLoading(true);
    try {
      if (isAdmin && !email.endsWith('@haqqman.com')) {
        setLoading(false);
        throw new Error("Admin access restricted to @haqqman.com emails.");
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will set user, role, and loading.
      // Redirect handled in the component calling this, based on isAdmin flag or component context
      return userCredential.user;
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
      setUser(null); // Explicitly set user to null
      // Redirect can be handled in the component calling signOut or via a listener to user state
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
