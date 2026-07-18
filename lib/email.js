// FILE PATH: lib/email.js
// ---------------------------------------------------------------------
// Sends emails through your own Gmail account (via SMTP + an App
// Password) instead of a third-party service. No domain verification
// needed -- this can email any real customer address immediately.
//
// Uses the "nodemailer" package -- see package.json note below.
// Server-side only -- never import this from a "use client" file.
// ---------------------------------------------------------------------

import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;

export const isEmailConfigured = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

export function adminEmail() {
  return ADMIN_EMAIL || null;
}

let transporter;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html }) {
  if (!isEmailConfigured || !to) {
    console.warn("Email skipped (not configured or no recipient):", subject);
    return { skipped: true };
  }

  try {
    await getTransporter().sendMail({
      from: `"The Bull & Bear Co." <${GMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    // Don't throw -- a failed email should never break checkout/contact.
    console.error("Gmail send error:", err.message);
    return { failed: true, error: err.message };
  }
}

