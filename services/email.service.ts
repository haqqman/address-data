'use server';

import { ServerClient } from 'postmark';

const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME || "Address Data";
const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || "noreply@addressdata.ng";

interface WelcomeEmailParams {
    name: string;
    email: string;
}

const welcomeEmailTemplate = ({ name }: { name: string }) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to Address Data</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #f4f4f7; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #0C213A; color: #ffffff; padding: 40px; text-align: center; }
        .header img { margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 40px; color: #1F2937; line-height: 1.6; }
        .content h2 { color: #0C213A; margin-top: 0; }
        .content p { margin: 0 0 20px; }
        .button-container { text-align: center; margin-top: 30px; }
        .button { background-color: #FFCC33; color: #0C213A; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
        .footer a { color: #0C213A; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://res.cloudinary.com/seapane-cloud/seapane-bucket/address-data/meta/address-data-logomark.png" alt="Address Data Logo" width="60">
            <h1>Welcome to Address Data!</h1>
        </div>
        <div class="content">
            <h2>Hi ${name},</h2>
            <p>We are thrilled to have you on board. Address Data is your new home for validating, storing, and retrieving Nigerian address data with unparalleled accuracy and ease.</p>
            <p>You can now start contributing addresses to our platform, generate API keys for your projects, and explore our comprehensive database of Nigerian locations.</p>
            <div class="button-container">
                <a href="https://www.addressdata.ng/dashboard" class="button">Go to Your Dashboard</a>
            </div>
            <p style="margin-top: 30px;">If you have any questions, feel free to visit our support page or check out our documentation.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Address Data. All Rights Reserved.</p>
            <p><a href="https://www.addressdata.ng">addressdata.ng</a></p>
        </div>
    </div>
</body>
</html>
`;

export async function sendWelcomeEmail({ name, email }: WelcomeEmailParams) {
    const token = process.env.POSTMARK_SERVER_TOKEN;
    if (!token) {
        console.warn("POSTMARK_SERVER_TOKEN is not set. Skipping welcome email.");
        return;
    }

    const postmarkClient = new ServerClient(token);

    try {
        await postmarkClient.sendEmail({
            "From": `"${MAIL_FROM_NAME}" <${MAIL_FROM_ADDRESS}>`,
            "To": email,
            "Subject": "Welcome to Address Data!",
            "HtmlBody": welcomeEmailTemplate({ name }),
            "MessageStream": "outbound" 
        });
        console.log(`Welcome email sent successfully to ${email}`);
    } catch (error) {
        console.error("Error sending welcome email:", error);
        // We don't throw an error here to avoid blocking the user registration flow
    }
}
