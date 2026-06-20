"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";
const APP_NAME = "Eensell";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://eensell.com";

interface EmailTemplateProps {
  title: string;
  subtitle?: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface UserRecipient {
  email: string;
  name: string;
}

// Highly premium dark-themed email template
function buildPremiumTemplate({ title, subtitle, content, ctaText, ctaUrl }: EmailTemplateProps) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#09090b;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#fafafa;-webkit-font-smoothing:antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#09090b;padding:60px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
                
                <!-- Main Card -->
                <tr>
                  <td style="background-color:#18181b;border:1px solid #27272a;border-radius:16px;padding:48px 40px;box-shadow:0 20px 40px -15px rgba(0,0,0,0.5);">
                    ${subtitle ? `<p style="margin:0 0 8px;color:#a1a1aa;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${subtitle}</p>` : ''}
                    <h1 style="margin:0 0 24px;color:#ffffff;font-size:28px;font-weight:700;line-height:1.3;letter-spacing:-0.5px;">
                      ${title}
                    </h1>
                    <div style="color:#d4d4d8;font-size:16px;line-height:1.7;margin:0 0 36px;">
                      ${content}
                    </div>
                    
                    ${ctaText && ctaUrl ? `
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <a href="${ctaUrl}" style="display:inline-block;background-color:#ffffff;color:#09090b;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:600;font-size:16px;transition:all 0.2s ease;">
                            ${ctaText}
                          </a>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding-top:40px;">
                    <p style="margin:0 0 8px;color:#71717a;font-size:13px;line-height:1.5;">
                      Sent with precision by <strong style="color:#a1a1aa;font-weight:500;">${APP_NAME}</strong>
                    </p>
                    <p style="margin:0;color:#52525b;font-size:12px;">
                      © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// 1. Send approval email
export async function sendApprovalEmail(
  toEmail: string,
  userName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Eensell <${FROM_EMAIL}>`,
      to: toEmail,
      subject: `Welcome to ${APP_NAME} — Your Account Has Been Approved! 🎉`,
      html: buildPremiumTemplate({
        title: `Welcome aboard, ${userName}! 🎉`,
        subtitle: "Application Approved",
        content: `
          <p style="margin:0 0 16px;">Great news! Your account has been securely approved and activated.</p>
          <p style="margin:0;">You now have full, unrestricted access to all premium courses, resources, and live sessions on ${APP_NAME}.</p>
        `,
        ctaText: "Go to Dashboard",
        ctaUrl: `${APP_URL}/dashboard`
      })
    });

    if (error) {
      console.error("Error sending approval email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send approval email:", error);
    return { success: false, error };
  }
}

// 2. Send rejection email
export async function sendRejectionEmail(
  toEmail: string,
  userName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Eensell <${FROM_EMAIL}>`,
      to: toEmail,
      subject: `${APP_NAME} — Account Application Update`,
      html: buildPremiumTemplate({
        title: `Hello ${userName}`,
        subtitle: "Application Update",
        content: `
          <p style="margin:0 0 16px;">Thank you for your interest in ${APP_NAME}. After careful review, we are unable to approve your application at this time.</p>
          <p style="margin:0;">If you believe this decision was made in error or if your circumstances have changed, please feel free to reach out to our dedicated support team.</p>
        `,
        ctaText: "Contact Support",
        ctaUrl: `${APP_URL}/support`
      })
    });

    if (error) {
      console.error("Error sending rejection email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send rejection email:", error);
    return { success: false, error };
  }
}

// 3. Send Module Dropped Email
export async function sendModuleDroppedEmail(
  users: UserRecipient[],
  moduleTitle: string,
  redirectUrl: string
) {
  try {
    const results = await Promise.allSettled(
      users.map((user) =>
        resend.emails.send({
          from: `Eensell <${FROM_EMAIL}>`,
          to: user.email,
          subject: `New Module Available: ${moduleTitle} 🚀`,
          html: buildPremiumTemplate({
            title: `Hi ${user.name}, a new module just dropped!`,
            subtitle: "New Content Unlocked",
            content: `
              <p style="margin:0 0 16px;">We just released a brand new module: <strong>${moduleTitle}</strong>.</p>
              <p style="margin:0;">Dive in now to continue your learning journey and stay ahead of the curve.</p>
            `,
            ctaText: "Start Learning",
            ctaUrl: redirectUrl.startsWith('http') ? redirectUrl : `${APP_URL}${redirectUrl}`
          })
        })
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Failed to send module dropped emails:", error);
    return { success: false, error };
  }
}

// 4. Send Live Session Scheduled Email
export async function sendLiveSessionScheduledEmail(
  users: UserRecipient[],
  sessionTitle: string,
  sessionDate: string,
  redirectUrl: string
) {
  try {
    const results = await Promise.allSettled(
      users.map((user) =>
        resend.emails.send({
          from: `Eensell <${FROM_EMAIL}>`,
          to: user.email,
          subject: `Upcoming Live Session: ${sessionTitle} 📅`,
          html: buildPremiumTemplate({
            title: `Hi ${user.name}, get ready for our next live session!`,
            subtitle: "Live Session Scheduled",
            content: `
              <p style="margin:0 0 16px;">A new live session has been scheduled: <strong>${sessionTitle}</strong>.</p>
              <p style="margin:0 0 16px;"><strong>Date & Time:</strong> ${sessionDate}</p>
              <p style="margin:0;">Make sure to mark your calendar and join us live for an interactive experience.</p>
            `,
            ctaText: "View Session Details",
            ctaUrl: redirectUrl.startsWith('http') ? redirectUrl : `${APP_URL}${redirectUrl}`
          })
        })
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Failed to send live session emails:", error);
    return { success: false, error };
  }
}

// 5. Send Community Post Email
export async function sendCommunityPostEmail(
  users: UserRecipient[],
  postTitle: string,
  redirectUrl: string
) {
  try {
    const results = await Promise.allSettled(
      users.map((user) =>
        resend.emails.send({
          from: `Eensell <${FROM_EMAIL}>`,
          to: user.email,
          subject: `New Admin Announcement: ${postTitle} 📢`,
          html: buildPremiumTemplate({
            title: `Hi ${user.name}, there's a new post in the community!`,
            subtitle: "Community Update",
            content: `
              <p style="margin:0 0 16px;">An admin just posted an important update in the community: <strong>${postTitle}</strong>.</p>
              <p style="margin:0;">Join the conversation and see what others are saying.</p>
            `,
            ctaText: "Read the Post",
            ctaUrl: redirectUrl.startsWith('http') ? redirectUrl : `${APP_URL}${redirectUrl}`
          })
        })
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Failed to send community post emails:", error);
    return { success: false, error };
  }
}

// Generic broadcast email (optional fallback)
export async function sendBroadcastEmail(
  toEmails: string[],
  subject: string,
  content: string
) {
  try {
    const results = await Promise.allSettled(
      toEmails.map((email) =>
        resend.emails.send({
          from: `Eensell <${FROM_EMAIL}>`,
          to: email,
          subject,
          html: buildPremiumTemplate({
            title: subject,
            subtitle: "Update",
            content: `<div style="color:#d4d4d8;line-height:1.7;">${content}</div>`
          })
        })
      )
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Failed to send broadcast:", error);
    return { success: false, error };
  }
}
