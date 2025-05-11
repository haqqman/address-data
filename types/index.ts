export interface User {
  id: string;
  email?: string | null;
  name?: string | null;
  role: "user" | "cto" | "administrator" | "manager";
}

export interface Address {
  id: string; // Unique Address Data Code (ADC)
  physicalAddress: string; // User-submitted physical address
  streetAddress: string;
  areaDistrict: string;
  city: string;
  lga: string; // Local Government Area
  state: string;
  zipCode?: string;
  country: string; // Default to Nigeria
  latitude?: number;
  longitude?: number;
  status: "verified" | "pending_review" | "rejected";
  userId: string; // User who submitted this address
  createdAt: Date;
  updatedAt: Date;
  googleMapsAddress?: string; // Address from Google Maps if available
  reviewNotes?: string; // Notes from admin review
}

export interface APIKey {
  id: string;
  userId: string; // Developer user ID
  userName?: string; // Optional: User's name for display
  userEmail?: string; // Optional: User's email for display
  publicKey: string;
  privateKeyHash: string; // Store a hash, not the raw private key
  createdAt: Date;
  lastUsedAt?: Date | null; // Allow null for never used
  isActive: boolean;
  name?: string; // User-friendly name for the key
}

export interface AddressSubmission {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  submittedAddress: {
    streetAddress: string;
    areaDistrict: string;
    city: string;
    lga: string;
    state: string;
    zipCode?: string;
    country: string;
  };
  googleMapsSuggestion?: string;
  status: "pending_review" | "approved" | "rejected";
  aiFlaggedReason?: string;
  submittedAt: Date;
  reviewedAt?: Date | null; // Allow null
  reviewerId?: string | null; // Allow null
  reviewNotes?: string; // Notes from admin review, e.g., reason for rejection
}

// Types for Firestore Geography Data
export interface FirestoreGeographyStateData {
  name: string;
  capital: string;
}
export interface GeographyState extends FirestoreGeographyStateData {
  id: string; // Document ID from Firestore
}

export interface FirestoreGeographyLGAData {
  name: string;
  stateId: string; // Reference to parent state document ID
}
export interface GeographyLGA extends Omit<FirestoreGeographyLGAData, 'stateId'> {
  id: string; // Document ID from Firestore (LGA name sanitized)
  name: string;
  stateId: string; // Keep stateId for context
}

export interface FirestoreGeographyCityData {
  name: string;
  stateId: string; // Reference to parent state document ID
  lgaId: string;   // Reference to parent LGA document ID
}
export interface GeographyCity extends Omit<FirestoreGeographyCityData, 'stateId' | 'lgaId'> {
  id: string; // Document ID from Firestore (City name sanitized)
  name: string;
  stateId: string; // Keep stateId for context
  lgaId: string;   // Keep lgaId for context
}
