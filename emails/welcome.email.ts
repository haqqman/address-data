'use server';

/** stream=transactional */

import { sendEmail } from "./email-service";
import { EMAIL_BRAND, escapeHtml } from "./layout.email";

export interface WelcomeEmailParams {
  name: string;
  email: string;
}

function welcomeEmailBody({ name }: { name: string }): string {
  const safeName = escapeHtml(name);

  return `
    <p style="margin: 0 0 14px; font-size: 16px;">Hi ${safeName},</p>
    <p style="margin: 0 0 14px;">
      Welcome to AddressData. You now have access to a platform built for accurate Nigerian address validation,
      storage, and retrieval.
    </p>
    <p style="margin: 0 0 18px;">
      Start by exploring your dashboard, generating API keys, and submitting your first addresses to strengthen the network.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px 0 24px; border-collapse: collapse;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: ${EMAIL_BRAND.accent};">
          <a href="https://www.addressdata.ng/dashboard" style="display: inline-block; padding: 12px 22px; font-size: 14px; font-weight: 700; color: ${EMAIL_BRAND.primary}; text-decoration: none;">
            Go to Your Dashboard
          </a>
        </td>
      </tr>
    </table>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse; border: 1px solid ${EMAIL_BRAND.border}; border-radius: 10px; overflow: hidden;">
      <tr>
        <td style="padding: 12px 14px; background-color: #F8FAFC; border-left: 4px solid ${EMAIL_BRAND.secondary}; color: ${EMAIL_BRAND.text}; font-size: 13px;">
          Need help? Visit <a href="https://www.addressdata.ng/support" style="color: ${EMAIL_BRAND.primary}; text-decoration: none;">Support</a>
          or reply to this email.
        </td>
      </tr>
    </table>
  `;
}

export async function sendWelcomeEmail({
  name,
  email,
}: WelcomeEmailParams): Promise<void> {
  try {
    await sendEmail({
      to: email,
      subject: "Welcome to AddressData",
      preheader: "Your AddressData account is ready.",
      htmlBody: welcomeEmailBody({ name }),
      textBody: `Hi ${name}, welcome to AddressData. Visit https://www.addressdata.ng/dashboard to get started.`,
    });
  } catch (error) {
    console.error("[email] Welcome email failed", { email, error });
    // Non-blocking by design; registration should continue even if mail fails.
  }
}
