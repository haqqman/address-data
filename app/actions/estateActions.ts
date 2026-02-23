'use server'

import { z } from 'zod'
import type { Estate, User } from '@/types'
import { adminDb } from '@/firebase/server'
import { verifyServerSession } from '@/lib/auth/server-utils'
import { customAlphabet } from 'nanoid'
import { Timestamp } from 'firebase-admin/firestore'

const estateSchema = z
  .object({
    name: z.string().min(3, 'Estate name must be at least 3 characters long.'),
    state: z.string().min(1, 'State is required.'),
    lga: z.string().min(1, 'LGA is required.'),
    city: z.string().optional(),
    district: z.string().optional(),
    googleMapLink: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.state === 'FCT') {
        return !!data.district && data.district.length > 0
      }
      return !!data.city && data.city.length > 0
    },
    {
      message: 'City or District is required based on the selected State.',
      path: ['city'],
    },
  )

// Helper to convert Firestore Timestamps to Date objects
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
      convertTimestamps(data[key])
    }
  }
  return data
}

const nanoid5 = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 5)
const generateUniqueEstateCode = async (
  state: string,
  lga: string,
): Promise<string> => {
  const estatesCol = adminDb.collection('estates')

  for (let attempt = 0; attempt < 10; attempt++) {
    const stateCode = state.substring(0, 3).toUpperCase()
    const lgaCode = lga.substring(0, 3).toUpperCase()
    const estateNumber = nanoid5()
    const code = `${stateCode}-${lgaCode}-${estateNumber}`

    // Check for uniqueness by querying the collection
    const snapshot = await estatesCol.where('estateCode', '==', code).get()

    if (snapshot.empty) {
      return code
    }
  }

  throw new Error('Failed to generate unique code')
}

interface SubmitEstateParams {
  formData: FormData
  user: Pick<User, 'id' | 'displayName' | 'email'>
}

export async function submitEstate({ formData, user }: SubmitEstateParams) {
  // Note: 'user' param is passed from client, but we should verify session for security.
  const sessionUser = await verifyServerSession()
  if (!sessionUser) {
    return { success: false, message: 'User not authenticated.' }
  }

  const rawFormData = Object.fromEntries(formData.entries())
  const validation = estateSchema.safeParse(rawFormData)

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      message: 'Validation failed.',
    }
  }

  const { name, state, lga, city, district, googleMapLink } = validation.data

  try {
    const location: Estate['location'] = { state, lga }
    if (state === 'FCT') {
      location.district = district
    } else {
      location.city = city
    }

    // Use sessionUser id for createdBy to ensure authenticity
    const newEstateData = {
      name,
      estateCode: await generateUniqueEstateCode(state, lga),
      status: 'pending-review',
      location,
      googleMapLink: googleMapLink || '',
      source: 'Platform',
      createdBy: sessionUser.id,
      lastUpdatedBy: sessionUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
    }

    const docRef = await adminDb.collection('estates').add(newEstateData)

    return {
      success: true,
      message: 'Estate submitted for review successfully!',
      estateId: docRef.id,
    }
  } catch (error) {
    console.error('Error submitting estate:', error)
    return { success: false, message: 'An internal error occurred.' }
  }
}

export async function getEstates(status?: Estate['status']): Promise<Estate[]> {
  try {
    const estatesCol = adminDb.collection('estates')
    let query

    if (status) {
      query = estatesCol.where('status', '==', status)
    } else {
      query = estatesCol.orderBy('createdAt', 'desc')
    }

    const querySnapshot = await query.get()
    const estates: Estate[] = []
    querySnapshot.forEach((doc) => {
      estates.push({ id: doc.id, ...convertTimestamps(doc.data()) } as Estate)
    })

    // If we queried by status, sort the results manually since we omitted orderBy to avoid index errors
    if (status) {
      estates.sort((a, b) => {
        const timeA = a.createdAt?.getTime?.() || 0
        const timeB = b.createdAt?.getTime?.() || 0
        return timeB - timeA
      })
    }

    return estates
  } catch (error) {
    console.error('Error fetching estates from Firestore:', error)
    return []
  }
}

export async function getEstateById(estateId: string): Promise<Estate | null> {
  try {
    const estateRef = adminDb.collection('estates').doc(estateId)
    const docSnap = await estateRef.get()

    if (!docSnap.exists) {
      console.log('No such estate found!')
      return null
    }

    return { id: docSnap.id, ...convertTimestamps(docSnap.data()) } as Estate
  } catch (error) {
    console.error('Error fetching estate from Firestore:', error)
    return null
  }
}

export async function updateEstate(
  estateId: string,
  dataToUpdate: Partial<Omit<Estate, 'id' | 'createdAt' | 'createdBy'>>,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await verifyServerSession()
    if (!user) {
      return { success: false, message: 'Unauthorized. Please log in.' }
    }

    const estateRef = adminDb.collection('estates').doc(estateId)
    const docSnap = await estateRef.get()

    if (!docSnap.exists) {
      return { success: false, message: 'Estate not found.' }
    }

    const currentData = docSnap.data() as Estate

    // Permission Check
    const isConsoleUser = ['cto', 'administrator', 'manager'].includes(
      user.role,
    )
    const isOwner = currentData.createdBy === user.id

    if (!isConsoleUser && !isOwner) {
      return {
        success: false,
        message: 'You do not have permission to update this estate.',
      }
    }

    const isApproving =
      'status' in dataToUpdate && dataToUpdate.status === 'verified'

    // Only console users can approve
    if (isApproving && !isConsoleUser) {
      return {
        success: false,
        message: 'Only administrators can verify estates.',
      }
    }

    // Generate estate code only if it's being approved for the first time and doesn't have one
    const updatePayload: any = {
      ...dataToUpdate,
      lastUpdatedBy: user.id,
      updatedAt: new Date(),
    }

    if (isApproving && !currentData.estateCode) {
      updatePayload.estateCode = await generateUniqueEstateCode(
        currentData.location.state,
        currentData.location.lga,
      )
    }

    if (
      isApproving ||
      (dataToUpdate.status && dataToUpdate.status === 'rejected')
    ) {
      updatePayload.reviewedBy = user.id
      updatePayload.reviewedAt = new Date()
    }

    await estateRef.update(updatePayload)

    return { success: true, message: 'Estate updated successfully.' }
  } catch (error) {
    console.error('Error updating estate:', error)
    return { success: false, message: 'Failed to update estate.' }
  }
}
