
"use server";

import { db } from "@/lib/firebase/config";
import type { GeographyState, GeographyLGA, GeographyCity, FirestoreGeographyStateData, FirestoreGeographyLGAData, FirestoreGeographyCityData } from "@/types";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  runTransaction
} from "firebase/firestore";

const GEOGRAPHY_COLLECTION = "nigerianGeography";
const LGAS_SUBCOLLECTION = "lgas";
const CITIES_SUBCOLLECTION = "cities";
const DISTRICTS_SUBCOLLECTION = "districts"; // For FCT

// --- State Actions ---
export async function addState(stateData: Omit<FirestoreGeographyStateData, 'id'>): Promise<GeographyState> {
  try {
    const stateId = stateData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');
    const stateRef = doc(db, GEOGRAPHY_COLLECTION, stateId);
    
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
    const stateRef = doc(db, GEOGRAPHY_COLLECTION, stateId);
    await runTransaction(db, async (transaction) => {
      const lgasSnapshot = await getDocs(collection(stateRef, LGAS_SUBCOLLECTION));
      if (!lgasSnapshot.empty) {
          // To cascade delete, one would iterate and delete each LGA, and recursively its cities.
          // For now, we prevent deletion if children exist as per original logic.
          throw new Error("Cannot delete state: It contains LGAs. Delete LGAs first or implement cascade delete.");
      }
      transaction.delete(stateRef);
    });
  } catch (error) {
    console.error("Error deleting state:", error);
    throw error; 
  }
}

// --- LGA Actions ---
export async function addLga(stateId: string, lgaData: Omit<FirestoreGeographyLGAData, 'id' | 'stateId'>): Promise<GeographyLGA> {
  try {
    const lgaId = lgaData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');
    const lgaRef = doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId);
    const dataToSet = { ...lgaData, stateId };
    
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
  } catch (error)
 {
    console.error("Error updating LGA:", error);
    throw new Error("Failed to update LGA.");
  }
}

export async function deleteLga(stateId: string, lgaId: string): Promise<void> {
  try {
    const lgaRef = doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId);
    await runTransaction(db, async (transaction) => {
      const citiesSnapshot = await getDocs(collection(lgaRef, CITIES_SUBCOLLECTION));
      const districtsSnapshot = await getDocs(collection(lgaRef, DISTRICTS_SUBCOLLECTION));
      if (!citiesSnapshot.empty || !districtsSnapshot.empty) {
        throw new Error("Cannot delete LGA: It contains cities/towns/districts. Delete them first or implement cascade delete.");
      }
      transaction.delete(lgaRef);
    });
  } catch (error) {
    console.error("Error deleting LGA:", error);
    throw error;
  }
}

// --- City/District Actions ---
export async function addCity(stateId: string, lgaId: string, cityData: Omit<FirestoreGeographyCityData, 'id' | 'stateId' | 'lgaId'>): Promise<GeographyCity> {
  try {
    const subcollection = stateId === 'fct' ? DISTRICTS_SUBCOLLECTION : CITIES_SUBCOLLECTION;
    const cityId = cityData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '');
    const cityRef = doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, subcollection, cityId);
    const dataToSet = { ...cityData, stateId, lgaId };

    await setDoc(cityRef, dataToSet);

    return { id: cityId, ...dataToSet };
  } catch (error) {
    console.error("Error adding City/District:", error);
    throw new Error("Failed to add City/District.");
  }
}

export async function getCitiesForLga(stateId: string, lgaId: string): Promise<GeographyCity[]> {
  try {
    const subcollectionName = stateId === 'fct' ? DISTRICTS_SUBCOLLECTION : CITIES_SUBCOLLECTION;
    const citiesCol = collection(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, subcollectionName);
    const q = query(citiesCol, orderBy("name"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      stateId: stateId,
      lgaId: lgaId,
      ...(docSnap.data() as Omit<FirestoreGeographyCityData, 'stateId' | 'lgaId'>)
    }));
  } catch (error) {
    console.error(`Error fetching from ${stateId === 'fct' ? 'districts' : 'cities'} for LGA:`, lgaId, error);
    return [];
  }
}

export async function updateCity(stateId: string, lgaId: string, cityId: string, dataToUpdate: Partial<Omit<FirestoreGeographyCityData, 'id' | 'stateId' | 'lgaId'>>): Promise<void> {
  try {
    const subcollection = stateId === 'fct' ? DISTRICTS_SUBCOLLECTION : CITIES_SUBCOLLECTION;
    const cityRef = doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, subcollection, cityId);
    await updateDoc(cityRef, dataToUpdate);
  } catch (error) {
    console.error("Error updating City/District:", error);
    throw new Error("Failed to update City/District.");
  }
}

export async function deleteCity(stateId: string, lgaId: string, cityId: string): Promise<void> {
  try {
    const subcollection = stateId === 'fct' ? DISTRICTS_SUBCOLLECTION : CITIES_SUBCOLLECTION;
    await deleteDoc(doc(db, GEOGRAPHY_COLLECTION, stateId, LGAS_SUBCOLLECTION, lgaId, subcollection, cityId));
  } catch (error) {
    console.error("Error deleting City/District:", error);
    throw new Error("Failed to delete City/District.");
  }
}

    