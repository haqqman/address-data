// scripts/seed.ts

import { db } from '../lib/firebase/config'
import {
  collection,
  doc,
  writeBatch,
  Timestamp,
  getDoc,
  serverTimestamp
} from 'firebase/firestore'
import { config as dotenvConfig } from 'dotenv'
import { stateOptions as geographyStateOptions, addressData as geographySourceData } from '../lib/geography-data'
import type { StateOption as GeographyStateOption, StateData as GeographyStateDataType } from '../lib/geography-data'

import type { User, AddressSubmission, APIKey } from '@/types'

// Load environment variables
dotenvConfig({ path: '.env.local' })

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
if (!apiKey) {
  console.error('[ERROR] Firebase API Key NOT FOUND. Check .env.local.')
  process.exit(1)
} else {
  console.log(`[INFO] Firebase API Key loaded: ${apiKey.substring(0, 10)}...`)
}

// Console User Data - Ensure UIDs are actual Firebase Auth UIDs
const consoleUsersData: Array<Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role' | 'phoneNumber'>> = [
  {
    id: 'PjOUhbonSTYTA6HPUqHUy0AER6f2', // Replace with actual UID from Firebase Auth
    email: 'webmanager@haqqman.com',
    firstName: 'Abdulhaqq',
    lastName: 'Sule',
    role: 'cto',
    phoneNumber: '+234 701 156 8196'
  },
  {
    id: '3aolsEOxNpT8tunbxP2TzqH3RAx2', // Replace with actual UID from Firebase Auth
    email: 'joshua+sandbox@haqqman.com',
    firstName: 'Joshua',
    lastName: 'Ajorgbor',
    role: 'manager',
    phoneNumber: '+234 903 578 4325'
  },
  // Add a generic administrator if needed for testing, ensure UID is from Auth
  {
    id: 'ADMIN_USER_UID_PLACEHOLDER', // Replace with actual UID from Firebase Auth for an admin user
    email: 'admin@haqqman.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'administrator',
    phoneNumber: '+234 000 000 0000'
  }
]

async function seedConsoleUserProfiles(batch: ReturnType<typeof writeBatch>): Promise<number> {
  let count = 0
  console.log('\n[Seeding] Console user profiles...')

  for (const userData of consoleUsersData) {
    if (userData.id.includes('_PLACEHOLDER')) {
      console.warn(`[WARN] Skipping user with placeholder UID: ${userData.email}. Replace with actual Firebase Auth UID.`)
      continue
    }

    const userRef = doc(db, 'users', userData.id)
    // const existing = await getDoc(userRef); // Check if user exists to decide set vs update (optional, set with merge handles this)

    const profileData: Partial<User> & { createdAt?: any, lastLogin?: any, authProvider?: string, name?: string } = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      name: `${userData.firstName} ${userData.lastName}`,
      role: userData.role,
      phoneNumber: userData.phoneNumber,
      authProvider: 'password', // Assuming console users are created with email/password
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    }    
    
    batch.set(userRef, profileData, { merge: true }) // Use merge:true to create or update
    console.log(`→ Upsert user: ${userData.email} (Role: ${userData.role})`)
    count++
  }

  return count
}

// Geography Data
async function seedGeographyData(batch: ReturnType<typeof writeBatch>): Promise<number> {
  let count = 0
  console.log('\n[Seeding] Nigerian geography (States, LGAs, Cities)...')

  for (const stateOpt of geographyStateOptions) {
    const stateId = stateOpt.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const stateRef = doc(db, 'nigerianGeography', stateId)

    const stateDetails = geographySourceData.find(s => s.state === stateOpt.value)
    
    // Assuming capital is part of stateDetails or can be derived. For now, using a placeholder if not found.
    // The `geographySourceData` in `lib/geography-data.ts` does not include capital directly in the top-level state object.
    // Let's assume for now we just store name, and capital can be added later if needed from a different source or by updating the type.
    // For the provided `geography-data.ts`, capital is not available for states.
    // The blueprint.md has `capital` in the `nigerianGeography.states` doc.
    // If `geographySourceData` structure is changed to include capital, it can be used here.
    // For now, let's seed with a placeholder or leave it out if not critical for initial seeding.
    let capital = "N/A"; // Placeholder
    if (stateOpt.value === "abuja") capital = "Abuja"; // Example for FCT
    if (stateOpt.value === "lagos") capital = "Ikeja"; // Example for Lagos

    batch.set(stateRef, {
      name: stateOpt.title,
      capital: capital // Placeholder, update if data source provides it
    })
    console.log(`→ Seed State: ${stateOpt.title}`)
    count++

    if (stateDetails) {
      for (const lga of stateDetails.lgas) {
        const lgaId = lga.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/\//g, '-')
        const lgaRef = doc(collection(stateRef, 'lgas'), lgaId)
        batch.set(lgaRef, { name: lga.name, stateId: stateId }) // Added stateId for context
        console.log(`  → Seed LGA: ${lga.name} (in ${stateOpt.title})`)
        count++

        for (const city of lga.cities) {
          const cityId = city.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/\//g, '-')
          const cityRef = doc(collection(lgaRef, 'cities'), cityId)
          batch.set(cityRef, { name: city.name, lgaId: lgaId, stateId: stateId }) // Added lgaId and stateId for context
          console.log(`    → Seed City: ${city.name} (in ${lga.name})`)
          count++
        }
      }
    }
  }
  return count
}

// Address Submissions Data
const mockAddressSubmissions: Array<Omit<AddressSubmission, 'id' | 'submittedAt' | 'reviewedAt' | 'userName' | 'userEmail'>> = [
  {
    userId: 'PjOUhbonSTYTA6HPUqHUy0AER6f2', // Abdulhaqq's UID
    submittedAddress: {
      streetAddress: '1 Tech Avenue, Victoria Island',
      areaDistrict: 'Innovation Hub',
      city: 'Lagos',
      lga: 'Eti-Osa',
      state: 'Lagos',
      country: 'Nigeria',
      zipCode: '101241'
    },
    googleMapsSuggestion: '1 Tech Avenue, Victoria Island, Lagos 101241, Nigeria',
    status: 'approved',
    reviewerId: '3aolsEOxNpT8tunbxP2TzqH3RAx2', // Joshua's UID
    reviewNotes: 'Looks good, verified via satellite.'
  },
  {
    userId: '3aolsEOxNpT8tunbxP2TzqH3RAx2', // Joshua's UID
    submittedAddress: {
      streetAddress: '25 Market Road, GRA Phase 2',
      areaDistrict: 'Commerce District',
      city: 'Port Harcourt',
      lga: 'Port Harcourt City',
      state: 'Rivers',
      country: 'Nigeria',
      zipCode: '500272'
    },
    googleMapsSuggestion: '25 Market Rd, GRA Phase 2, Port Harcourt 500272, Rivers, Nigeria',
    status: 'pending_review',
    aiFlaggedReason: 'Street name variation compared to Google Maps.'
  },
  {
    userId: 'PORTAL_USER_EXAMPLE_UID_1', // Replace with an actual portal user UID if testing portal submissions
    submittedAddress: {
      streetAddress: '15 Main Street, Test Discrepancy Layout',
      areaDistrict: 'Residential Area',
      city: 'Abuja',
      lga: 'AMAC',
      state: 'FCT',
      country: 'Nigeria',
      zipCode: '900001'
    },
    googleMapsSuggestion: '15 Main St, Residential Area, Abuja 900001, Nigeria',
    status: 'pending_review',
    aiFlaggedReason: 'The user provided "Test Discrepancy Layout" which is not found in Google Maps.'
  }
]

async function seedAddressSubmissions(batch: ReturnType<typeof writeBatch>): Promise<number> {
  let count = 0
  console.log('\n[Seeding] Mock address submissions...')

  for (const submissionData of mockAddressSubmissions) {
    const ref = doc(collection(db, 'addressSubmissions'))
    
    // Fetch user details for userName and userEmail
    let userName, userEmail;
    if(submissionData.userId && !submissionData.userId.includes("_PLACEHOLDER") && !submissionData.userId.includes("_EXAMPLE_UID")) {
        const userDoc = await getDoc(doc(db, "users", submissionData.userId));
        if(userDoc.exists()){
            const userData = userDoc.data() as User;
            userName = userData.name || `${userData.firstName} ${userData.lastName}`;
            userEmail = userData.email;
        }
    }
    if (!userName && submissionData.userId === 'PORTAL_USER_EXAMPLE_UID_1') { // Example for non-console user
        userName = "Portal User One";
        userEmail = "portaluser1@example.com";
    }


    const fullSubmission: Partial<AddressSubmission> = {
      ...submissionData,
      userName: userName || "Unknown User",
      userEmail: userEmail || "unknown@example.com",
      submittedAt: Timestamp.fromDate(new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30)), // Random time in last 30 days
      reviewedAt: submissionData.status === 'approved' ? Timestamp.now() : null,
      aiFlaggedReason: submissionData.aiFlaggedReason || null,
      reviewNotes: submissionData.reviewNotes || null,
      reviewerId: submissionData.reviewerId || null,
    }
    batch.set(ref, fullSubmission)
    console.log(`→ Seed Address Submission for user: ${fullSubmission.userName}`)
    count++
  }

  return count
}


// API Keys Data
const mockApiKeys: Array<Omit<APIKey, 'id' | 'createdAt' | 'lastUsedAt' | 'userName' | 'userEmail'>> = [
  {
    userId: 'PORTAL_USER_EXAMPLE_UID_1', // Example Developer User UID
    publicKey: 'pk_live_example_dev_one_key123',
    privateKeyHash: 'hashed_pk_live_example_dev_one_key123', // Store a hash
    isActive: true,
    name: "Dev One's Main App Key"
  },
  {
    userId: 'PORTAL_USER_EXAMPLE_UID_2', // Another Example Developer User UID
    publicKey: 'pk_live_example_dev_two_key456',
    privateKeyHash: 'hashed_pk_live_example_dev_two_key456',
    isActive: false,
    name: "Dev Two's Old Test Key"
  }
]

async function seedApiKeys(batch: ReturnType<typeof writeBatch>): Promise<number> {
  let count = 0
  console.log('\n[Seeding] Mock API keys...')

  for (const apiKeyData of mockApiKeys) {
    const ref = doc(collection(db, 'apiKeys')) // Auto-generate ID for API keys

    // Fetch user details for userName and userEmail
    let userName, userEmail;
    // For API keys, userId might be a developer account not necessarily in consoleUsersData
    // This part needs to be adapted if API keys are linked to users from the 'users' collection
    // For now, using placeholders if not found or using the userId directly
    if(apiKeyData.userId && !apiKeyData.userId.includes("_EXAMPLE_UID")) {
         const userDoc = await getDoc(doc(db, "users", apiKeyData.userId));
        if(userDoc.exists()){
            const userData = userDoc.data() as User;
            userName = userData.name || `${userData.firstName} ${userData.lastName}`;
            userEmail = userData.email;
        }
    }
    if (!userName && apiKeyData.userId === 'PORTAL_USER_EXAMPLE_UID_1') {
        userName = "Developer One"; userEmail = "dev1@example.com";
    }
    if (!userName && apiKeyData.userId === 'PORTAL_USER_EXAMPLE_UID_2') {
        userName = "Developer Two"; userEmail = "dev2@example.com";
    }


    const fullApiKeyData: APIKey = {
      id: ref.id, // Will be set by Firestore, but useful to have it here if we were using the ref.id
      ...apiKeyData,
      userName: userName || "API User",
      userEmail: userEmail || "apiuser@example.com",
      createdAt: Timestamp.fromDate(new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 90)), // Random time in last 90 days
      lastUsedAt: apiKeyData.isActive && Math.random() > 0.5 
                  ? Timestamp.fromDate(new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 10)) 
                  : null,
    }
    batch.set(ref, fullApiKeyData)
    console.log(`→ Seed API Key: ${fullApiKeyData.name} for user: ${fullApiKeyData.userName}`)
    count++
  }
  return count
}


async function main() {
  console.log('\n🔧 Starting Firestore seeding...')
  const batch = writeBatch(db)
  let totalOperations = 0;

  try {
    totalOperations += await seedConsoleUserProfiles(batch);
    totalOperations += await seedGeographyData(batch);
    totalOperations += await seedAddressSubmissions(batch);
    totalOperations += await seedApiKeys(batch);

    await batch.commit()
    console.log(`\n✅ Seeding complete. Total operations: ${totalOperations}\n`)
    process.exit(0)
  } catch (error) {
    console.error('[ERROR] Seeding failed:', error)
    process.exit(1)
  }
}

main()
