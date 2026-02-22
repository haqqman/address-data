'use server'

import { adminDb } from '@/firebase/server'
import type { AddressSubmission, Estate } from '@/types'
import { Filter, Timestamp } from 'firebase-admin/firestore'

// Helper function to convert Firestore Timestamps
const convertTimestamps = (docData: any): any => {
  const data = { ...docData }
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate()
    } else if (
      typeof data[key] === 'object' &&
      data[key] !== null &&
      !(data[key] instanceof Date)
    ) {
      data[key] = convertTimestamps(data[key])
    }
  }
  return data
}

// Search for approved addresses
async function searchAddresses(term: string): Promise<AddressSubmission[]> {
  const submissionsCol = adminDb.collection('addressSubmissions')

  // Note: Firestore does not support full-text search on its own.
  // This query looks for an exact match on the ADC or case-insensitive partial matches on address components.
  // Using Admin SDK `Filter`
  const query = submissionsCol.where(
    Filter.and(
      Filter.where('status', '==', 'approved'),
      Filter.or(
        Filter.where('adc', '==', term.toUpperCase()),
        Filter.where('submittedAddress.streetAddress', '>=', term),
        Filter.where('submittedAddress.streetAddress', '<=', term + '\uf8ff'),
        Filter.where('submittedAddress.city', '==', term),
        Filter.where('submittedAddress.lga', '==', term),
      ),
    ),
  )

  const querySnapshot = await query.get()
  const addresses: AddressSubmission[] = []
  querySnapshot.forEach((doc) => {
    const data = convertTimestamps(doc.data()) as Omit<AddressSubmission, 'id'>
    // Manual filtering for case-insensitivity as Firestore is limited
    const fullAddress =
      `${data.submittedAddress.streetAddress} ${data.submittedAddress.city} ${data.submittedAddress.lga}`.toLowerCase()
    if (
      data.adc === term.toUpperCase() ||
      fullAddress.includes(term.toLowerCase())
    ) {
      addresses.push({ id: doc.id, ...data })
    }
  })

  return addresses
}

// Search for approved estates
async function searchEstates(term: string): Promise<Estate[]> {
  const estatesCol = adminDb.collection('estates')

  const query = estatesCol.where(
    Filter.and(
      Filter.where('status', '==', 'verified'),
      Filter.or(
        Filter.where('estateCode', '==', term.toUpperCase()),
        Filter.where('name', '>=', term),
        Filter.where('name', '<=', term + '\uf8ff'),
      ),
    ),
  )

  const querySnapshot = await query.get()
  const estates: Estate[] = []
  querySnapshot.forEach((doc) => {
    const data = convertTimestamps(doc.data()) as Omit<Estate, 'id'>
    // Manual filtering for case-insensitivity
    if (
      data.estateCode === term.toUpperCase() ||
      data.name.toLowerCase().includes(term.toLowerCase())
    ) {
      estates.push({ id: doc.id, ...data })
    }
  })

  return estates
}

export async function searchByTerm(
  term: string,
): Promise<{ addresses: AddressSubmission[]; estates: Estate[] }> {
  if (!term || term.trim() === '') {
    return { addresses: [], estates: [] }
  }

  try {
    // Run searches in parallel
    const [addressResults, estateResults] = await Promise.all([
      searchAddresses(term),
      searchEstates(term),
    ])

    return {
      addresses: addressResults,
      estates: estateResults,
    }
  } catch (error) {
    console.error('Error performing search:', error)
    // In case of an error (e.g., missing Firestore index), return empty results
    return { addresses: [], estates: [] }
  }
}
