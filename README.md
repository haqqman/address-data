# Address Data

**Address Data** is an address intelligence platform purpose-built for Nigeria. It provides developers, businesses, and admins with tools to validate, store, and retrieve Nigerian address data in a structured, efficient, and scalable way.

## Project Overview

The platform consists of:
- A **User Portal** for submitting addresses.
- An **Admin Console** for manual verification, user management, and API key management.
- A **Developer API** for programmatic access to verified address data and Nigerian geographic information.

## Local Development Setup

### Prerequisites

- **Node.js:** Version 20.x or later. (We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions).
- **npm or yarn:** Package manager.
- **Firebase Account:** You'll need a Firebase project to connect the application to.
- **Git:** For version control.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd address-data
```

### 2. Install Dependencies

```bash
npm install
# or
# yarn install
```

### 3. Set Up Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on **"Add project"** and follow the steps to create a new Firebase project (e.g., `addressdata-dev`).
3.  Once your project is created, navigate to **Project settings** (click the gear icon next to "Project Overview").
4.  Under the **"General"** tab, scroll down to **"Your apps"**.
5.  Click on the **Web icon (`</>`)** to add a new web app.
6.  Register your app (e.g., "Address Data Web"). You **do not** need to set up Firebase Hosting at this stage if you are just running locally.
7.  After registering, Firebase will provide you with a `firebaseConfig` object. You will need these values for your `.env.local` file.

### 4. Configure Environment Variables

Create a `.env.local` file in the root of the project and add your Firebase project configuration details:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional
```

Replace `YOUR_...` placeholders with the actual values from your Firebase project's `firebaseConfig`.

### 5. Set Up Firebase Authentication

1.  In the Firebase Console, navigate to **Authentication** (under "Build" in the sidebar).
2.  Go to the **"Sign-in method"** tab.
3.  Enable the following providers:
    *   **Email/Password**
    *   **Google** (ensure you provide SHA-1 certificates if required for Android, though not critical for web-only local dev)
    *   **GitHub** (you'll need to provide a Client ID and Client Secret from your GitHub OAuth app settings)
4.  Under **"Authorized domains"** on the "Sign-in method" tab, ensure `localhost` is added if it's not there already. This is crucial for local development.

### 6. Set Up Firestore Database

1.  In the Firebase Console, navigate to **Firestore Database** (under "Build" in the sidebar).
2.  Click **"Create database"**.
3.  Choose **"Start in test mode"** for local development. This allows easier read/write access. **Important:** For production, you must set up secure Firestore Security Rules.
4.  Select a Firestore location.
5.  Click **"Enable"**.

### 7. Create Initial Console Users (Manual Setup)

For accessing the Admin Console, you need to create user accounts with specific roles.
The application expects console users to have emails ending in `@haqqman.com`.

1.  **Create Users in Firebase Authentication:**
    *   Go to Firebase Console -> Authentication -> Users tab.
    *   Click "Add user".
    *   Enter the email (e.g., `webmanager@haqqman.com`, `joshua+sandbox@haqqman.com`) and a password (e.g., `P@ssw0rd*AD!2025`).
    *   Note down the **User UID** for each user created.

2.  **Create User Profiles in Firestore:**
    *   Go to Firebase Console -> Firestore Database.
    *   Create a collection named `users`.
    *   For each console user created in Authentication, add a new document in the `users` collection.
    *   Set the **Document ID** to be the **User UID** you noted earlier.
    *   Add the following fields to each user document:
        *   `email` (String): The user's email (e.g., `webmanager@haqqman.com`)
        *   `firstName` (String): User's first name (e.g., `Abdulhaqq`)
        *   `lastName` (String): User's last name (e.g., `Sule`)
        *   `name` (String): Full name (e.g., `Abdulhaqq Sule`)
        *   `role` (String): The user's role (`cto`, `manager`, or `administrator`)
        *   `phoneNumber` (String): User's phone number (e.g., `+2347011568196`) or `null`
        *   `authProvider` (String): `password`
        *   `createdAt` (Timestamp): Set to current server timestamp.
        *   `lastLogin` (Timestamp): Set to current server timestamp.

    **Example `users` document for a CTO:**
    *   Document ID: `[UID_OF_CTO_FROM_AUTH]`
    ```json
    {
      "email": "webmanager@haqqman.com",
      "firstName": "Abdulhaqq",
      "lastName": "Sule",
      "name": "Abdulhaqq Sule",
      "role": "cto",
      "phoneNumber": "+2347011568196",
      "authProvider": "password",
      "createdAt": "FieldValue.serverTimestamp()",
      "lastLogin": "FieldValue.serverTimestamp()"
    }
    ```

### 8. Running the Development Server

```bash
npm run dev
```

This will start the Next.js development server, usually on `http://localhost:9002`.

### 9. Running Genkit (for AI Flows)

If you are working with AI features that use Genkit:

```bash
npm run genkit:watch
# or for a single run
# npm run genkit:dev
```
This will start the Genkit development UI, usually on `http://localhost:4000`.

## Firebase Services Used

*   **Firebase Authentication:** Manages user accounts for both the portal and console.
*   **Firestore:** NoSQL database for storing address submissions, verified addresses, API keys, and user profiles.
*   **Firebase Hosting:** For deploying the web application.
*   **Cloud Functions for Firebase (via Genkit):** Backend logic for AI flows (e.g., address discrepancy checking).

## Code Structure (Simplified)

-   `app/`: Contains Next.js App Router routes and components.
    -   `(auth)/`: Routes related to authentication (login, console access).
    -   `console/`: Routes for the admin console.
    -   `dashboard/`: Routes for the user portal dashboard.
    -   `api/`: (Potentially for Next.js API routes, though core API logic is planned via Cloud Functions as per blueprint).
-   `components/`: Reusable UI components.
    -   `admin/`: Components specific to the Admin Console.
    -   `dashboard/`: Components specific to the User Portal Dashboard.
    -   `forms/`: Form components.
    -   `layout/`: Header, footer, and layout components.
-   `contexts/`: React Context providers (e.g., `auth-context.tsx`).
-   `lib/`: Utility functions and Firebase configuration.
    -   `firebase/`: Firebase initialization.
-   `ai/`: Genkit related files.
    -   `flows/`: Genkit AI flows.
-   `public/`: Static assets.

## Contributing

Please follow standard Git workflow (branches, pull requests). Ensure code is linted and passes type checks before submitting.

```bash
npm run lint
npm run typecheck
```

Happy Coding!
