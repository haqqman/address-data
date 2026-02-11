# Interfaces Policy

This document outlines the policy for managing TypeScript interfaces and type definitions within this application. Adhering to this policy ensures consistency, reduces code duplication, and improves maintainability.

## 1. Centralized Location

All shared TypeScript `interface` and `type` definitions **must** reside in the `@/services/interfaces/` directory.

## 2. Domain-Specific Files

Interfaces should be grouped into domain-specific files to keep them organized. The filename should reflect the domain it represents.

**Examples:**

- `auth.interfaces.ts`: For authentication-related interfaces like `LogInCredentials`, `CreateAccount`, etc.
- `user.interfaces.ts`: For user-related interfaces like `UserProfile`, `User`, `TeamMember`, etc.
- `entity.interfaces.ts`: For `Entity`, `License`, `Address`, etc.
- `distributor.interfaces.ts`: For `Distributor`.
- `product.interfaces.ts`: For `Product`.

## 3. File Contents

Each interface file should:

- Contain **only** `interface` and `type` definitions. No functions, classes, or other implementation logic should be present.
- Use **named exports** for all definitions (`export interface User`). Do not use default exports.

## 4. Naming Convention

Interfaces should be named using PascalCase and clearly represent the data structure they define. A common pattern is `[EntityName]` or `[EntityName][Action]`.

**Examples:**

- `UserProfile`
- `Entity`
- `CreateDistributorRequest`
- `UpdateSalePayload`

## 5. Usage

When you need to use a shared interface, import it directly from its new location:

```typescript
import type { User, TeamMember } from '@/services/interfaces/user.interfaces'
import type { Entity } from '@/services/interfaces/entity.interfaces'
```

By following this convention, we ensure a single source of truth for our data structures, making the codebase cleaner and easier for developers to navigate.
