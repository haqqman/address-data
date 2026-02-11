
"use server";

import { adminAuth, adminDb } from "@/firebase/server";
import { z } from "zod";
import type { User } from "@/types";
import { requireRefroshAdmin } from "@/lib/auth/server-utils";

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

export type ConsoleUserUpdateFormValues = z.infer<typeof consoleUserUpdateSchema>;

const convertAdminUserTimestamps = (docData: any): any => {
  const data = { ...docData };
  // Firestore Admin SDK returns Timestamp objects that have toDate()
  for (const key in data) {
    if (data[key] && typeof data[key].toDate === 'function') {
      data[key] = data[key].toDate();
    }
  }
  return data;
};

export async function getConsoleUsers(): Promise<User[]> {
  try {
    // Verify admin access
    await requireRefroshAdmin();

    const usersCol = adminDb.collection("consoleUsers");
    const snapshot = await usersCol.orderBy("createdAt", "desc").get();
    
    const users: User[] = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...convertAdminUserTimestamps(doc.data()) } as User);
    });
    return users;
  } catch (error) {
    console.error("Error fetching console users:", error);
    return [];
  }
}

export async function createConsoleUser(
  values: z.infer<typeof consoleUserCreateSchema>
): Promise<{ success: boolean; message: string; userId?: string }> {
  try {
    // Verify admin access
    await requireRefroshAdmin();

    const validation = consoleUserCreateSchema.safeParse(values);
    if (!validation.success) {
      const errorMessages = Object.values(validation.error.flatten().fieldErrors).flat().join(", ");
      return { success: false, message: `Invalid data: ${errorMessages}` };
    }
    
    const { email, password, firstName, lastName, phoneNumber, role } = validation.data;

    // Create Auth User
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      phoneNumber: phoneNumber || undefined,
    });

    const userProfile: Omit<User, 'id'> = {
      email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      role,
      phoneNumber: phoneNumber || null,
      authProvider: 'password',
      createdAt: new Date(),
      lastLogin: new Date(),
    };
    
    // Create Firestore Document
    await adminDb.collection("consoleUsers").doc(userRecord.uid).set({
      ...userProfile,
      createdAt: new Date(), // Admin SDK handles native JS Date objects fine
      lastLogin: new Date(),
    });

    return { success: true, message: `Successfully created user ${email}.`, userId: userRecord.uid };

  } catch (error: any) {
    console.error("Error creating console user:", error);
    const errorMessage = error.code === 'auth/email-already-exists' 
      ? "This email is already in use by another account."
      : (error.message || "An unknown error occurred.");
    return { success: false, message: `Failed to create user: ${errorMessage}` };
  }
}


export async function updateConsoleUser(
  values: ConsoleUserUpdateFormValues
): Promise<{ success: boolean; message: string }> {
  try {
    // Verify admin access
    await requireRefroshAdmin();

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

    const userRef = adminDb.collection("consoleUsers").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        return { success: false, message: `User with UID ${uid} not found.` };
    }

    const dataToUpdate = {
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`,
      phoneNumber: phoneNumber || null,
      role,
    };
    
    await userRef.update(dataToUpdate);
    
    // Also update Auth profile if name changed
    try {
        await adminAuth.updateUser(uid, {
            displayName: `${firstName} ${lastName}`,
        });
    } catch (authError) {
        console.warn("Failed to update Auth profile displayName:", authError);
    }
    
    return { success: true, message: `Successfully updated details for ${dataToUpdate.displayName}.` };

  } catch (error) {
    console.error("Error updating console user details:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update user details: ${errorMessage}` };
  }
}

export async function deleteConsoleUser(uid: string): Promise<{ success: boolean, message: string }> {
  try {
    // Verify admin access
    await requireRefroshAdmin();

    if (PROTECTED_UIDS.includes(uid)) {
      return { success: false, message: "This is a protected user and cannot be deleted." };
    }

    // Delete from Firestore
    await adminDb.collection("consoleUsers").doc(uid).delete();
    
    return { success: true, message: "Console user profile deleted successfully. The authentication record still exists." };
  } catch (error) {
    console.error("Error deleting console user:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to delete user profile: ${errorMessage}` };
  }
}

export async function getPortalUsers(): Promise<{ id: string; displayName: string | null; email: string | null }[]> {
  try {
    await requireRefroshAdmin();
    const usersCol = adminDb.collection("users");
    const snapshot = await usersCol.where("role", "==", "user").get();
    
    const users: { id: string; displayName: string | null; email: string | null }[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        id: doc.id,
        displayName: data.displayName || "Unnamed User",
        email: data.email || null,
      });
    });
    return users;
  } catch (error) {
    console.error("Error fetching portal users:", error);
    return [];
  }
}
