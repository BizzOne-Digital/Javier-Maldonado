import { siteConfig } from "@/config/site";
import { sendEmail, leadNotificationHtml, confirmationHtml } from "./email";

function adminEmail() {
  return process.env.ADMIN_EMAIL || siteConfig.email;
}

export async function notifyLeadSubmission(data: {
  type: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}) {
  const notificationData: Record<string, unknown> = {
    type: data.type,
    name: data.name,
    email: data.email,
    phone: data.phone,
    message: data.message,
    ...data.metadata,
  };

  await Promise.all([
    sendEmail({
      to: data.email,
      subject: `Thank you — ${siteConfig.title}`,
      html: confirmationHtml(
        data.name,
        "We have received your submission and will be in touch shortly."
      ),
    }),
    sendEmail({
      to: adminEmail(),
      subject: `New ${data.type} lead from ${data.name}`,
      html: leadNotificationHtml(notificationData),
    }),
  ]);
}

export async function notifyBookingSubmission(data: {
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}) {
  await Promise.all([
    sendEmail({
      to: data.email,
      subject: `Booking request received — ${siteConfig.title}`,
      html: confirmationHtml(
        data.name,
        `We have received your consultation request for ${data.preferredDate} at ${data.preferredTime}. We will confirm your appointment shortly.`
      ),
    }),
    sendEmail({
      to: adminEmail(),
      subject: `New booking request from ${data.name}`,
      html: leadNotificationHtml({
        consultationType: data.consultationType,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      }),
    }),
  ]);
}
