'use server'

import { adminDb } from '@/firebase/server'
import { verifyServerSession } from '@/lib/auth/server-utils'
import type { APIKey } from '@/types'
import { Timestamp } from 'firebase-admin/firestore'
import { randomBytes } from 'crypto'

const convertApiKeyTimestamps = (docData: any): APIKey => {
  const data = { ...docData }
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    data.createdAt = data.createdAt.toDate()
  }
  if (data.lastUsedAt && typeof data.lastUsedAt.toDate === 'function') {
    data.lastUsedAt = data.lastUsedAt.toDate()
  }
  if (data.lastUsedAt === undefined) {
    data.lastUsedAt = null
  }

  return data as APIKey
}

const generateKeyPair = (): {
  publicKey: string
  privateKey: string
  privateKeyHash: string
} => {
  const publicKey = `pk_live_${randomBytes(12).toString('hex')}`
  const privateKey = `sk_live_${randomBytes(24).toString('hex')}`
  // In a real app, hash this properly with bcrypt/argon2. For now, we mock it or store a substring.
  // Ideally, we should NEVER store the private key, only the hash.
  const privateKeyHash = `hashed_${privateKey.substring(0, 15)}...`
  return { publicKey, privateKey, privateKeyHash }
}

export async function createApiKey({
  keyName,
  userId,
}: {
  keyName?: string
  userId?: string
}): Promise<{
  success: boolean
  message: string
  apiKey?: APIKey & { privateKey?: string }
}> {
  try {
    const sessionUser = await verifyServerSession()
    if (!sessionUser) {
      return { success: false, message: 'Unauthorized.' }
    }

    let targetUserId = sessionUser.id
    let targetUserName = sessionUser.displayName || 'User'
    let targetUserEmail = sessionUser.email || 'user@example.com'

    // If userId is provided and different from session user, check admin permissions
    if (userId && userId !== sessionUser.id) {
      const isConsole = ['cto', 'administrator', 'manager'].includes(
        sessionUser.role,
      )
      if (!isConsole) {
        return {
          success: false,
          message: 'Permission denied. Only admins can create keys for others.',
        }
      }
      targetUserId = userId

      // Fetch target user details
      try {
        // Try fetching from users collection first
        const userDoc = await adminDb
          .collection('users')
          .doc(targetUserId)
          .get()
        if (userDoc.exists) {
          const userData = userDoc.data()
          targetUserName = userData?.displayName || 'User'
          targetUserEmail = userData?.email || 'user@example.com'
        } else {
          // Fallback probably not needed if selecting from valid list, but good to have
          targetUserName = 'User'
        }
      } catch (e) {
        console.warn(
          'Failed to fetch target user details for API key creation',
          e,
        )
      }
    }

    const { publicKey, privateKey, privateKeyHash } = generateKeyPair()

    // Admin SDK handles JS Date objects
    const apiKeyData = {
      userId: targetUserId,
      userName: targetUserName,
      userEmail: targetUserEmail,
      publicKey,
      privateKeyHash,
      createdAt: new Date(),
      lastUsedAt: null,
      isActive: true,
      name: keyName || 'Untitled Key',
    }

    const docRef = await adminDb.collection('apiKeys').add(apiKeyData)

    return {
      success: true,
      message:
        'API Key created successfully. Secure your private key, it will not be shown again.',
      apiKey: {
        id: docRef.id,
        ...apiKeyData,
        createdAt: new Date(),
        lastUsedAt: null,
        privateKey,
      },
    }
  } catch (error) {
    console.error('Error creating API key:', error)
    return { success: false, message: 'Failed to create API key.' }
  }
}

export async function getUserApiKeys(userId?: string): Promise<APIKey[]> {
  try {
    const user = await verifyServerSession()
    if (!user) return []

    // If a userId is provided, ensure the requester is that user or an admin
    const targetUserId = userId || user.id
    const isConsole = ['cto', 'administrator', 'manager'].includes(user.role)

    if (targetUserId !== user.id && !isConsole) {
      return []
    }

    const apiKeysCol = adminDb.collection('apiKeys')
    const snapshot = await apiKeysCol
      .where('userId', '==', targetUserId)
      .orderBy('createdAt', 'desc')
      .get()

    const keys: APIKey[] = []
    snapshot.forEach((doc) => {
      // Cast data to Omit<APIKey, 'id'> to avoid "id specified twice" lint
      const data = convertApiKeyTimestamps(doc.data()) as Omit<APIKey, 'id'>
      keys.push({ id: doc.id, ...data })
    })
    return keys
  } catch (error) {
    console.error('Error fetching user API keys:', error)
    return []
  }
}

export async function getAllApiKeys(): Promise<APIKey[]> {
  try {
    const user = await verifyServerSession()
    if (!user) return []

    const isConsole = ['cto', 'administrator', 'manager'].includes(user.role)
    if (!isConsole) return []

    const apiKeysCol = adminDb.collection('apiKeys')
    const snapshot = await apiKeysCol.orderBy('createdAt', 'desc').get()

    const keys: APIKey[] = []
    snapshot.forEach((doc) => {
      const data = convertApiKeyTimestamps(doc.data()) as Omit<APIKey, 'id'>
      keys.push({ id: doc.id, ...data })
    })
    return keys
  } catch (error) {
    console.error('Error fetching all API keys:', error)
    return []
  }
}

export async function revokeApiKey(
  apiKeyId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await verifyServerSession()
    if (!user) return { success: false, message: 'Unauthorized' }

    const keyRef = adminDb.collection('apiKeys').doc(apiKeyId)
    const doc = await keyRef.get()

    if (!doc.exists) return { success: false, message: 'Key not found' }

    const keyData = doc.data() as APIKey
    const isOwner = keyData.userId === user.id
    const isConsole = ['cto', 'administrator', 'manager'].includes(user.role)

    if (!isOwner && !isConsole) {
      return { success: false, message: 'Permission denied.' }
    }

    await keyRef.update({
      isActive: false,
      lastUsedAt: new Date(),
    })
    return {
      success: true,
      message: `API Key ${apiKeyId} revoked successfully.`,
    }
  } catch (error) {
    console.error('Error revoking API key:', error)
    return { success: false, message: 'Failed to revoke API key.' }
  }
}

export async function reactivateApiKey(
  apiKeyId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await verifyServerSession()
    if (!user) return { success: false, message: 'Unauthorized' }

    const keyRef = adminDb.collection('apiKeys').doc(apiKeyId)
    const doc = await keyRef.get()

    if (!doc.exists) return { success: false, message: 'Key not found' }

    const keyData = doc.data() as APIKey
    const isOwner = keyData.userId === user.id
    const isConsole = ['cto', 'administrator', 'manager'].includes(user.role)

    if (!isOwner && !isConsole) {
      return { success: false, message: 'Permission denied.' }
    }

    await keyRef.update({ isActive: true })
    return {
      success: true,
      message: `API Key ${apiKeyId} reactivated successfully.`,
    }
  } catch (error) {
    console.error('Error reactivating API key:', error)
    return { success: false, message: 'Failed to reactivate API key.' }
  }
}

export async function deleteApiKey(
  apiKeyId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await verifyServerSession()
    if (!user) return { success: false, message: 'Unauthorized' }

    const keyRef = adminDb.collection('apiKeys').doc(apiKeyId)
    const doc = await keyRef.get()

    if (!doc.exists) return { success: false, message: 'Key not found' }

    const keyData = doc.data() as APIKey
    const isOwner = keyData.userId === user.id
    const isConsole = ['cto', 'administrator', 'manager'].includes(user.role)

    if (!isOwner && !isConsole) {
      return { success: false, message: 'Permission denied.' }
    }

    await keyRef.delete()
    return {
      success: true,
      message: `API Key ${apiKeyId} deleted successfully.`,
    }
  } catch (error) {
    console.error('Error deleting API key:', error)
    return { success: false, message: 'Failed to delete API key.' }
  }
}
