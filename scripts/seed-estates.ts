
/* eslint-disable no-console */
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, writeBatch, serverTimestamp, doc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: './.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

const estatesData = [
  // Lagos Gated Estates
  {
    name: "Banana Island Estate",
    location: { state: "Lagos", lga: "Eti Osa", area: "Ikoyi" },
    googleMapLink: "https://maps.app.goo.gl/u5B1gY8Jz9W7xXaP7"
  },
  {
    name: "Parkview Estate",
    location: { state: "Lagos", lga: "Eti Osa", area: "Ikoyi" },
    googleMapLink: "https://maps.app.goo.gl/BqjYfQZ8XzW5aBcB6"
  },
  {
    name: "Pinnock Beach Estate",
    location: { state: "Lagos", lga: "Eti Osa", area: "Lekki" },
    googleMapLink: "https://maps.app.goo.gl/aC9fHjKkL8xY7dDcA"
  },
  {
    name: "Chevy View Estate",
    location: { state: "Lagos", lga: "Eti Osa", area: "Chevron, Lekki" },
    googleMapLink: "https://maps.app.goo.gl/sVfHkGjJkL9nZbA7A"
  },
  {
    name: "Victoria Garden City (VGC)",
    location: { state: "Lagos", lga: "Eti Osa", area: "Ajah" },
    googleMapLink: "https://maps.app.goo.gl/N7fKjLgY8sH6dEcF9"
  },
  {
    name: "Amen Estate",
    location: { state: "Lagos", lga: "Ibeju-Lekki", area: "Eleko" },
    googleMapLink: "https://maps.app.goo.gl/T4aL5nFjB5aG6bC97"
  },
  // Abuja Gated Estates
  {
    name: "Suncity Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Lokogoma" },
    googleMapLink: ""
  },
  {
    name: "Efab Estate, Lokogoma",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Lokogoma" },
    googleMapLink: ""
  },
  {
    name: "Efab Estate, Gwarinpa",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Gwarinpa" },
    googleMapLink: ""
  },
  {
    name: "Sunnyvale Homes",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Dakwo" },
    googleMapLink: ""
  },
  {
    name: "Crown Court Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Mabushi" },
    googleMapLink: ""
  },
  {
    name: "Goshen Villa Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Lugbe" },
    googleMapLink: ""
  },
  {
    name: "Peggy’s Pointee",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Maitama" },
    googleMapLink: ""
  },
  {
    name: "River Park Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Lugbe" },
    googleMapLink: ""
  },
  {
    name: "Cosgrove Estate, Katampe",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Katampe" },
    googleMapLink: ""
  },
  {
    name: "Brains and Hammers Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Life Camp" },
    googleMapLink: ""
  },
  {
    name: "Bellavue Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Life Camp" },
    googleMapLink: ""
  },
  {
    name: "Palm Spring Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Maitama" },
    googleMapLink: ""
  },
  {
    name: "Godab Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Kafe" },
    googleMapLink: ""
  },
  {
    name: "Aso Grove Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Maitama" },
    googleMapLink: ""
  },
  {
    name: "Gwarinpa Estate (Phase 3)",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Gwarinpa" },
    googleMapLink: ""
  },
  {
    name: "Apo Ville",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Apo" },
    googleMapLink: ""
  },
  {
    name: "Excel Estate",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Apo-Dutse" },
    googleMapLink: ""
  },
  // Port Harcourt Gated Estates
  {
    name: "Rainbow Town",
    location: { state: "Rivers", lga: "Port Harcourt", area: "Trans-Amadi" },
    googleMapLink: "https.maps.app.goo.gl/Y7zF9JkK6LgH8dXbA"
  },
];

const generateEstateCode = (state: string, lga: string): string => {
    const stateCode = state.substring(0, 3).toUpperCase();
    const lgaCode = lga.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
    const estateNumber = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${stateCode}-${lgaCode}-${estateNumber}`;
};

const seedEstates = async () => {
    console.log("Starting to seed the 'estates' collection...");
    const batch = writeBatch(db);
    const estatesCollection = collection(db, 'estates');
    let count = 0;

    for (const estate of estatesData) {
        const estateCode = generateEstateCode(estate.location.state, estate.location.lga);
        const docRef = doc(estatesCollection); // Auto-generate document ID

        const newEstateData = {
            estateCode: estateCode,
            name: estate.name,
            location: estate.location,
            googleMapLink: estate.googleMapLink || "",
            status: "approved", // <-- ADDED THIS LINE
            source: "Address Data", // As these are seeded
            createdBy: "system-seed",
            lastUpdatedBy: "system-seed",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            reviewedBy: "system-seed",
            reviewedAt: serverTimestamp(),
            reviewNotes: "Automatically approved during system seeding."
        };

        batch.set(docRef, newEstateData);
        count++;
    }

    try {
        await batch.commit();
        console.log(`\n--- Seeding Complete! ---`);
        console.log(`Successfully seeded ${count} estates into the database.`);
        console.log("NOTE: If estates already existed, this script creates duplicates. You may need to clear the collection in Firebase Console before re-running for a clean seed.");
    } catch (error) {
        console.error("An error occurred during the estate seeding process:", error);
    }
};

seedEstates().catch(error => {
    console.error("Failed to execute estates seeder:", error);
});
