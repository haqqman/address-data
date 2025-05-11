"use server";

import { db } from "@/lib/firebase/config";
import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { z } from "zod";
import type { User } from "@/types";

const PROTECTED_UIDS = [
  // These were placeholder UIDs, actual UIDs from Firebase Auth should be used.
  // "CONSOLE_USER_UID_ABDULHAQQ", 
  // "CONSOLE_USER_UID_JOSHUA",   
];

const consoleUserUpdateSchema = z.object({
  uid: z.string().min(1, "UID is required."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  role: z.enum(["cto", "administrator", "manager"], { required_error: "Role is required."}),
  email: z.string().email("Invalid email").optional(), // Email is optional for update, but required for creation if not exists
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

    const { uid, firstName, lastName, phoneNumber, role, email } = validation.data;

    // Placeholder UID check might be less relevant if actual UIDs are always used
    if (PROTECTED_UIDS.includes(uid) && (uid.startsWith("CONSOLE_USER_UID_"))) {
        return { success: false, message: `Cannot update user with placeholder UID: ${uid}. Please use actual Firestore UID.` };
    }

    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    const dataToUpdate: Partial<User> & { name?: string, lastLogin?: any, createdAt?: any, authProvider?: string } = {
      firstName: firstName,
      lastName: lastName,
      name: `${firstName} ${lastName}`, // Combined name
      phoneNumber: phoneNumber,
      role: role,
      lastLogin: serverTimestamp() 
    };
    
    if (email) dataToUpdate.email = email;


    if (!userDoc.exists()) {
      // If user doc doesn't exist, this means we are creating it from the temporary update page.
      // Ensure all necessary fields are present for creation.
      if (!email) { // Email is crucial for a new user profile
         return { success: false, message: `User with UID ${uid} not found. Email is required to create a new user profile.` };
      }
      dataToUpdate.email = email; // Ensure email is set
      dataToUpdate.createdAt = serverTimestamp();
      dataToUpdate.authProvider = 'password'; // Assuming password for console users initially
      await setDoc(userRef, dataToUpdate);
      return { success: true, message: `Successfully created and updated details for ${dataToUpdate.name || `User UID: ${uid}`}.` };
    }
    
    await updateDoc(userRef, dataToUpdate);
    
    const updatedUserDoc = await getDoc(userRef); 
    const updatedName = updatedUserDoc.data()?.name || `User UID: ${uid}`;

    return { success: true, message: `Successfully updated details for ${updatedName}.` };

  } catch (error) {
    console.error("Error updating console user details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update user details: ${errorMessage}` };
  }
}
