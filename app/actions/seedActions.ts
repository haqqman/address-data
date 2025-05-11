
"use server";

import { db } from "@/lib/firebase/config";
import { collection, doc, writeBatch } from "firebase/firestore";
import { stateOptions, addressData } from "@/lib/geography-data";
import type { StateOption, StateData, Lga, City } from "@/lib/geography-data";

export async function seedGeographyData(): Promise<{ success: boolean; message: string; operationsCount?: number }> {
  try {
    const batch = writeBatch(db);
    let operationsCount = 0;

    for (const stateOpt of stateOptions) {
      const stateDocRef = doc(db, "nigerianGeography", stateOpt.value);
      batch.set(stateDocRef, {
        name: stateOpt.title,
        // Capital is not provided in the source data, so we omit it or set to null/empty
        capital: "", 
      });
      operationsCount++;

      const foundStateData: StateData | undefined = addressData.find(
        (data: StateData) => data.state === stateOpt.value
      );

      if (foundStateData) {
        for (const lgaData of foundStateData.lgas) {
          // Sanitize LGA name for document ID if it contains slashes
          const lgaDocId = lgaData.name.replace(/\//g, "-");
          const lgaCollectionRef = collection(stateDocRef, "lgas");
          const lgaDocRef = doc(lgaCollectionRef, lgaDocId);
          
          batch.set(lgaDocRef, {
            name: lgaData.name, // Storing as provided (lowercase, may include slashes)
          });
          operationsCount++;

          for (const cityData of lgaData.cities) {
            // Sanitize City name for document ID if it contains slashes
            const cityDocId = cityData.name.replace(/\//g, "-");
            const cityCollectionRef = collection(lgaDocRef, "cities");
            const cityDocRef = doc(cityCollectionRef, cityDocId);

            batch.set(cityDocRef, {
              name: cityData.name, // Storing as provided (lowercase, may include slashes)
            });
            operationsCount++;
          }
        }
      }
    }

    await batch.commit();
    return { 
        success: true, 
        message: `Successfully seeded geographical data. Total operations: ${operationsCount}.`,
        operationsCount 
    };

  } catch (error) {
    console.error("Error seeding geography data:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to seed geography data: ${errorMessage}` };
  }
}
