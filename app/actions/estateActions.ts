
"use server";

import { z } from "zod";
import type { Estate, User } from "@/types";
import { db } from "@/lib/firebase/config";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  orderBy,
  getDoc,
  where
} from "firebase/firestore";

const estateSchema = z.object({
  name: z.string().min(1, "Estate name is required"),
  state: z.string().min(1, "State is required"),
  lga: z.string().min(1, "LGA is required"),
  area: z.string().optional(),
  googleMapLink: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

// Helper to convert Firestore Timestamps to Date objects
const convertTimestamps = (docData: any): any => {
  const data = { ...docData };
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    } else if (typeof data[key] === 'object' && data[key] !== null && !(data[key] instanceof Date)) {
      convertTimestamps(data[key]);
    }
  }
  return data;
};

// Simplified code generation for now
const generateEstateCode = (state: string, lga: string): string => {
  const stateCode = state.substring(0, 3).toUpperCase();
  const lgaCode = lga.substring(0, 3).toUpperCase();
  const estateNumber = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${stateCode}-${lgaCode}-${estateNumber}`;
};

interface SubmitEstateParams {
  formData: FormData;
  user: Pick<User, 'id' | 'name' | 'email'>;
}

export async function submitEstate({ formData, user }: SubmitEstateParams) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validation = estateSchema.safeParse(rawFormData);

    if (!validation.success) {
        return { success: false, errors: validation.error.flatten().fieldErrors, message: "Validation failed." };
    }
    if (!user || !user.id) {
        return { success: false, message: "User not authenticated." };
    }

    const { name, state, lga, area, googleMapLink } = validation.data;

    try {
        const newEstateData: Omit<Estate, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdatedBy' | 'estateCode'> & { createdAt: any, updatedAt: any, lastUpdatedBy: any } = {
            name,
            status: "pending_review",
            location: { state, lga, area: area || "" },
            googleMapLink: googleMapLink || "",
            source: "Platform",
            createdBy: user.id,
            lastUpdatedBy: user.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            reviewedBy: null,
            reviewedAt: null,
            reviewNotes: null,
        };

        const docRef = await addDoc(collection(db, "estates"), newEstateData);

        return { success: true, message: "Estate submitted for review successfully!", estateId: docRef.id };
    } catch (error) {
        console.error("Error submitting estate:", error);
        return { success: false, message: "An internal error occurred." };
    }
}

export async function getEstates(status?: Estate['status']): Promise<Estate[]> {
  try {
    const estatesCol = collection(db, "estates");
    let q;
    
    if (status) {
      q = query(estatesCol, where("status", "==", status), orderBy("createdAt", "desc"));
    } else {
      q = query(estatesCol, orderBy("createdAt", "desc"));
    }
    
    const querySnapshot = await getDocs(q);
    const estates: Estate[] = [];
    querySnapshot.forEach((docSnap) => {
      estates.push({ id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Estate);
    });
    return estates;
  } catch (error) {
    console.error("Error fetching estates from Firestore:", error);
    return [];
  }
}

export async function getEstateById(estateId: string): Promise<Estate | null> {
  try {
    const estateRef = doc(db, "estates", estateId);
    const docSnap = await getDoc(estateRef);

    if (!docSnap.exists()) {
      console.log("No such estate found!");
      return null;
    }

    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Estate;
  } catch (error) {
    console.error("Error fetching estate from Firestore:", error);
    return null;
  }
}

export async function updateEstate(estateId: string, dataToUpdate: Partial<Omit<Estate, 'id' | 'createdAt' | 'createdBy'>>, userId: string): Promise<{ success: boolean; message: string }> {
    try {
        const estateRef = doc(db, "estates", estateId);

        const docSnap = await getDoc(estateRef);
        if(!docSnap.exists()) {
            return { success: false, message: "Estate not found." };
        }
        
        // Generate estate code only if it's being approved for the first time and doesn't have one
        const currentData = docSnap.data() as Estate;
        const isApproving = 'status' in dataToUpdate && dataToUpdate.status === 'approved';
        
        const updatePayload: any = {
            ...dataToUpdate,
            lastUpdatedBy: userId,
            updatedAt: serverTimestamp(),
        };

        if(isApproving && !currentData.estateCode) {
            updatePayload.estateCode = generateEstateCode(currentData.location.state, currentData.location.lga);
        }
        
        if (isApproving || (dataToUpdate.status && dataToUpdate.status === 'rejected')) {
            updatePayload.reviewedBy = userId;
            updatePayload.reviewedAt = serverTimestamp();
        }


        await updateDoc(estateRef, updatePayload);
        
        return { success: true, message: "Estate updated successfully." };
    } catch (error) {
        console.error("Error updating estate in Firestore:", error);
        return { success: false, message: "Failed to update estate." };
    }
}
