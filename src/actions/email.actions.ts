"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";
const APP_NAME = "Eensell University";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Send approval email
export async function sendApprovalEmail(
  toEmail: string,
  userName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: toEmail,
      subject: `Welcome to ${APP_NAME} — Your Account Has Been Approved! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Inter',sans-serif;">
            <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
              <!-- Header -->
              <div style="text-align:center;margin-bottom:32px;">
                <div style="display:inline-block;background:linear-gradient(135deg,#3B82F6,#2563EB);padding:12px 16px;border-radius:12px;margin-bottom:16px;">
                  <span style="color:#fff;font-weight:bold;font-size:18px;">EU</span>
                </div>
                <h1 style="color:#FFFFFF;font-size:24px;margin:0;font-weight:700;">${APP_NAME}</h1>
              </div>
              
              <!-- Content Card -->
              <div style="background:#0A0A0A;border:1px solid #262626;border-radius:16px;padding:32px;margin-bottom:24px;">
                <h2 style="color:#FFFFFF;font-size:20px;margin:0 0 12px;font-weight:600;">
                  Welcome aboard, ${userName}! 🎉
                </h2>
                <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 24px;">
                  Great news! Your account has been approved. You now have full access to 
                  all courses, resources, and live sessions on ${APP_NAME}.
                </p>
                
                <!-- CTA Button -->
                <a href="${APP_URL}/dashboard" 
                   style="display:inline-block;background:linear-gradient(135deg,#3B82F6,#2563EB);color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;">
                  Go to Dashboard →
                </a>
              </div>
              
              <!-- Footer -->
              <p style="color:#6B7280;font-size:13px;text-align:center;margin:0;">
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
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

// Send rejection email
export async function sendRejectionEmail(
  toEmail: string,
  userName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to: toEmail,
      subject: `${APP_NAME} — Account Application Update`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Inter',sans-serif;">
            <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
              <!-- Header -->
              <div style="text-align:center;margin-bottom:32px;">
                <div style="display:inline-block;background:linear-gradient(135deg,#3B82F6,#2563EB);padding:12px 16px;border-radius:12px;margin-bottom:16px;">
                  <span style="color:#fff;font-weight:bold;font-size:18px;">EU</span>
                </div>
                <h1 style="color:#FFFFFF;font-size:24px;margin:0;font-weight:700;">${APP_NAME}</h1>
              </div>
              
              <!-- Content Card -->
              <div style="background:#0A0A0A;border:1px solid #262626;border-radius:16px;padding:32px;margin-bottom:24px;">
                <h2 style="color:#FFFFFF;font-size:20px;margin:0 0 12px;font-weight:600;">
                  Hello ${userName},
                </h2>
                <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0 0 16px;">
                  Thank you for your interest in ${APP_NAME}. Unfortunately, we are unable 
                  to approve your application at this time.
                </p>
                <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin:0;">
                  If you believe this was a mistake, please contact our support team.
                </p>
              </div>
              
              <!-- Footer -->
              <p style="color:#6B7280;font-size:13px;text-align:center;margin:0;">
                © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
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

// Send broadcast email
export async function sendBroadcastEmail(
  toEmails: string[],
  subject: string,
  content: string
) {
  try {
    const results = await Promise.allSettled(
      toEmails.map((email) =>
        resend.emails.send({
          from: `${APP_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </head>
              <body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Inter',sans-serif;">
                <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
                  <div style="text-align:center;margin-bottom:32px;">
                    <div style="display:inline-block;background:linear-gradient(135deg,#3B82F6,#2563EB);padding:12px 16px;border-radius:12px;margin-bottom:16px;">
                      <span style="color:#fff;font-weight:bold;font-size:18px;">EU</span>
                    </div>
                  </div>
                  <div style="background:#0A0A0A;border:1px solid #262626;border-radius:16px;padding:32px;margin-bottom:24px;">
                    <div style="color:#FFFFFF;font-size:15px;line-height:1.6;">
                      ${content}
                    </div>
                  </div>
                  <p style="color:#6B7280;font-size:13px;text-align:center;margin:0;">
                    © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                  </p>
                </div>
              </body>
            </html>
          `,
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
