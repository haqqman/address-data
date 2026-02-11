# Firebase Architecture & File Organization Policy

**Agency**: Haqqman  
**Scope**: Standard policy for all Haqqman Firebase applications

## Overview

This document defines the standardized Firebase folder structure and file organization policy for all Haqqman Firebase applications. This structure ensures consistency, maintainability, and proper tooling integration across projects.

## Directory Structure

```
project-root/
├── firebase/                   # Firebase application code
│   ├── client.ts               # Firebase client SDK initialization & exports
│   ├── client.d.ts             # Type definitions for Firebase client
│   └── server.ts               # Firebase server/admin SDK initialization & exports
├── firebase.json               # Firebase CLI configuration
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore composite indexes
└── apphosting.yaml             # Firebase App Hosting configuration
```

## File Classification

### 🗂️ Configuration Files (Root Level)

These files are **Firebase project configuration** and must remain at the project root.

| File                     | Purpose                                                                  | Ownership             |
| ------------------------ | ------------------------------------------------------------------------ | --------------------- |
| `firebase.json`          | Firebase CLI configuration - defines which rules/indexes files to deploy | Firebase CLI / DevOps |
| `firestore.rules`        | Firestore security rules - access control policies                       | Backend / Security    |
| `firestore.indexes.json` | Composite index definitions for query optimization                       | Backend / Database    |
| `apphosting.yaml`        | Firebase App Hosting runtime configuration (Cloud Run settings)          | DevOps / Backend      |

**Why root level?**

- Firebase CLI expects these at project root during `firebase deploy`
- Standard across all Firebase projects (consistency with official Firebase structure)
- Referenced in `firebase.json` with relative paths
- Not source code - pure infrastructure configuration

### 💻 Application Code Files (firebase/ folder)

These files are **application code** that interacts with Firebase SDKs.

| File                   | Purpose                                                                    | Usage                       |
| ---------------------- | -------------------------------------------------------------------------- | --------------------------- |
| `firebase/client.ts`   | Firebase client SDK initialization, authentication, Firestore client setup | Browser/Client-side code    |
| `firebase/client.d.ts` | TypeScript type definitions for client SDK exports                         | Type safety for client code |
| `firebase/server.ts`   | Firebase Admin SDK initialization, server-side operations                  | Server-side/API routes      |

**Why firebase/ folder?**

- These are application code, not infrastructure configuration
- Grouped together for logical organization and discoverability
- Can scale to include additional Firebase modules (analytics, storage, etc.)
- Follows separation of concerns: config separate from code

## Import Usage Patterns

### Client-Side Code

```typescript
import { auth, db } from '@/firebase/client'
```

### Server-Side Code

```typescript
import { adminAuth, adminDb } from '@/firebase/server'
```

## Policy Guidelines

### ✅ DO

- Keep configuration files at the project root
- Organize all Firebase SDK code in the `firebase/` folder
- Use path aliases (`@/firebase/*`) for clean imports
- Export initialized instances from `firebase/client.ts` and `firebase/server.ts`
- Document any additional Firebase modules (storage, functions, etc.) if added to the folder

### ❌ DON'T

- Move `firebase.json`, `firestore.rules`, `firestore.indexes.json`, or `apphosting.yaml` into the firebase folder
- Store security rules or configuration files in the source code folder
- Import directly from Firebase SDKs without going through `firebase/client.ts` or `firebase/server.ts`
- Mix configuration and application code in the same folder

## Deployment Flow

1. **Local Development**: Changes to security rules/indexes are tested locally
2. **Config Files**: Update root-level configuration files as needed
3. **Application Code**: Update `firebase/client.ts` or `firebase/server.ts` as needed
4. **Deploy**: Run `firebase deploy` which:
   - Reads `firebase.json` from root
   - Deploys security rules from `firestore.rules`
   - Deploys indexes from `firestore.indexes.json`
   - Deploys App Hosting config from `apphosting.yaml`
   - Application code is deployed separately with your Next.js/Node application

## Examples

### Adding Firebase Storage

```typescript
// firebase/client.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

### Adding Analytics

```typescript
// firebase/client.ts
import { getAnalytics } from 'firebase/analytics'

export const analytics = getAnalytics(app)
```

## Consistency Across Projects

This policy must be applied consistently across all Haqqman Firebase applications to:

- Enable developers to quickly understand Firebase structure in any project
- Reduce onboarding time for new team members
- Standardize deployment procedures
- Enable shared patterns and best practices
- Maintain agency-wide best practices and code quality standards

---

**Agency**: Haqqman  
**Policy Owner**: Haqqman Development Team  
**Last Updated**: February 5, 2026  
**Policy Version**: 1.0  
**Applicability**: All Haqqman Firebase Applications
