
"use server";

import { db } from "@/lib/firebase/config";
import type { AddressSubmission, Estate } from "@/types";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  or
} from "firebase/firestore";

// Helper function to convert Firestore Timestamps
const convertTimestamps = (docData: any): any => {
    const data = { ...docData };
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate();
        } else if (typeof data[key] === 'object' && data[key] !== null && !(data[key] instanceof Date)) {
            data[key] = convertTimestamps(data[key]);
        }
    }
    return data;
};

// Search for approved addresses
async function searchAddresses(term: string): Promise<AddressSubmission[]> {
  const submissionsCol = collection(db, "addressSubmissions");
  
  // Note: Firestore does not support full-text search on its own.
  // This query looks for an exact match on the ADC or case-insensitive partial matches on address components.
  // For production, a dedicated search service like Algolia or Typesense is recommended.
  const q = query(
    submissionsCol,
    where("status", "==", "approved"),
    // This `or` condition is a composite query and requires a Firestore index.
    // Firebase will provide a link in the console error to create it automatically.
    or(
        where("adc", "==", term.toUpperCase()),
        where("submittedAddress.streetAddress", ">=", term),
        where("submittedAddress.streetAddress", "<=", term + '\uf8ff'),
        where("submittedAddress.city", "==", term),
        where("submittedAddress.lga", "==", term)
    )
  );

  const querySnapshot = await getDocs(q);
  const addresses: AddressSubmission[] = [];
  querySnapshot.forEach((doc) => {
    const data = convertTimestamps(doc.data()) as AddressSubmission;
    // Manual filtering for case-insensitivity as Firestore is limited
    const fullAddress = `${data.submittedAddress.streetAddress} ${data.submittedAddress.city} ${data.submittedAddress.lga}`.toLowerCase();
    if (data.adc === term.toUpperCase() || fullAddress.includes(term.toLowerCase())) {
        addresses.push({ id: doc.id, ...data });
    }
  });

  return addresses;
}

// Search for approved estates
async function searchEstates(term: string): Promise<Estate[]> {
  const estatesCol = collection(db, "estates");
  
  const q = query(
    estatesCol,
    where("status", "==", "approved"),
    or(
        where("estateCode", "==", term.toUpperCase()),
        where("name", ">=", term),
        where("name", "<=", term + '\uf8ff')
    )
  );

  const querySnapshot = await getDocs(q);
  const estates: Estate[] = [];
  querySnapshot.forEach((doc) => {
    const data = convertTimestamps(doc.data()) as Estate;
    // Manual filtering for case-insensitivity
    if (data.estateCode === term.toUpperCase() || data.name.toLowerCase().includes(term.toLowerCase())) {
        estates.push({ id: doc.id, ...data });
    }
  });
  
  return estates;
}


export async function searchByTerm(term: string): Promise<{ addresses: AddressSubmission[]; estates: Estate[] }> {
  if (!term || term.trim() === "") {
    return { addresses: [], estates: [] };
  }

  try {
    // Run searches in parallel
    const [addressResults, estateResults] = await Promise.all([
      searchAddresses(term),
      searchEstates(term),
    ]);

    return {
      addresses: addressResults,
      estates: estateResults,
    };
  } catch (error) {
    console.error("Error performing search:", error);
    // In case of an error (e.g., missing Firestore index), return empty results
    // to prevent the page from crashing.
    return { addresses: [], estates: [] };
  }
}
