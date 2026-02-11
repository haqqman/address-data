# Email System Policy

This document defines the architectural standards and implementation patterns for the transactional email system in this application.

## Directory Structure

All email-related code is located in the `emails/` directory at the root of the project.

- `emails/index.ts`: The central aggregator (barrel file). All application code should import email functions from here.
- `emails/email-service.ts`: The core transporter. Contains ZeptoMail configuration and the low-level `sendEmail` utility.
- `emails/layout.email.ts`: Common UI components (Header, Footer) and the central HTML wrapper used by all templates.
- `emails/*.email.ts`: Specific template implementations (e.g., `onboarding.email.ts`).

## Implementation Standards

### 1. Template Files
Each email template must reside in its own file named `[feature-name].email.ts`. 

- **Directives**: Must include `'use server'` at the top.
- **Stream Tags**: Include a comment `/** stream=[transactional|marketing] */` for classification, which is metadata-only at template level, not part of function params.
- **Dependencies**: Must import the generic `sendEmail` from `./email-service`.
- **Functions**: Should export a single `async` function named `send[Feature]Email`.
- **Typing**: Must export a corresponding interface or type named `[Feature]EmailParams` for the function arguments.

### 2. The Transporter (`email-service.ts`)
The core transporter is responsible for:
- Environment variable validation (`ZEPTOMAIL_API_KEY`, `MAIL_FROM_ADDRESS`).
- Email header escaping (security).
- Injecting the global Layout (`wrapEmailBody`).
- Async execution via ZeptoMail Node SDK.

### 3. The Aggregator (`index.ts`)
The barrel file provides a unified API. To avoid Next.js build issues with Server Actions:
- **Do not** use `'use server'` in `index.ts`.
- **Explicitly export** functions: `export { sendFeatureEmail } from './feature.email'`.
- **Export interfaces as types**: `export type { FeatureEmailParams } from './feature.email'`.

### 4. Layout & Styling (`layout.email.ts`)
- Use inline Vanilla CSS for all templates.
- Avoid `'use server'` in the layout file to support synchronous string-building utilities.
- Maintain consistent branding (Logo, logomark and brand colors).

## Development Workflow

When adding a new email notification:
1. Create `emails/[name].email.ts`.
2. Implement the async function using the `sendEmail` utility.
3. Add the function and its param type to `emails/index.ts`.
4. Update `docs/emails-series.md` to document the new flow.
5. Import from `@/emails` in your application action.

## Security & Reliability
- **Header Injection**: All dynamic values used in headers (Subject, To, From) must be run through the `escapeEmailHeaderValue` utility in `email-service.ts`.
- **Logging**: All successful sends and errors are logged to the console for monitoring via Cloud Run logs.

