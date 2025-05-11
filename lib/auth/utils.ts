// lib/auth/utils.ts
import { auth, db } from '@/lib/firebase/config'; // Added db
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/types';
import { doc, getDoc } from 'firebase/firestore'; // Added getDoc

/**
 * Retrieves the current authenticated user with role from Firestore.
 */
export async function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      unsubscribe(); 
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        let role: User['role'] = 'user'; // Default role

        if (userDocSnap.exists()) {
          const userDataFromFirestore = userDocSnap.data() as User;
          role = userDataFromFirestore.role;
        } else {
          // Fallback role determination if Firestore doc doesn't exist (should be rare after login)
          if (firebaseUser.email === "webmanager@haqqman.com") {
            role = 'cto';
          } else if (firebaseUser.email === "joshua+sandbox@haqqman.com") {
            role = 'manager';
          } else if (firebaseUser.email?.endsWith('@haqqman.com')) {
            role = 'administrator';
          }
        }

        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role: role,
        };
        resolve(appUser);
      } else {
        resolve(null);
      }
    }, reject);
  });
}

/**
 * Checks if the current authenticated user has a console role ('cto', 'administrator', 'manager').
 */
export async function checkConsole(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    const consoleRoles: User['role'][] = ['cto', 'administrator', 'manager'];
    return user?.role ? consoleRoles.includes(user.role) : false;
  } catch (error) {
    console.error("Error checking console user status:", error);
    return false;
  }
}
