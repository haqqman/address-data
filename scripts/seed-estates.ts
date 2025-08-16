
// scripts/seed-estates.ts

/* eslint-disable no-console */
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, writeBatch, serverTimestamp } from 'firebase/firestore';
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
  // Lagos Estates
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
    name: "VGC (Victoria Garden City)",
    location: { state: "Lagos", lga: "Eti Osa", area: "Ajah" },
    googleMapLink: "https://maps.app.goo.gl/N7fKjLgY8sH6dEcF9"
  },
  {
    name: "Ikeja G.R.A.",
    location: { state: "Lagos", lga: "Ikeja", area: "Ikeja" },
    googleMapLink: "https://maps.app.goo.gl/B1jYkK9XhZfW6dE7B"
  },
  // Abuja Estates
  {
    name: "Maitama District",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Maitama" },
    googleMapLink: "https://maps.app.goo.gl/aBcD8FjGkL9oXyZ6A"
  },
  {
    name: "Asokoro District",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Asokoro" },
    googleMapLink: "https://maps.app.goo.gl/pQrStUvWxYzAbCdE8"
  },
  {
    name: "Guzape District",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Guzape" },
    googleMapLink: "https.maps.app.goo.gl/xYzA7B1jKkL9oXyZ6"
  },
  {
    name: "Life Camp",
    location: { state: "FCT", lga: "Municipal Area Council", area: "Life Camp" },
    googleMapLink: "https://maps.app.goo.gl/sTuvWxyZAbCdE8pQr"
  },
  // Port Harcourt Estates
  {
    name: "Old G.R.A.",
    location: { state: "Rivers", lga: "Port Harcourt", area: "Old GRA" },
    googleMapLink: "https.maps.app.goo.gl/jKlM9NopQrStUvWxY"
  },
  {
    name: "New G.R.A.",
    location: { state: "Rivers", lga: "Port Harcourt", area: "New GRA" },
    googleMapLink: "https.maps.app.goo.gl/zAbCdE8pQrStUvWxY"
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
            source: "Address Data", // As these are seeded
            createdBy: "system-seed",
            lastUpdatedBy: "system-seed",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        batch.set(docRef, newEstateData);
        count++;
    }

    try {
        await batch.commit();
        console.log(`\n--- Seeding Complete! ---`);
        console.log(`Successfully seeded ${count} estates into the database.`);
    } catch (error) {
        console.error("An error occurred during the estate seeding process:", error);
    }
};

seedEstates().catch(error => {
    console.error("Failed to execute estates seeder:", error);
});
