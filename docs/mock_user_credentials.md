
# Mock User Credentials for Console Access

This document outlines the intended credentials for mock admin users.
**Important:** These passwords need to be set manually in the Firebase Authentication console when creating these user accounts. They are not "seeded" into the application code directly.

## Admin Users:

1.  **Abdulhaqq Sule (CTO)**
    *   **Email:** `webmanager@haqqman.com`
    *   **Intended Password:** `P@ssw0rd*AD!2025`

2.  **Joshua Ajorgbor (Manager)**
    *   **Email:** `joshua+sandbox@haqqman.com`
    *   **Intended Password:** `P@ssw0rd*AD!2025`

### How to Set Up:
1. Go to your Firebase Project Console.
2. Navigate to "Authentication" -> "Users" tab.
3. Click "Add user".
4. Enter the email address (e.g., `webmanager@haqqman.com`).
5. Enter the desired password (i.e., `P@ssw0rd*AD!2025`).
6. Click "Add user".

Repeat for both users.

These users will then be able to log in to the Admin Console using these credentials.
The application's `ConsoleSignInForm` uses Firebase's `signInWithEmailAndPassword` method, which will verify against the credentials stored in Firebase Authentication.

---

### Troubleshooting Common Issues

**Error: `Firebase: Error (auth/invalid-credential)` or `INVALID_LOGIN_CREDENTIALS`**

*   **Meaning:** This error indicates that the email/password combination provided during login is incorrect, the user does not exist in Firebase Authentication, or the account might be disabled.
*   **Solution:**
    1.  **Verify User Existence:** Double-check that you have created the user (e.g., `webmanager@haqqman.com`) in your Firebase project's Authentication section.
    2.  **Verify Password:** Ensure the password you set for this user in the Firebase console *exactly* matches `P@ssw0rd*AD!2025`. Passwords are case-sensitive.
    3.  **Check Email Spelling:** Ensure there are no typos in the email address entered on the login form.
    4.  **Check Account Status:** Make sure the user account is not disabled in the Firebase console.
    5.  **Re-create User (If unsure):** If you're uncertain, you can delete the user from the Firebase Authentication console and re-add them carefully following the "How to Set Up" steps above.
    6.  **Firebase Project:** Ensure your application is connected to the correct Firebase project where these users were created (check your `.env.local` or environment configuration for Firebase).

The application code correctly calls Firebase for authentication. This error originates from Firebase due to a mismatch with its stored user data.
