'use server'

import { adminDb } from '@/firebase/server'
import { requireRefroshAdmin } from '@/lib/auth/server-utils'
import type {
  GeographyState,
  GeographyLGA,
  GeographyCity,
  FirestoreGeographyStateData,
  FirestoreGeographyLGAData,
  FirestoreGeographyCityData,
} from '@/types'

const GEOGRAPHY_COLLECTION = 'nigerianGeography'
const LGAS_SUBCOLLECTION = 'lgas'
const CITIES_SUBCOLLECTION = 'cities'
const DISTRICTS_SUBCOLLECTION = 'districts' // For FCT

// --- State Actions ---
export async function addState(
  stateData: Omit<FirestoreGeographyStateData, 'id'>,
): Promise<GeographyState> {
  try {
    await requireRefroshAdmin()
    const stateId = stateData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
    const stateRef = adminDb.collection(GEOGRAPHY_COLLECTION).doc(stateId)

    await stateRef.set(stateData)

    return { id: stateId, ...stateData }
  } catch (error) {
    console.error('Error adding state:', error)
    throw new Error('Failed to add state.')
  }
}

export async function getStates(): Promise<GeographyState[]> {
  try {
    const statesCol = adminDb.collection(GEOGRAPHY_COLLECTION)
    const snapshot = await statesCol.orderBy('name').get()

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as FirestoreGeographyStateData),
    }))
  } catch (error) {
    console.error('Error fetching states:', error)
    return []
  }
}

export async function updateState(
  stateId: string,
  dataToUpdate: Partial<FirestoreGeographyStateData>,
): Promise<void> {
  try {
    await requireRefroshAdmin()
    const stateRef = adminDb.collection(GEOGRAPHY_COLLECTION).doc(stateId)
    await stateRef.update(dataToUpdate)
  } catch (error) {
    console.error('Error updating state:', error)
    throw new Error('Failed to update state.')
  }
}

export async function deleteState(stateId: string): Promise<void> {
  try {
    await requireRefroshAdmin()
    const stateRef = adminDb.collection(GEOGRAPHY_COLLECTION).doc(stateId)

    await adminDb.runTransaction(async (transaction) => {
      const lgasSnapshot = await transaction.get(
        stateRef.collection(LGAS_SUBCOLLECTION),
      )
      if (!lgasSnapshot.empty) {
        throw new Error(
          'Cannot delete state: It contains LGAs. Delete LGAs first or implement cascade delete.',
        )
      }
      transaction.delete(stateRef)
    })
  } catch (error) {
    console.error('Error deleting state:', error)
    throw error
  }
}

// --- LGA Actions ---
export async function addLga(
  stateId: string,
  lgaData: Omit<FirestoreGeographyLGAData, 'id' | 'stateId'>,
): Promise<GeographyLGA> {
  try {
    await requireRefroshAdmin()
    const lgaId = lgaData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
    const lgaRef = adminDb
      .collection(GEOGRAPHY_COLLECTION)
      .doc(stateId)
      .collection(LGAS_SUBCOLLECTION)
      .doc(lgaId)
    const dataToSet = { ...lgaData, stateId }

    await lgaRef.set(dataToSet)

    return { id: lgaId, ...dataToSet }
  } catch (error) {
    console.error('Error adding LGA:', error)
    throw new Error('Failed to add LGA.')
  }
}

export async function getLgasForState(
  stateId: string,
): Promise<GeographyLGA[]> {
  try {
    const lgasCol = adminDb
      .collection(GEOGRAPHY_COLLECTION)
      .doc(stateId)
      .collection(LGAS_SUBCOLLECTION)
    const snapshot = await lgasCol.orderBy('name').get()

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      stateId: stateId,
      ...(doc.data() as Omit<FirestoreGeographyLGAData, 'stateId'>),
    }))
  } catch (error) {
    console.error('Error fetching LGAs for state:', stateId, error)
    return []
  }
}

export async function updateLga(
  stateId: string,
  lgaId: string,
  dataToUpdate: Partial<Omit<FirestoreGeographyLGAData, 'id' | 'stateId'>>,
): Promise<void> {
  try {
    await requireRefroshAdmin()
    const lgaRef = adminDb
      .collection(GEOGRAPHY_COLLECTION)
      .doc(stateId)
      .collection(LGAS_SUBCOLLECTION)
      .doc(lgaId)
    await lgaRef.update(dataToUpdate)
  } catch (error) {
    console.error('Error updating LGA:', error)
    throw new Error('Failed to update LGA.')
  }
}

export async function deleteLga(stateId: string, lgaId: string): Promise<void> {
  try {
    await requireRefroshAdmin()
    const lgaRef = adminDb
      .collection(GEOGRAPHY_COLLECTION)
      .doc(stateId)
      .collection(LGAS_SUBCOLLECTION)
      .doc(lgaId)

    await adminDb.runTransaction(async (transaction) => {
      const citiesSnapshot = await transaction.get(
        lgaRef.collection(CITIES_SUBCOLLECTION),
      )
      const districtsSnapshot = await transaction.get(
        lgaRef.collection(DISTRICTS_SUBCOLLECTION),
      )
      if (!citiesSnapshot.empty || !districtsSnapshot.empty) {
        throw new Error(
          'Cannot delete LGA: It contains cities/towns/districts. Delete them first or implement cascade delete.',
        )
      }
      transaction.delete(lgaRef)
    })
  } catch (error) {
    console.error('Error deleting LGA:', error)
    throw error
  }
}

// --- City/District Actions ---
export async function addCity(
  stateId: string,
  lgaId: string,
  cityData: Omit<FirestoreGeographyCityData, 'id' | 'stateId' | 'lgaId'>,
): Promise<GeographyCity> {
  try {
    await requireRefroshAdmin()
    const subcollection =
      stateId === 'fct' ? DISTRICTS_SUBCOLLECTION : CITIES_SUBCOLLECTION
    const cityId = cityData.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
    const cityRef = adminDb
      .collection(GEOGRAPHY_COLLECTION)
      .doc(stateId)
      .collection(LGAS_SUBCOLLECTION)
      .doc(lgaId)
      .collection(subcollection)
      .doc(cityId)
    const dataToSet = { ...cityData, stateId, lgaId }

    await cityRef.set(dataToSet)

    return { id: cityId, ...dataToSet }
  } catch (error) {
    console.error('Error adding City/District:', error)
    throw new Error('Failed to add City/District.')
  }
}

export async function getCitiesForLga(
  stateId: string,
  lgaId: string,
): Promise<GeographyCity[]> {
  try {
    const subcollectionName =
      stateId === 'fct' ? DISTRICTS_SUBCOLLECTION : CITIES_SUBCOLLECTION
    const citiesCol = adminDb
      .collection(GEOGRAPHY_COLLECTION)
      .doc(stateId)
      .collection(LGAS_SUBCOLLECTION)
      .doc(lgaId)
      .collection(subcollectionName)
    const snapshot = await citiesCol.orderBy('name').get()

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      stateId: stateId,
      lgaId: lgaId,
      ...(doc.data() as Omit<FirestoreGeographyCityData, 'stateId' | 'lgaId'>),
    }))
  } catch (error) {
    console.error(
      `Error fetching from ${stateId === 'fct' ? 'districts' : 'cities'} for LGA:`,
      lgaId,
      error,
    )
    return []
  }
}

export async function updateCity(
  stateId: string,
  lgaId: string,
  cityId: string,
  dataToUpdate: Partial<
    Omit<FirestoreGeographyCityData, 'id' | 'stateId' | 'lgaId'>
  >,
): Promise<void> {
  try {
    await requireRefroshAdmin()
    const subcollection =
      stateId === 'fct' ? DISTRICTS_SUBCOLLECTION : CITIES_SUBCOLLECTION
    const cityRef = adminDb
      .collection(GEOGRAPHY_COLLECTION)
      .doc(stateId)
      .collection(LGAS_SUBCOLLECTION)
      .doc(lgaId)
      .collection(subcollection)
      .doc(cityId)
    await cityRef.update(dataToUpdate)
  } catch (error) {
    console.error('Error updating City/District:', error)
    throw new Error('Failed to update City/District.')
  }
}

export async function deleteCity(
  stateId: string,
  lgaId: string,
  cityId: string,
): Promise<void> {
  try {
    await requireRefroshAdmin()
    const subcollection =
      stateId === 'fct' ? DISTRICTS_SUBCOLLECTION : CITIES_SUBCOLLECTION
    const cityRef = adminDb
      .collection(GEOGRAPHY_COLLECTION)
      .doc(stateId)
      .collection(LGAS_SUBCOLLECTION)
      .doc(lgaId)
      .collection(subcollection)
      .doc(cityId)
    await cityRef.delete()
  } catch (error) {
    console.error('Error deleting City/District:', error)
    throw new Error('Failed to delete City/District.')
  }
}
