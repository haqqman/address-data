// app/actions/userActions.ts
"use server";

import { db } from "@/lib/firebase/config";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore"; // setDoc is kept for now, but logic changed
import { z } from "zod";
import type { User } from "@/types";

// Placeholder UIDs for checking against direct modification of critical, hardcoded UIDs
const PROTECTED_UIDS = [
  "CONSOLE_USER_UID_ABDULHAQQ", // Example, actual UIDs should be used if protection is desired
  "CONSOLE_USER_UID_JOSHUA",   // Example
];

// Updated schema to accept UID directly and remove firstName/lastName
const consoleUserUpdateSchema = z.object({
  uid: z.string().min(1, "UID is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  role: z.enum(["cto", "administrator", "manager"], { required_error: "Role is required."}),
});

export type ConsoleUserUpdateFormValues = z.infer<typeof consoleUserUpdateSchema>;

export async function updateConsoleUserDetails(
  values: ConsoleUserUpdateFormValues
): Promise<{ success: boolean; message: string }> {
  try {
    const validation = consoleUserUpdateSchema.safeParse(values);
    if (!validation.success) {
      return { success: false, message: "Invalid data provided. " + validation.error.flatten().fieldErrors };
    }

    const { uid, phoneNumber, role } = validation.data;

    // Optional: Prevent updating if the UID is one of the critical placeholder UIDs still in constants.
    // This check might be less relevant if UIDs are always actual Firestore UIDs.
    if (PROTECTED_UIDS.includes(uid) && (uid.startsWith("CONSOLE_USER_UID_"))) {
        return { success: false, message: `Cannot update user with placeholder UID: ${uid}. Please use actual Firestore UID.` };
    }

    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // For an "update" page, if the user document doesn't exist with the provided UID,
      // it's an error. Creating a new user here would require more information (like email).
      // The old logic had setDoc if userDoc.exists() was false, but it relied on hardcoded emails.
      return { success: false, message: `User with UID ${uid} not found. Cannot update.` };
    }
    
    // Only update phoneNumber and role. 'name' is not updated by this form anymore.
    // 'email' and 'createdAt' are also not touched here.
    const dataToUpdate: Partial<Pick<User, 'phoneNumber' | 'role'>> = {
      phoneNumber: phoneNumber,
      role: role,
    };

    await updateDoc(userRef, dataToUpdate);
    
    // Fetch the updated user's name for the success message if possible, or use UID.
    const updatedUserDoc = await getDoc(userRef);
    const updatedName = updatedUserDoc.data()?.name || `User UID: ${uid}`;

    return { success: true, message: `Successfully updated details for ${updatedName}.` };

  } catch (error) {
    console.error("Error updating console user details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update user details: ${errorMessage}` };
  }
}