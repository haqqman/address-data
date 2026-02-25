import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function test() {
  const email = `qa-test-${Date.now()}@example.com`;
  const password = 'password123';
  console.log('Creating auth user:', email);
  
  let user;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    user = cred.user;
    console.log('User created:', user.uid);
  } catch (e) {
    console.error('Error creating user', e);
    return;
  }
  
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userFirstName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User';
    const userLastName = user.displayName?.split(' ').slice(1).join(' ') || '';
    const determinedRole = 'user';
    const newUserProfile = {
      email: user.email,
      firstName: userFirstName,
      lastName: userLastName,
      displayName: user.displayName || `${userFirstName} ${userLastName}`.trim(),
      role: determinedRole,
      authProvider: user.providerData[0]?.providerId || 'unknown',
      phoneNumber: user.phoneNumber || null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    };
    
    console.log('Attempting to create doc...');
    await setDoc(userDocRef, newUserProfile);
    console.log('Doc created successfully!');
  } catch (e: any) {
    console.error('Error creating doc:', e.message);
  }
}
test().then(() => process.exit(0));
