import { SendMailClient } from "zeptomail";
import { wrapEmailBody } from "./layout.email";

export interface SendEmailParams {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  preheader?: string;
  fromName?: string;
  replyTo?: string;
}

const ZEPTOMAIL_URL = process.env.ZEPTOMAIL_API_URL || "api.zeptomail.com/";
const DEFAULT_FROM_NAME = process.env.MAIL_FROM_NAME || "AddressData";

function requireEnv(name: "ZEPTOMAIL_API_KEY" | "MAIL_FROM_ADDRESS"): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is not configured for email sending.`);
  }
  return value;
}

export function escapeEmailHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/[^\x20-\x7E]/g, "").trim();
}

function getClient(): SendMailClient {
  return new SendMailClient({
    url: ZEPTOMAIL_URL,
    token: requireEnv("ZEPTOMAIL_API_KEY"),
  });
}

export async function sendEmail({
  to,
  subject,
  htmlBody,
  textBody,
  preheader,
  fromName,
  replyTo,
}: SendEmailParams): Promise<void> {
  const fromAddress = escapeEmailHeaderValue(requireEnv("MAIL_FROM_ADDRESS"));
  const safeFromName = escapeEmailHeaderValue(fromName || DEFAULT_FROM_NAME);
  const safeTo = escapeEmailHeaderValue(to);
  const safeSubject = escapeEmailHeaderValue(subject);
  const safeReplyTo = replyTo ? escapeEmailHeaderValue(replyTo) : undefined;

  const client = getClient();

  try {
    await client.sendMail({
      from: {
        address: fromAddress,
        name: safeFromName,
      },
      to: [
        {
          email_address: {
            address: safeTo,
          },
        },
      ],
      ...(safeReplyTo
        ? {
            reply_to: [{ address: safeReplyTo, name: safeFromName }],
          }
        : {}),
      subject: safeSubject,
      htmlbody: wrapEmailBody({
        title: safeSubject,
        preheader,
        contentHtml: htmlBody,
      }),
      ...(textBody ? { textbody: textBody } : {}),
      track_clicks: true,
      track_opens: true,
      client_reference: "addressdata-transactional",
    });

    console.log(`[email] Sent email to ${safeTo}: ${safeSubject}`);
  } catch (error) {
    console.error("[email] Failed to send email", {
      to: safeTo,
      subject: safeSubject,
      error,
    });
    throw error;
  }
}
