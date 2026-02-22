const BRAND = {
  name: 'AddressData',
  primary: '#0C213A',
  secondary: '#79C142',
  accent: '#FFCC33',
  text: '#1F2937',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  muted: '#64748B',
  softBg: '#F8FAFC',
  logoUrl:
    'https://res.cloudinary.com/seapane-cloud/seapane-bucket/addressdata/meta/addressdata-logomark.svg',
  websiteUrl: 'https://www.addressdata.ng',
}

export interface WrapEmailBodyParams {
  title: string
  preheader?: string
  contentHtml: string
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function EmailHeader({ title }: { title: string }): string {
  return `
    <tr>
      <td style="padding: 28px 28px 20px; background: linear-gradient(135deg, ${BRAND.primary} 0%, #12345a 100%); text-align: center;">
        <img src="${BRAND.logoUrl}" alt="${BRAND.name} Logomark" width="56" height="56" style="display: block; margin: 0 auto 14px;" />
        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.82);">
          ${BRAND.name}
        </p>
        <h1 style="margin: 8px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 24px; line-height: 1.3; color: #FFFFFF;">
          ${escapeHtml(title)}
        </h1>
      </td>
    </tr>
  `
}

export function EmailFooter(): string {
  return `
    <tr>
      <td style="padding: 20px 28px 26px; background-color: ${BRAND.softBg}; border-top: 1px solid ${BRAND.border}; text-align: center;">
        <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.6; color: ${BRAND.muted};">
          Accurate, verified, and developer-ready Nigerian address data.
        </p>
        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 12px; color: ${BRAND.muted};">
          &copy; ${new Date().getFullYear()} ${BRAND.name}. All Rights Reserved.
          <a href="${BRAND.websiteUrl}" style="color: ${BRAND.primary}; text-decoration: none;"> addressdata.ng</a>
        </p>
      </td>
    </tr>
  `
}

export function wrapEmailBody({
  title,
  preheader,
  contentHtml,
}: WrapEmailBodyParams): string {
  const safePreheader = escapeHtml(preheader ?? title)

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin: 0; padding: 22px 14px; background-color: #F1F5F9;">
    <span style="display: none; visibility: hidden; mso-hide: all; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden;">
      ${safePreheader}
    </span>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 640px; border-collapse: collapse; background-color: ${BRAND.surface}; border: 1px solid ${BRAND.border}; border-radius: 12px; overflow: hidden;">
            ${EmailHeader({ title })}
            <tr>
              <td style="padding: 26px 28px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: ${BRAND.text}; font-size: 15px; line-height: 1.7;">
                ${contentHtml}
              </td>
            </tr>
            ${EmailFooter()}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `
}

export const EMAIL_BRAND = BRAND
