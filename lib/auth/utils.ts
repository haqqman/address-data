// lib/auth/utils.ts
import { auth } from '@/lib/firebase/config';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/types';

/**
 * Retrieves the current authenticated user.
 * IMPORTANT: This is a simplified version. For Server Components, robust server-side session management 
 * (e.g., verifying ID tokens from cookies/headers via Firebase Admin SDK) is recommended 
 * instead of relying directly on the Firebase client SDK's `auth.currentUser`.
 * This function's reliability in server components depends on how/where auth state is initialized and persisted.
 */
export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
      unsubscribe(); // Unsubscribe after first check to avoid memory leaks
      if (firebaseUser) {
        const isAdminUser = firebaseUser.email?.endsWith('@haqqman.com');
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          // photoURL: firebaseUser.photoURL, // Add to User type if needed
          role: isAdminUser ? 'admin' : 'user',
        };
        resolve(appUser);
      } else {
        resolve(null);
      }
    }, reject); // Handle potential errors during listener setup
  });
}

/**
 * Checks if the current authenticated user has an 'admin' role.
 * Relies on getCurrentUser. See notes on getCurrentUser for server-side considerations.
 */
export async function checkAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
