"use server";

import { db } from "@/lib/firebase/config";
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { z } from "zod";
import type { User } from "@/types";

const PROTECTED_UIDS = [
  "CONSOLE_USER_UID_ABDULHAQQ", 
  "CONSOLE_USER_UID_JOSHUA",   
];

const consoleUserUpdateSchema = z.object({
  uid: z.string().min(1, "UID is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  role: z.enum(["cto", "administrator", "manager"], { required_error: "Role is required."}),
  name: z.string().min(1, "Name is required").optional(), // Added name, make it optional if UID is primary for lookup
  email: z.string().email("Invalid email").optional(), // Added email, make it optional
});

export type ConsoleUserUpdateFormValues = z.infer<typeof consoleUserUpdateSchema>;

export async function updateConsoleUserDetails(
  values: ConsoleUserUpdateFormValues
): Promise<{ success: boolean; message: string }> {
  try {
    const validation = consoleUserUpdateSchema.safeParse(values);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const errorMessages = Object.values(fieldErrors).flat().join(", ");
      return { success: false, message: `Invalid data provided: ${errorMessages}` };
    }

    const { uid, phoneNumber, role, name, email } = validation.data;

    if (PROTECTED_UIDS.includes(uid) && (uid.startsWith("CONSOLE_USER_UID_"))) {
        return { success: false, message: `Cannot update user with placeholder UID: ${uid}. Please use actual Firestore UID.` };
    }

    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    const dataToUpdate: Partial<User> = {
      phoneNumber: phoneNumber,
      role: role,
      lastLogin: serverTimestamp() // Update lastLogin on profile update too
    };

    if (name) dataToUpdate.name = name;
    // Email is typically fixed post-creation, but if allowed to change:
    // if (email) dataToUpdate.email = email; 
    // It's safer to not allow email change here as it's primary identifier for Firebase Auth

    if (!userDoc.exists()) {
      // If user doc doesn't exist, this means we are creating it from the temporary update page.
      // Ensure all necessary fields are present for creation.
      if (!name || !email) {
         return { success: false, message: `User with UID ${uid} not found. Name and email are required to create a new user profile.` };
      }
      dataToUpdate.name = name;
      dataToUpdate.email = email;
      dataToUpdate.createdAt = serverTimestamp();
      dataToUpdate.authProvider = 'password'; // Assuming password for console users initially
      await setDoc(userRef, dataToUpdate);
      return { success: true, message: `Successfully created and updated details for ${name || `User UID: ${uid}`}.` };
    }
    
    await updateDoc(userRef, dataToUpdate);
    
    const updatedUserDoc = await getDoc(userRef); // Fetch again to get latest name if it was updated
    const updatedName = updatedUserDoc.data()?.name || `User UID: ${uid}`;

    return { success: true, message: `Successfully updated details for ${updatedName}.` };

  } catch (error) {
    console.error("Error updating console user details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update user details: ${errorMessage}` };
  }
}

// Seed function specifically for console users if needed by a script
export async function seedConsoleUser(userData: User) {
    const userRef = doc(db, "users", userData.id);
    await setDoc(userRef, {
        ...userData,
        createdAt: userData.createdAt || serverTimestamp(),
        lastLogin: serverTimestamp(),
    }, { merge: true }); // Merge to avoid overwriting if exists, but update key fields
}
