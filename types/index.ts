export interface User {
  id: string;
  email?: string | null;
  name?: string | null;
  role: "user" | "cto" | "administrator" | "manager";
  createdAt?: Date; // Optional: when user was first created in system
  lastLogin?: Date; // Optional: last login timestamp
  authProvider?: string; // e.g., 'google.com', 'github.com', 'password'
}

export interface Address { // This type seems to be for verified addresses
  id: string; // Unique Address Data Code (ADC)
  physicalAddress?: string; // User-submitted physical address if different from verified
  streetAddress: string;
  areaDistrict: string;
  city: string;
  lga: string; 
  state: string;
  zipCode?: string;
  country: string; // Default to Nigeria
  latitude?: number;
  longitude?: number;
  status: "verified"; // This type should only contain verified addresses
  userId?: string; // User who originally submitted this address (optional)
  originalSubmissionId?: string; // Link to the submission
  createdAt: Date; // When this verified record was created
  updatedAt: Date; // When this verified record was last updated
  googleMapsAddress?: string; 
  verificationNotes?: string; // Notes from admin during verification
}

export interface APIKey {
  id: string;
  userId: string; 
  userName?: string; 
  userEmail?: string; 
  publicKey: string;
  privateKeyHash: string; 
  createdAt: Date;
  lastUsedAt: Date | null; // Changed to Date | null
  isActive: boolean;
  name?: string; 
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
  reviewedAt?: Date | null; 
  reviewerId?: string | null; 
  reviewNotes?: string | null; // Changed to allow null, ensure it's optional
}

// Types for Firestore Geography Data
export interface FirestoreGeographyStateData {
  name: string;
  capital: string;
}
export interface GeographyState extends FirestoreGeographyStateData {
  id: string; 
}

export interface FirestoreGeographyLGAData {
  name: string;
  stateId: string; 
}
export interface GeographyLGA extends Omit<FirestoreGeographyLGAData, 'stateId'> {
  id: string; 
  name: string;
  stateId: string; 
}

export interface FirestoreGeographyCityData {
  name: string;
  stateId: string; 
  lgaId: string;   
}
export interface GeographyCity extends Omit<FirestoreGeographyCityData, 'stateId' | 'lgaId'> {
  id: string; 
  name: string;
  stateId: string; 
  lgaId: string;   
}
