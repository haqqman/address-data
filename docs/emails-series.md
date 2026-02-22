# Email Series

This document tracks active outbound email flows for the AddressData app.

## Transactional

### 1. Welcome Email

- Trigger: First successful social registration for a new portal user profile.
- Entry point: `contexts/auth-context.tsx`.
- Sender function: `emails/welcome.email.ts` -> `sendWelcomeEmail`.
- Delivery layer: `emails/email-service.ts` (`sendEmail`, ZeptoMail).
- Recipient: Newly registered user (`newUserProfile.email`).
- Primary CTA: `https://www.addressdata.ng/dashboard`.
