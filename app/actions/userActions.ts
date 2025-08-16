
"use server";

import { auth, db } from "@/lib/firebase/config";
import { doc, updateDoc, getDoc, setDoc, serverTimestamp, collection, query, getDocs, orderBy, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser as deleteAuthUser } from "firebase/auth";
import { z } from "zod";
import type { User } from "@/types";


const PROTECTED_UIDS = [
  "DOUKechRV9NoSkNpgGL2jNCp6Sz2"
];

const consoleUserCreateSchema = z.object({
  email: z.string().email("Invalid email").refine(email => email.endsWith('@haqqman.com'), "Email must end with @haqqman.com"),
  password: z.string().min(6, "Password must be at least 6 characters."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phoneNumber: z.string().optional(),
  role: z.enum(["cto", "administrator", "manager"], { required_error: "Role is required."}),
});

const consoleUserUpdateSchema = z.object({
  uid: z.string().min(1, "UID is required."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phoneNumber: z.string().optional(),
  role: z.enum(["cto", "administrator", "manager"], { required_error: "Role is required."}),
});

// This type is exported and used in the frontend component for type safety.
export type ConsoleUserUpdateFormValues = z.infer<typeof consoleUserUpdateSchema>;


const convertUserTimestamps = (docData: any): User => {
  const data = { ...docData };
  if (data.createdAt && data.createdAt instanceof serverTimestamp) {
    data.createdAt = data.createdAt.toDate();
  }
   if (data.lastLogin && data.lastLogin instanceof serverTimestamp) {
    data.lastLogin = data.lastLogin.toDate();
  }
  return data as User;
};


export async function getConsoleUsers(): Promise<User[]> {
  try {
    const usersCol = collection(db, "consoleUsers");
    const q = query(
      usersCol, 
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const users: User[] = [];
    querySnapshot.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...convertUserTimestamps(docSnap.data()) } as User);
    });
    return users;
  } catch (error) {
    console.error("Error fetching console users from Firestore:", error);
    return [];
  }
}

export async function createConsoleUser(
  values: z.infer<typeof consoleUserCreateSchema>
): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    const validation = consoleUserCreateSchema.safeParse(values);
    if (!validation.success) {
      const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat().join(", ");
      return { success: false, message: `Invalid data: ${errorMessages}` };
    }
    
    const { email, password, firstName, lastName, phoneNumber, role } = validation.data;

    if (!auth) {
      throw new Error("Firebase Auth is not initialized.");
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: Omit<User, 'id'> = {
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      role,
      phoneNumber: phoneNumber || null,
      authProvider: 'password',
      createdAt: new Date(),
      lastLogin: new Date(),
    };
    
    const userDocRef = doc(db, "consoleUsers", user.uid);
    await setDoc(userDocRef, {
      ...userProfile,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });

    return { success: true, message: `Successfully created user ${email}.`, userId: user.uid };

  } catch (error: any) {
    console.error("Error creating console user:", error);
    const errorMessage = error.code === 'auth/email-already-in-use' 
      ? "This email is already in use by another account."
      : (error.message || "An unknown error occurred.");
    return { success: false, message: `Failed to create user: ${errorMessage}` };
  }
}


export async function updateConsoleUser(
  values: ConsoleUserUpdateFormValues
): Promise<{ success: boolean; message: string }> {
  try {
    const validation = consoleUserUpdateSchema.safeParse(values);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const errorMessages = Object.values(fieldErrors).flat().join(", ");
      return { success: false, message: `Invalid data provided: ${errorMessages}` };
    }

    const { uid, firstName, lastName, phoneNumber, role } = validation.data;
    
    if (PROTECTED_UIDS.includes(uid)) {
        return { success: false, message: `This is a protected user account and cannot be modified.` };
    }

    const userRef = doc(db, "consoleUsers", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        return { success: false, message: `User with UID ${uid} not found in consoleUsers collection.` };
    }

    const dataToUpdate: Partial<User> = {
      firstName: firstName,
      lastName: lastName,
      name: `${firstName} ${lastName}`,
      phoneNumber: phoneNumber || null,
      role: role,
    };
    
    await updateDoc(userRef, dataToUpdate);
    
    return { success: true, message: `Successfully updated details for ${dataToUpdate.name}.` };

  } catch (error) {
    console.error("Error updating console user details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update user details: ${errorMessage}` };
  }
}

export async function deleteConsoleUser(uid: string): Promise<{ success: boolean, message: string }> {
  try {
    if (PROTECTED_UIDS.includes(uid)) {
      return { success: false, message: "This is a protected user and cannot be deleted." };
    }

    // This action ONLY deletes the Firestore record, not the Auth user.
    // This is a safety measure. Auth user deletion should be a separate, more deliberate action.
    const userRef = doc(db, "consoleUsers", uid);
    await deleteDoc(userRef);
    
    return { success: true, message: "Console user profile deleted successfully. The authentication record still exists." };
  } catch (error) {
    console.error("Error deleting console user from Firestore:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to delete user profile: ${errorMessage}` };
  }
}
