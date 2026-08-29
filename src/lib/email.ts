import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP not configured, email skipped:", subject);
    return { success: false, error: "SMTP not configured" };
  }
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || siteConfig.email,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error: String(error) };
  }
}

export function leadNotificationHtml(data: Record<string, unknown>) {
  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:600">${k}</td><td style="padding:8px;border:1px solid #ddd">${String(v)}</td></tr>`)
    .join("");
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#071A2B,#327C9A);padding:24px;color:#E8D7B8">
        <h1 style="margin:0;font-size:20px">New Lead — Javier Maldonado Real Estate</h1>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-top:16px">${rows}</table>
    </div>`;
}

export function confirmationHtml(name: string, message: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#071A2B,#327C9A);padding:24px;color:#E8D7B8">
        <h1 style="margin:0;font-size:20px">Thank you for contacting Javier Maldonado Real Estate</h1>
      </div>
      <p style="padding:16px;color:#071A2B">Dear ${name},</p>
      <p style="padding:0 16px;color:#132D3A">${message}</p>
      <p style="padding:16px;color:#132D3A">Best regards,<br/>Javier Maldonado<br/>${siteConfig.brokerage}</p>
    </div>`;
}
