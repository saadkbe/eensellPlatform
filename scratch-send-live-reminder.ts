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
const APP_NAME = "Eensell University";

function buildPremiumTemplate(title: string, subtitle: string, content: string) {
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
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#09090b;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
                <!-- Main Card -->
                <tr>
                  <td style="background-color:#18181b;border:1px solid #27272a;border-radius:16px;padding:40px 32px;box-shadow:0 20px 40px -15px rgba(0,0,0,0.5);">
                    <p style="margin:0 0 8px;color:#a1a1aa;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">${subtitle}</p>
                    <h1 style="margin:0 0 24px;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;letter-spacing:-0.5px;">
                      ${title}
                    </h1>
                    <div style="color:#d4d4d8;font-size:16px;line-height:1.7;">
                      ${content}
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding:24px 0 0;">
                    <p style="margin:0 0 8px;color:#71717a;font-size:13px;">
                      © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                    </p>
                    <p style="margin:0;color:#71717a;font-size:13px;">
                      Sent with 🖤 from the Eensell team.
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
  try {
    console.log("Fetching ACTIVE users...");
    const users = await db.user.findMany({
      where: {
        status: "ACTIVE"
      },
      select: {
        id: true,
        email: true,
        firstName: true
      }
    });

    console.log(`Found ${users.length} active users to notify.`);

    // Batch send emails (Resend allows up to 100 emails per batch)
    const BATCH_SIZE = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      console.log(`Sending batch ${i / BATCH_SIZE + 1} (${batch.length} users)...`);

      const { data, error } = await resend.batch.send(
        batch.map(user => {
          const name = user.firstName || "there";
          const title = "🚨 Live Starts in 30 Minutes! / اللايف غادي يبدا في 30 دقيقة";
          const subtitle = "Live Q&A Session";
          
          const content = `
            <p style="margin:0 0 16px;">Hi ${name},</p>
            <p style="margin:0 0 16px;">This is a quick reminder that our live session will begin in exactly <strong>30 minutes</strong>!</p>
            <p style="margin:0 0 16px;">Make sure you join us and stay for the <strong>Q&A part</strong> at the end. You'll be able to ask any questions you have and get them answered live by Saad.</p>
            
            <hr style="border:none;border-top:1px solid #27272a;margin:32px 0;" />
            
            <div dir="rtl" style="text-align:right;font-family:Tahoma,Arial,sans-serif;">
              <p style="margin:0 0 16px;">أهلاً بك ${name} 👋،</p>
              <p style="margin:0 0 16px;">تذكير سريع بلي اللايف ديالنا غادي يبدا من دابا <strong>30 دقيقة</strong>!</p>
              <p style="margin:0 0 16px;">حاولوا تحضروا وتبقاو حتى لفقرة <strong>الأسئلة والأجوبة (Q&A)</strong> في الأخير، حيت غادي نجاوبوا على ڭاع الأسئلة ديالكم مباشرة.</p>
              <p style="margin:0;">نشوفوك في اللايف! 🚀</p>
            </div>
          `;

          return {
            from: `Eensell University <${FROM_EMAIL}>`,
            to: user.email,
            subject: title,
            html: buildPremiumTemplate(title, subtitle, content)
          };
        })
      );

      if (error) {
        console.error("Error sending batch:", error);
        failed += batch.length;
      } else {
        sent += batch.length;
        console.log(`Successfully sent batch!`);
      }
    }

    console.log(`Broadcast complete! Successfully sent to ${sent} users. Failed: ${failed}`);
  } catch (error) {
    console.error("Fatal error running broadcast:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
