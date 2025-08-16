export interface User {
  id: string;
  email?: string | null;
  firstName?: string | null; // Added
  lastName?: string | null;  // Added
  name?: string | null; // Kept for backward compatibility or display name if preferred
  role: "user" | "cto" | "administrator" | "manager";
  createdAt?: Date;
  lastLogin?: Date;
  authProvider?: string;
  phoneNumber?: string | null; // Added from console-user-update page
}

export interface Address {
  id: string; 
  physicalAddress?: string; 
  streetAddress: string;
  areaDistrict: string;
  city: string;
  lga: string; 
  state: string;
  zipCode?: string;
  country: string; 
  latitude?: number;
  longitude?: number;
  status: "verified"; 
  userId?: string; 
  originalSubmissionId?: string; 
  createdAt: Date; 
  updatedAt: Date; 
  googleMapsAddress?: string; 
  verificationNotes?: string; 
}

export interface APIKey {
  id: string;
  userId: string; 
  userName?: string; 
  userEmail?: string; 
  publicKey: string;
  privateKeyHash: string; 
  createdAt: Date;
  lastUsedAt: Date | null;
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
  aiFlaggedReason?: string | null; // Allow null
  submittedAt: Date;
  reviewedAt?: Date | null; 
  reviewerId?: string | null; 
  reviewNotes?: string | null;
}

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

export interface Estate {
  id: string; // The document ID in Firestore
  estateCode: string; // Format: [StateCode]-[LGACode]-[EstateNumber]
  name: string;
  location: {
    state: string;
    lga: string;
    area?: string; // Optional broader area
  };
  googleMapLink?: string; // Optional
  source: string; // "Address Data", "Platform", or user-specified
  createdBy: string; // User ID of the creator
  lastUpdatedBy: string; // User ID of the last person to update
  createdAt: Date;
  updatedAt: Date;
}
