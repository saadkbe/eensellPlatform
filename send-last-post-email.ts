/**
 * Send an email about the latest community post to all ACTIVE users.
 * Usage: npx tsx send-last-post-email.ts
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { Resend } from 'resend';

neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaNeon({ connectionString });
const db = new PrismaClient({ adapter });

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";
const APP_NAME = "Eensell";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://eensell.com";

function buildPremiumTemplate(title: string, subtitle: string, content: string, ctaText: string, ctaUrl: string) {
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
                <tr>
                  <td style="background-color:#18181b;border:1px solid #27272a;border-radius:16px;padding:48px 40px;box-shadow:0 20px 40px -15px rgba(0,0,0,0.5);">
                    <p style="margin:0 0 8px;color:#a1a1aa;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${subtitle}</p>
                    <h1 style="margin:0 0 24px;color:#ffffff;font-size:28px;font-weight:700;line-height:1.3;letter-spacing:-0.5px;">
                      ${title}
                    </h1>
                    <div style="color:#d4d4d8;font-size:16px;line-height:1.7;margin:0 0 36px;">
                      ${content}
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left">
                          <a href="${ctaUrl}" style="display:inline-block;background-color:#ffffff;color:#09090b;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:600;font-size:16px;">
                            ${ctaText}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
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

async function main() {
  console.log("🔍 Fetching the latest community post...\n");

  // Get the most recent post
  const lastPost = await db.communityPost.findFirst({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  if (!lastPost) {
    console.log("❌ No community posts found.");
    process.exit(1);
  }

  const authorName = [lastPost.author.firstName, lastPost.author.lastName].filter(Boolean).join(" ") || "Eensell Team";
  console.log(`📝 Latest post: "${lastPost.title}"`);
  console.log(`   By: ${authorName}`);
  console.log(`   Posted: ${lastPost.createdAt.toISOString()}\n`);

  // Get all active users
  const activeUsers = await db.user.findMany({
    where: { status: "ACTIVE" },
    select: { email: true, firstName: true },
  });

  console.log(`👥 Found ${activeUsers.length} active user(s) to email.\n`);

  if (activeUsers.length === 0) {
    console.log("⚠️  No active users to send to.");
    process.exit(0);
  }

  // Send in batches of 100
  const BATCH_SIZE = 100;
  let sent = 0;
  let failed = 0;
  const redirectUrl = `${APP_URL}/dashboard/community`;

  for (let i = 0; i < activeUsers.length; i += BATCH_SIZE) {
    const batch = activeUsers.slice(i, i + BATCH_SIZE);
    console.log(`📤 Sending batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} emails)...`);

    try {
      const { data, error } = await resend.batch.send(
        batch.map((user) => ({
          from: `Eensell <${FROM_EMAIL}>`,
          to: user.email!,
          subject: `New Admin Announcement: ${lastPost.title} 📢`,
          html: buildPremiumTemplate(
            `Hi ${user.firstName || "there"}, there's a new post in the community!`,
            "Community Update",
            `
              <p style="margin:0 0 16px;">An admin just posted an important update in the community: <strong>${lastPost.title}</strong>.</p>
              <p style="margin:0;">Join the conversation and see what others are saying.</p>
            `,
            "Read the Post",
            redirectUrl
          ),
        }))
      );

      if (error) {
        console.error(`   ❌ Batch error:`, error);
        failed += batch.length;
      } else {
        console.log(`   ✅ Batch sent successfully.`);
        sent += batch.length;
      }
    } catch (err) {
      console.error(`   ❌ Batch exception:`, err);
      failed += batch.length;
    }
  }

  console.log(`\n✅ Done! Sent: ${sent}, Failed: ${failed}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
