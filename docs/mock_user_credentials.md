
# Mock User Credentials for Console Access

This document outlines the intended credentials for mock admin users.
**Important:** These passwords need to be set manually in the Firebase Authentication console when creating these user accounts. They are not "seeded" into the application code or Firestore directly for authentication purposes. Firebase Authentication handles user accounts and password verification.

Firestore can be used to store *additional profile information* (like roles, display names if different from Auth, phone numbers, etc.) associated with these users, linked by their Firebase Authentication UID, but it **does not store passwords for login**.

## Admin Users:

1.  **Abdulhaqq Sule (CTO)**
    *   **Email:** `webmanager@haqqman.com`
    *   **Intended Password:** `P@ssw0rd*AD!2025`

2.  **Joshua Ajorgbor (Manager)**
    *   **Email:** `joshua+sandbox@haqqman.com`
    *   **Intended Password:** `P@ssw0rd*AD!2025`

### How to Set Up Admin Users in Firebase Authentication:
1. Go to your Firebase Project Console (`addressdata-sandbox`).
2. Navigate to "Authentication" (under "Build" in the sidebar).
3. Go to the "Users" tab.
4. Click "Add user".
5. Enter the **Email address** (e.g., `webmanager@haqqman.com`).
6. Enter the **Password** (i.e., `P@ssw0rd*AD!2025`).
7. Click "Add user".

Repeat these steps for both Abdulhaqq Sule and Joshua Ajorgbor.

Once these users are created in Firebase Authentication, they will be able to log in to the Admin Console at `/console` using these credentials. The application's `ConsoleSignInForm` uses Firebase's `signInWithEmailAndPassword` method, which will verify against the credentials stored in Firebase Authentication.

### Storing Additional Profile Data in Firestore (Optional)

If you need to store additional information about these admin users (like their roles explicitly, phone numbers, etc.) in Firestore, you would:
1. Create the users in Firebase Authentication as described above.
2. Obtain their Firebase User ID (UID) after creation (visible in the Firebase Auth console).
3. Create a Firestore collection (e.g., `users` or `admins`).
4. Add documents to this collection, using the Firebase UID as the document ID. For example:

   **Collection: `users`**
   **Document ID: `[UID_OF_ABDULHAQQ_FROM_AUTH]`**
   ```json
   {
     "email": "webmanager@haqqman.com",
     "firstName": "Abdulhaqq",
     "lastName": "Sule",
     "role": "admin", // or "CTO"
     "phoneNumber": "+234 701 156 8196",
     "authProvider": "password"
   }
   ```

   **Document ID: `[UID_OF_JOSHUA_FROM_AUTH]`**
   ```json
   {
     "email": "joshua+sandbox@haqqman.com",
     "firstName": "Joshua",
     "lastName": "Ajorgbor",
     "role": "admin", // or "manager"
     "phoneNumber": "+234 903 578 4325",
     "authProvider": "password"
   }
   ```
This Firestore data is for application-specific information and **is not used for the login process itself**. The application currently determines the "admin" role based on the `@haqqman.com` email domain in the `AuthContext`.

---

### Troubleshooting Common Issues

**Error: `Firebase: Error (auth/invalid-credential)` or `INVALID_LOGIN_CREDENTIALS`**

*   **Meaning:** This error indicates that the email/password combination provided during login is incorrect, the user does not exist in Firebase Authentication, or the account might be disabled.
*   **Solution:**
    1.  **Verify User Existence & Password:** Double-check that you have created the user (e.g., `webmanager@haqqman.com`) in your Firebase project's Authentication section *and* that the password you set for this user in the Firebase console *exactly* matches `P@ssw0rd*AD!2025`. Passwords are case-sensitive. This is the most common cause.
    2.  **Check Email Spelling:** Ensure there are no typos in the email address entered on the login form.
    3.  **Check Account Status:** Make sure the user account is not disabled in the Firebase console.
    4.  **Re-create User (If unsure):** If you're uncertain, you can delete the user from the Firebase Authentication console and re-add them carefully following the "How to Set Up Admin Users in Firebase Authentication" steps above.
    5.  **Firebase Project:** Ensure your application is connected to the correct Firebase project where these users were created (check your `.env.local` or environment configuration for Firebase). The `.env.local` should be configured with the details for `addressdata-sandbox` project ID.
    6.  **Sign-in Method Enabled:** Ensure "Email/Password" is enabled as a sign-in provider in your Firebase project: Firebase Console -> Authentication -> Sign-in method tab.

The application code correctly calls Firebase for authentication. This error originates from Firebase due to a mismatch with its stored user data or configuration.
