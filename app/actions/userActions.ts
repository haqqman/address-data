// app/actions/userActions.ts
"use server";

import { db } from "@/lib/firebase/config";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { z } from "zod";

// UIDs for the console users - REPLACE THESE WITH ACTUAL UIDs from Firebase Authentication
const CONSOLE_USER_UIDS = {
  abdulhaqq: "CONSOLE_USER_UID_ABDULHAQQ", // Replace with Abdulhaqq's actual UID
  joshua: "CONSOLE_USER_UID_JOSHUA",     // Replace with Joshua's actual UID
};

const consoleUserUpdateSchema = z.object({
  userIdToUpdate: z.enum(["abdulhaqq", "joshua"]),
  name: z.string().min(1, "Name is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
});

export type ConsoleUserUpdateFormValues = z.infer<typeof consoleUserUpdateSchema>;

export async function updateConsoleUserDetails(
  values: ConsoleUserUpdateFormValues
): Promise<{ success: boolean; message: string }> {
  try {
    const { userIdToUpdate, name, phoneNumber } = values;
    const uid = CONSOLE_USER_UIDS[userIdToUpdate];

    if (!uid || uid.startsWith("CONSOLE_USER_UID_")) {
        return { success: false, message: `Placeholder UID for ${userIdToUpdate}. Please update the UID in userActions.ts.` };
    }

    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { success: false, message: `User document for ${userIdToUpdate} (UID: ${uid}) not found in Firestore.` };
    }

    await updateDoc(userRef, {
      name: name,
      phoneNumber: phoneNumber,
    });

    return { success: true, message: `Successfully updated details for ${name}.` };
  } catch (error) {
    console.error("Error updating console user details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update user details: ${errorMessage}` };
  }
}
