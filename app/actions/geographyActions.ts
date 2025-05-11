"use server";

import { db } from "@/lib/firebase/config";
import type { GeographyState, GeographyLGA, GeographyCity, FirestoreGeographyStateData, FirestoreGeographyLGAData, FirestoreGeographyCityData } from "@/types";
import { 
  collection, 
  doc, 
  setDoc, // Changed from addDoc/updateDoc for add operations
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";

const GEOGRAPHY_COLLECTION = "nigerianGeography";
const LGAS_SUBCOLLECTION = "lgas";
const CITIES_SUBCOLLECTION = "cities";

// --- State Actions ---
export async function addState(stateData: Omit<FirestoreGeographyStateData, 'id'>): Promise<GeographyState> {
  try {
    const stateId = stateData.name.toLowerCase().replace(/\s+/g, "-");
    const stateRef = doc(db, GEOGRAPHY_COLLECTION, stateId);
    
    // Use setDoc to create or overwrite the document with the predictable ID
    await setDoc(stateRef, stateData);

    return { id: stateId, ...stateData };
  } catch (error) {
    console.error("Error adding state:", error);
    throw new Error("Failed to add state.");
  }
}

export async function getStates(): Promise<GeographyState[]> {
  try {
    const statesCol = collection(db, GEOGRAPHY_COLLECTION);
    const q = query(statesCol, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as FirestoreGeographyStateData)
    }));
  } catch (error) {
    console.error("Error fetching states:", error);
    return [];
  }
}

export async function updateState(stateId: string, dataToUpdate: Partial<FirestoreGeographyStateData>): Promise<void> {
  try {
    const stateRef = doc(db, GEOGRAPHY_COLLECTION, stateId);
    await updateDoc(stateRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating state:", error);
    throw new Error("Failed to update state.");
  }
}

export async function deleteState(stateId: string): Promise<void> {
  try {
    const lgasSnapshot = await getDocs(collection(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION));
    if (!lgasSnapshot.empty) {
        throw new Error("Cannot delete state: It contains LGAs. Delete LGAs first.");
    }
    await deleteDoc(doc(db, GEOGRAPHY_COLLECTION, stateId));
  } catch (error) {
    console.error("Error deleting state:", error);
    throw error; 
  }
}

// --- LGA Actions ---
export async function addLga(stateId: string, lgaData: Omit<FirestoreGeographyLGAData, 'id' | 'stateId'>): Promise<GeographyLGA> {
  try {
    const lgaId = lgaData.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
    const lgaRef = doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId);
    const dataToSet = { ...lgaData, stateId };
    
    // Use setDoc to create or overwrite the document with the predictable ID
    await setDoc(lgaRef, dataToSet);

    return { id: lgaId, ...dataToSet };
  } catch (error) {
    console.error("Error adding LGA:", error);
    throw new Error("Failed to add LGA.");
  }
}

export async function getLgasForState(stateId: string): Promise<GeographyLGA[]> {
  try {
    const lgasCol = collection(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION);
    const q = query(lgasCol, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      stateId: stateId, 
      ...(docSnap.data() as Omit<FirestoreGeographyLGAData, 'stateId'>)
    }));
  } catch (error) {
    console.error("Error fetching LGAs for state:", stateId, error);
    return [];
  }
}

export async function updateLga(stateId: string, lgaId: string, dataToUpdate: Partial<Omit<FirestoreGeographyLGAData, 'id' | 'stateId'>>): Promise<void> {
  try {
    const lgaRef = doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId);
    await updateDoc(lgaRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating LGA:", error);
    throw new Error("Failed to update LGA.");
  }
}

export async function deleteLga(stateId: string, lgaId: string): Promise<void> {
  try {
    const citiesSnapshot = await getDocs(collection(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, CITIES_SUBCOLLECTION));
    if (!citiesSnapshot.empty) {
        throw new Error("Cannot delete LGA: It contains cities/towns. Delete them first.");
    }
    await deleteDoc(doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId));
  } catch (error) {
    console.error("Error deleting LGA:", error);
    throw error;
  }
}

// --- City Actions ---
export async function addCity(stateId: string, lgaId: string, cityData: Omit<FirestoreGeographyCityData, 'id' | 'stateId' | 'lgaId'>): Promise<GeographyCity> {
  try {
    const cityId = cityData.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
    const cityRef = doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, CITIES_SUBCOLLECTION, cityId);
    const dataToSet = { ...cityData, stateId, lgaId };

    // Use setDoc to create or overwrite the document with the predictable ID
    await setDoc(cityRef, dataToSet);

    return { id: cityId, ...dataToSet };
  } catch (error) {
    console.error("Error adding City:", error);
    throw new Error("Failed to add City.");
  }
}

export async function getCitiesForLga(stateId: string, lgaId: string): Promise<GeographyCity[]> {
  try {
    const citiesCol = collection(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, CITIES_SUBCOLLECTION);
    const q = query(citiesCol, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      stateId: stateId,
      lgaId: lgaId,
      ...(docSnap.data() as Omit<FirestoreGeographyCityData, 'stateId' | 'lgaId'>)
    }));
  } catch (error) {
    console.error("Error fetching Cities for LGA:", lgaId, error);
    return [];
  }
}

export async function updateCity(stateId: string, lgaId: string, cityId: string, dataToUpdate: Partial<Omit<FirestoreGeographyCityData, 'id' | 'stateId' | 'lgaId'>>): Promise<void> {
  try {
    const cityRef = doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, CITIES_SUBCOLLECTION, cityId);
    await updateDoc(cityRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating City:", error);
    throw new Error("Failed to update City.");
  }
}

export async function deleteCity(stateId: string, lgaId: string, cityId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, CITIES_SUBCOLLECTION, cityId));
  } catch (error) {
    console.error("Error deleting City:", error);
    throw new Error("Failed to delete City.");
  }
}
