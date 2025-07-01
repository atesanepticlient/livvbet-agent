// lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. mail.yourdomain.com
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USERNAME, // your@yourdomain.com
    pass: process.env.SMTP_PASSWORD, // email password
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailOptions) {
  try {
    await transporter.sendMail({
      from: `"Livvbet" <${process.env.SMTP_USERNAME}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export function generatePasswordResetEmail(token: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Here's your verification code:</p>
      <div style="background: #f4f4f4; padding: 10px; margin: 10px 0; font-size: 24px; letter-spacing: 2px; text-align: center;">
        ${token}
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;
}
