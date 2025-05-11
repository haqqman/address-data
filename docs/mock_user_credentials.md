
# Mock User Credentials for Console Access

This document outlines the intended credentials for mock console users.
**Important:** These passwords need to be set manually in the Firebase Authentication console when creating these user accounts. They are not "seeded" into the application code or Firestore directly for authentication purposes. Firebase Authentication handles user accounts and password verification.

Firestore will be used to store *additional profile information* including their roles (`cto`, `manager`, `administrator`), display names, phone numbers, etc., associated with these users, linked by their Firebase Authentication UID.

## Console Users:

1.  **Abdulhaqq Sule (CTO)**
    *   **Email:** `webmanager@haqqman.com`
    *   **Intended Password:** `P@ssw0rd*AD!2025`
    *   **Role:** `cto`

2.  **Joshua Ajorgbor (Manager)**
    *   **Email:** `joshua+sandbox@haqqman.com`
    *   **Intended Password:** `P@ssw0rd*AD!2025`
    *   **Role:** `manager`

3.  **Generic Administrator** (Example, create if needed for testing general admin access)
    *   **Email:** `admin@haqqman.com`
    *   **Intended Password:** `P@ssw0rd*AD!2025`
    *   **Role:** `administrator`


### How to Set Up Console Users in Firebase Authentication:
1. Go to your Firebase Project Console (`addressdata-sandbox`).
2. Navigate to "Authentication" (under "Build" in the sidebar).
3. Go to the "Users" tab.
4. Click "Add user".
5. Enter the **Email address** (e.g., `webmanager@haqqman.com`).
6. Enter the **Password** (i.e., `P@ssw0rd*AD!2025`).
7. Click "Add user".

Repeat these steps for all console users.

### Storing User Profile Data (including roles) in Firestore:

After creating users in Firebase Authentication, their profile data, including roles, **must** be seeded into the `users` collection in Firestore. The application relies on this Firestore data to determine user roles upon login.

1. Create the users in Firebase Authentication as described above.
2. Obtain their Firebase User ID (UID) after creation (visible in the Firebase Auth console).
3. In Firestore, navigate to the `users` collection.
4. Add a new document for each console user, using their Firebase UID as the Document ID.

   **Document ID: `[UID_OF_ABDULHAQQ_FROM_AUTH]`**
   ```json
   {
     "email": "webmanager@haqqman.com",
     "name": "Abdulhaqq Sule",
     "role": "cto",
     "phoneNumber": "+234 701 156 8196",
     "authProvider": "password",
     "createdAt": "Timestamp (e.g., new Date())"
   }
   ```

   **Document ID: `[UID_OF_JOSHUA_FROM_AUTH]`**
   ```json
   {
     "email": "joshua+sandbox@haqqman.com",
     "name": "Joshua Ajorgbor",
     "role": "manager",
     "phoneNumber": "+234 903 578 4325",
     "authProvider": "password",
     "createdAt": "Timestamp (e.g., new Date())"
   }
   ```
   **Document ID: `[UID_OF_ADMIN_FROM_AUTH]` (if created)**
   ```json
   {
     "email": "admin@haqqman.com",
     "name": "Admin User",
     "role": "administrator",
     "authProvider": "password",
     "createdAt": "Timestamp (e.g., new Date())"
   }
   ```

The `auth-context.tsx` will fetch this Firestore document upon login to determine the user's role. The `scripts/seed.ts` file has also been updated to seed these user profiles into Firestore.

---

### Troubleshooting Common Issues

**Error: `Firebase: Error (auth/invalid-credential)` or `INVALID_LOGIN_CREDENTIALS`**

*   **Meaning:** This error indicates that the email/password combination provided during login is incorrect, the user does not exist in Firebase Authentication, or the account might be disabled.
*   **Solution:**
    1.  **Verify User Existence & Password:** Double-check that you have created the user (e.g., `webmanager@haqqman.com`) in your Firebase project's Authentication section *and* that the password you set for this user in the Firebase console *exactly* matches `P@ssw0rd*AD!2025`. Passwords are case-sensitive. This is the most common cause.
    2.  **Check Email Spelling:** Ensure there are no typos in the email address entered on the login form.
    3.  **Check Account Status:** Make sure the user account is not disabled in the Firebase console.
    4.  **Check Firestore User Document:** Ensure a document exists in the `users` collection in Firestore with the Firebase UID of the user, and that it contains the correct `role` field (`cto`, `manager`, or `administrator`).
    5.  **Re-create User (If unsure):** If you're uncertain, you can delete the user from the Firebase Authentication console and re-add them carefully following the "How to Set Up Console Users in Firebase Authentication" steps above. Then, ensure their Firestore document is correctly seeded.
    6.  **Firebase Project:** Ensure your application is connected to the correct Firebase project where these users were created (check your `.env.local` or environment configuration for Firebase). The `.env.local` should be configured with the details for `addressdata-sandbox` project ID.
    7.  **Sign-in Method Enabled:** Ensure "Email/Password" is enabled as a sign-in provider in your Firebase project: Firebase Console -> Authentication -> Sign-in method tab.

**Error: `Firebase: Error (auth/unauthorized-domain)`**

*   **Meaning:** This error indicates that the domain from which your application is trying to authenticate users (e.g., `localhost` during development, or your deployment domain) is not whitelisted in your Firebase project's authentication settings.
*   **Solution:**
    1.  Go to your Firebase Project Console (`addressdata-sandbox`).
    2.  Navigate to "Authentication" (under "Build" in the sidebar).
    3.  Go to the "Settings" tab (or "Sign-in method" tab depending on Firebase console version).
    4.  Under "Authorized domains", click "Add domain".
    5.  Enter the domain you are using. For local development, this is typically `localhost`. If you deploy your app, you'll need to add your production domain (e.g., `your-app-name.vercel.app` or `yourcustomdomain.com`) as well.
    6.  Click "Add".

The application code correctly calls Firebase for authentication. These errors usually originate from Firebase due to a mismatch with its stored user data or configuration.
Ensure `scripts/seed.ts` is run after creating users in Firebase Authentication to populate their Firestore profiles with the correct roles.
