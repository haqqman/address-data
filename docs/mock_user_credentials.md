
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
4. Enter the email address and the desired password (`P@ssw0rd*AD!2025`).
5. Click "Add user".

Repeat for both users.

These users will then be able to log in to the Admin Console using these credentials.
The application's `ConsoleSignInForm` uses Firebase's `signInWithEmailAndPassword` method, which will verify against the credentials stored in Firebase Authentication.
