
"use server";

import { db } from "@/lib/firebase/config";
import type { APIKey, User } from "@/types";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  orderBy,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { randomBytes } from "crypto"; // For generating secure random strings
// import bcrypt from 'bcryptjs'; // For hashing private keys - install if not present: npm install bcryptjs @types/bcryptjs

// Helper to convert Firestore Timestamps in APIKey objects
const convertApiKeyTimestamps = (docData: any): APIKey => {
  const data = { ...docData };
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    }
  }
  return data as APIKey;
};

// Function to generate a new API key pair (mocking private key handling)
const generateKeyPair = (): { publicKey: string; privateKey: string; privateKeyHash: string } => {
  const publicKey = `pk_live_${randomBytes(12).toString('hex')}`;
  const privateKey = `sk_live_${randomBytes(24).toString('hex')}`;
  // In a real app, hash the privateKey before storing. For now, storing a placeholder.
  // const salt = bcrypt.genSaltSync(10);
  // const privateKeyHash = bcrypt.hashSync(privateKey, salt);
  const privateKeyHash = `hashed_${privateKey.substring(0,15)}`; // Placeholder
  return { publicKey, privateKey, privateKeyHash };
};

export async function createApiKey({ 
  userId, 
  userName, 
  userEmail, 
  keyName 
}: { 
  userId: string; 
  userName?: string; 
  userEmail?: string; 
  keyName?: string; 
}): Promise<{ success: boolean; message: string; apiKey?: APIKey & { privateKey?: string } }> {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required to create an API key." };
    }

    const { publicKey, privateKey, privateKeyHash } = generateKeyPair();
    
    const apiKeyData: Omit<APIKey, 'id' | 'createdAt'> & { createdAt: any } = {
      userId,
      userName: userName || "User", // Default if not provided
      userEmail: userEmail || "user@example.com", // Default if not provided
      publicKey,
      privateKeyHash, // Store the hash
      createdAt: serverTimestamp(),
      lastUsedAt: null,
      isActive: true,
      name: keyName || "Untitled Key",
    };

    const docRef = await addDoc(collection(db, "apiKeys"), apiKeyData);
    
    return { 
      success: true, 
      message: "API Key created successfully. Secure your private key, it will not be shown again.",
      apiKey: { id: docRef.id, ...apiKeyData, createdAt: new Date(), privateKey } // Return private key ONLY on creation
    };
  } catch (error) {
    console.error("Error creating API key in Firestore:", error);
    return { success: false, message: "Failed to create API key." };
  }
}

export async function getUserApiKeys(userId: string): Promise<APIKey[]> {
  try {
    if (!userId) return [];
    const apiKeysCol = collection(db, "apiKeys");
    const q = query(apiKeysCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const keys: APIKey[] = [];
    querySnapshot.forEach((doc) => {
      keys.push({ id: doc.id, ...convertApiKeyTimestamps(doc.data()) });
    });
    return keys;
  } catch (error) {
    console.error("Error fetching user API keys from Firestore:", error);
    return [];
  }
}

export async function getAllApiKeys(): Promise<APIKey[]> {
  try {
    const apiKeysCol = collection(db, "apiKeys");
    const q = query(apiKeysCol, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const keys: APIKey[] = [];
    querySnapshot.forEach((doc) => {
      keys.push({ id: doc.id, ...convertApiKeyTimestamps(doc.data()) });
    });
    return keys;
  } catch (error) {
    console.error("Error fetching all API keys from Firestore:", error);
    return [];
  }
}

export async function revokeApiKey(apiKeyId: string): Promise<{ success: boolean; message: string }> {
  try {
    const keyRef = doc(db, "apiKeys", apiKeyId);
    await updateDoc(keyRef, { isActive: false, lastUsedAt: serverTimestamp() }); // Optionally update lastUsedAt on revoke
    return { success: true, message: `API Key ${apiKeyId} revoked successfully.` };
  } catch (error) {
    console.error("Error revoking API key in Firestore:", error);
    return { success: false, message: "Failed to revoke API key." };
  }
}

export async function reactivateApiKey(apiKeyId: string): Promise<{ success: boolean; message: string }> {
    try {
      const keyRef = doc(db, "apiKeys", apiKeyId);
      await updateDoc(keyRef, { isActive: true });
      return { success: true, message: `API Key ${apiKeyId} reactivated successfully.` };
    } catch (error) {
      console.error("Error reactivating API key in Firestore:", error);
      return { success: false, message: "Failed to reactivate API key." };
    }
}

export async function deleteApiKey(apiKeyId: string): Promise<{ success: boolean; message: string }> {
  try {
    const keyRef = doc(db, "apiKeys", apiKeyId);
    await deleteDoc(keyRef);
    return { success: true, message: `API Key ${apiKeyId} deleted successfully.` };
  } catch (error) {
    console.error("Error deleting API key in Firestore:", error);
    return { success: false, message: "Failed to delete API key." };
  }
}
