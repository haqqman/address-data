// app/actions/userActions.ts
"use server";

import { db } from "@/lib/firebase/config";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { z } from "zod";
import type { User } from "@/types";

// UIDs for the console users - REPLACE THESE WITH ACTUAL UIDs from Firebase Authentication
const CONSOLE_USER_UIDS = {
  abdulhaqq: "CONSOLE_USER_UID_ABDULHAQQ", // Replace with Abdulhaqq's actual UID
  joshua: "CONSOLE_USER_UID_JOSHUA",     // Replace with Joshua's actual UID
};

const consoleUserUpdateSchema = z.object({
  userIdToUpdate: z.enum(["abdulhaqq", "joshua"]),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  role: z.enum(["cto", "administrator", "manager"], { required_error: "Role is required."}),
});

export type ConsoleUserUpdateFormValues = z.infer<typeof consoleUserUpdateSchema>;

export async function updateConsoleUserDetails(
  values: ConsoleUserUpdateFormValues
): Promise<{ success: boolean; message: string }> {
  try {
    const { userIdToUpdate, firstName, lastName, phoneNumber, role } = values;
    const uid = CONSOLE_USER_UIDS[userIdToUpdate];

    if (!uid || uid.startsWith("CONSOLE_USER_UID_")) {
        return { success: false, message: `Placeholder UID for ${userIdToUpdate}. Please update the UID in userActions.ts.` };
    }

    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    const fullName = `${firstName} ${lastName}`;

    const dataToUpdate: Partial<User> = {
      name: fullName,
      phoneNumber: phoneNumber,
      role: role,
    };

    if (!userDoc.exists()) {
      // If user document doesn't exist, create it with the essential fields.
      // This scenario should be less common if users are created during auth.
      // For console users, their email is fixed.
      const email = userIdToUpdate === "abdulhaqq" ? "webmanager@haqqman.com" : "joshua+sandbox@haqqman.com";
      await setDoc(userRef, {
        ...dataToUpdate,
        email: email, // Add email if creating new
        createdAt: new Date(), // Add createdAt if creating new
        authProvider: "password", // Assuming password auth
      });
      return { success: true, message: `Successfully created and updated details for ${fullName}.` };
    } else {
      await updateDoc(userRef, dataToUpdate);
      return { success: true, message: `Successfully updated details for ${fullName}.` };
    }

  } catch (error) {
    console.error("Error updating console user details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update user details: ${errorMessage}` };
  }
}

