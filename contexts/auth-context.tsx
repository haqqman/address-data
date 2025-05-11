
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
import { auth } from '@/lib/firebase/config'; // Assuming this is your Firebase config file
import type { User } from '@/types'; // Your custom User type

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, pass: string, isAdmin?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Check if the user is an admin (example logic, adjust as needed)
        // For this example, we'll assume an admin user has a specific claim or email domain
        // In a real app, this check might be more robust, e.g., custom claims
        const isAdminUser = firebaseUser.email?.endsWith('@haqqman.com');
        
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          // photoURL: firebaseUser.photoURL, // You can add this to your User type if needed
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
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
      throw error; // Re-throw to be caught by UI
    }
  };

  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
      setLoading(false);
      throw error; // Re-throw to be caught by UI
    }
  };

  const signInWithEmail = async (email: string, pass: string, isAdmin: boolean = false) => {
    setLoading(true);
    try {
      if (isAdmin && !email.endsWith('@haqqman.com')) {
        throw new Error("Admin access restricted to @haqqman.com emails.");
      }
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting the user and role
    } catch (error) {
      console.error("Error signing in with email:", error);
      setLoading(false);
      throw error; // Re-throw to be caught by UI
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error; // Re-throw to be caught by UI
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
