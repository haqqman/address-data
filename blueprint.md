# Firebase Studio Blueprint: Nigerian Address Verification and API Service

This blueprint outlines the technical architecture using Firebase for a Nigerian address verification service with a user submission portal, a manual verification console, and a developer API.

## 1. Project Overview

**Address Data** is an address intelligence platform purpose-built for Nigeria. It provides developers, businesses, and admins with tools to validate, store, and retrieve Nigerian address data in a structured, efficient, and scalable way. The system supports manual overrides, geolocation comparisons, and machine-readable outputs — all designed to boost accuracy and usability in real-world applications.

## 2. Firebase Services Utilized

* **Firebase Authentication:** For managing user accounts (portal users) and administrator accounts (verification console).
* **Firestore:** A NoSQL cloud database to store submitted addresses, verified addresses, geographic data, and API key information.
* **Firebase Storage:** To potentially store any auxiliary files related to address submissions.
* **Firebase Hosting:** To host the user submission portal and the manual verification console web applications.
* **Cloud Functions for Firebase:** To implement the backend logic, including address submissions, Google Maps interactions, API endpoints, API key validation, and manual verification actions.
* **Firebase Security Rules:** To secure data in Firestore.

## 3. Database Structure (Firestore)

* `users`: Stores user profile information, including roles.
    * Document ID: Firebase Auth UID.
    * Fields: `email`, `name`, `role` ('user' or 'admin'), `createdAt`.

* `addressSubmissions`: Stores addresses submitted by users awaiting verification.
    * Document ID: Auto-generated.
    * Fields:
        * `userId`: Firebase Auth UID of the submitter.
        * `userName`: Name of the submitter.
        * `userEmail`: Email of the submitter.
        * `submittedAddress`: Object containing `streetAddress`, `areaDistrict`, `city`, `lga`, `state`, `zipCode` (optional), `country` (default "Nigeria").
        * `googleMapsSuggestion` (optional): Address string from Google Maps.
        * `status`: Enum ('pending_review', 'approved', 'rejected').
        * `aiFlaggedReason` (optional): Reason if AI flagged a discrepancy.
        * `submittedAt`: Server timestamp.
        * `reviewedAt` (optional): Server timestamp of review.
        * `reviewerId` (optional): Firebase Auth UID of the admin reviewer.
        * `reviewNotes` (optional): Notes from admin review.

* `apiKeys`: Stores API keys issued to developers.
    * Document ID: Auto-generated.
    * Fields:
        * `userId`: Firebase Auth UID of the developer.
        * `userName`: Name of the developer.
        * `userEmail`: Email of the developer.
        * `publicKey`: Generated public key.
        * `privateKeyHash`: Hashed version of the private key.
        * `name` (optional): User-friendly name for the key.
        * `createdAt`: Server timestamp.
        * `lastUsedAt` (optional): Server timestamp of last use.
        * `isActive`: Boolean.

* `nigerianGeography`: Stores hierarchical geographic data.
    * Collection: `nigerianGeography` (Each document is a State)
        * Document ID: State name (e.g., "lagos-state").
        * Fields:
            * `name`: State name (e.g., "Lagos").
            * `capital`: State capital.
        * Subcollection: `lgas` (Each document is an LGA)
            * Document ID: LGA name (e.g., "ikeja-lga").
            * Fields:
                * `name`: LGA name (e.g., "Ikeja").
            * Subcollection: `cities` (Each document is a City/Town)
                * Document ID: City name (e.g., "ikeja-city").
                * Fields:
                    * `name`: City name (e.g., "Ikeja").

## 4. Core Features:

### 🔐 **Authentication**

* **Portal Access**: Sign in with Google or GitHub.
* **Admin Console**: Access via email/password authentication — limited to `@haqqman.com` work emails only.

---

### 📍 **Address Entry & Verification**

* **User-Submitted Format**: Users can save their address *exactly as it appears physically* — to handle local naming variations not always captured by Google Maps.
* **AI-Assisted Review**:
    * If the submitted address matches Google Maps (via Genkit flow), it is auto-approved.
    * If not, it is flagged for manual review in the admin console.
* **Address Code Assignment**: Each verified address is assigned a unique **Address Data Code** (ADC) (Note: ADC generation logic to be implemented, likely part of the `addressSubmissions` becoming "verified" or moving to a `verifiedAddresses` collection if separated).

---

### ⚙️ **Developer API Access**

* **API Key Pair**:
    * Developers get a **Public Key** and a **Private Key**.
    * Keys enable controlled access to various endpoints (rate-limited).
* **Endpoints** (Implemented via Cloud Functions or Next.js API Routes if not using Cloud Functions directly for this):
    * `/api/autocomplete`: Suggest addresses from verified Nigerian addresses.
    * `/api/lookup-by-code`: Fetch full address by **Address Data Code**.
    * `/api/states`: List all Nigerian states, each with their respective LGAs and cities.
    * `/api/states/{stateId}/lgas`: List LGAs for a state.
    * `/api/states/{stateId}/lgas/{lgaId}/cities`: List cities for an LGA.

---

### 🧠 **Smart Address Autocomplete**

* Show users a dropdown of **verified** Nigerian addresses during:
    * Checkout flows
    * Registration forms
    * Delivery portals
* Benefits:
    * Faster address entry
    * Increased conversion rates
    * Reduced delivery errors

---

### 💾 **Structured Address Storage**

* All addresses are stored in structured fields for compatibility:
    * Street Address
    * Area/District
    * City
    * LGA
    * State
    * Zip Code (if applicable)
    * Country
* Developers are **strongly encouraged** to replicate this structure in their own systems to maximize compatibility with Address Data APIs.

---

## 5. Admin Console Capabilities:

* Manually review unverified addresses flagged by the system.
* Approve or reject based on internal rules or map comparison.
* View and manage all user submissions.
* Create and manage developer API keys.
* Manage geographic data (States, LGAs, Cities).

---

## 6. Style Guidelines:

* **Primary Color**: Dark Blue (#0C213A) — professionalism and trust.
* **Secondary Color**: Green (#79C142) — growth, verification, positivity.
* **Accent Color (Buttons, CTAs)**: Yellow/Gold (#FFCC33) — attention-grabbing for actions.
* **Atlantis Green (for gradients with Secondary, if needed)**: #9CCC48
* **Typography**: Use modern, legible fonts (e.g. Lato, DM Sans, or Inter). Currently Lato.
* **Icons**: Use standard, clear icons (Lucide React) for address types, navigation, and validation cues.

---

## 7. Genkit AI Integration

* `flagAddressDiscrepancies` flow: Used to compare user-submitted addresses with Google Maps data to determine if manual review is needed.
    * Input: User's address string, Google Maps API derived address string.
    * Output: Boolean `isDiscrepant`, String `reason`.

---
## 8. Considerations

* **Google Maps API Costs:** Monitor usage for geocoding/places lookups.
* **Data Accuracy:** Manual review quality is key.
* **Scalability:** Firebase services are scalable. Optimize Firestore queries and Function performance.
* **Error Handling & Logging:** Implement robust error handling and logging.
* **Security:** Secure Firebase console access. API Keys should be handled securely.
