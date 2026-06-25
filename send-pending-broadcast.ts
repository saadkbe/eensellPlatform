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

const whatsappUrl = "https://wa.me/212666065608?text=Bonjour%20Saad%2C%20voici%20mon%20re%C3%A7u%20de%20200%20DHS%20pour%20activer%20mon%20compte%20Eensell%20University.";

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
                  <td align="center" style="padding-top:32px;">
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

async function sendPendingBroadcast() {
  try {
    console.log("Fetching users with PENDING status...");
    const pendingUsers = await db.user.findMany({
      where: { status: "PENDING" },
      select: { email: true, firstName: true }
    });

    console.log(`Found ${pendingUsers.length} pending users.`);

    if (pendingUsers.length === 0) {
      console.log("No pending users found to send email to.");
      return;
    }

    const BATCH_SIZE = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < pendingUsers.length; i += BATCH_SIZE) {
      const batch = pendingUsers.slice(i, i + BATCH_SIZE);
      console.log(`Sending batch ${i / BATCH_SIZE + 1} (${batch.length} users)...`);

      const { data, error } = await resend.batch.send(
        batch.map((user) => {
          const name = user.firstName || "Entrepreneur";
          const title = `⚡ ${name}, ton compte Eensell University va être supprimé... (Dernière chance)`;
          const subtitle = "Offre Fondatrice - Clôture Imminente";

          const content = `
            <p style="margin:0 0 16px;">Salut ${name} 👋,</p>
            <p style="margin:0 0 16px;">J'ai remarqué que tu as créé ton compte sur <strong>Eensell University</strong>, mais que ton statut est toujours en attente d'activation.</p>
            <p style="margin:0 0 16px;">L'été vient tout juste de commencer. Pendant que certains hésitent encore, nos membres fondateurs sont déjà en train d'implémenter les systèmes pour <strong>lancer leur agence IA, automatiser leurs flux de travail et générer des revenus réels dès cet été</strong>. 🚀</p>
            <p style="margin:0 0 8px;">Tu es littéralement à un seul clic de débloquer :</p>
            <p style="margin:0 0 4px;">✅ <strong>Notre Masterclass et les modules vidéos complets</strong> pour dominer le marché de l'IA.</p>
            <p style="margin:0 0 4px;">✅ <strong>La bibliothèque de prompts privés et les workflows prêts à l'emploi</strong>.</p>
            <p style="margin:0 0 16px;">✅ <strong>L'accès direct à notre communauté privée</strong> et aux appels de coaching en direct.</p>
            <div style="background-color:#27272a;padding:20px;border-radius:12px;margin:24px 0;">
              <p style="margin:0 0 12px;color:#ef4444;font-weight:700;">🚨 ATTENTION : L'offre fondatrice est sur le point de disparaître.</p>
              <p style="margin:0;">Tu as encore l'opportunité d'obtenir ton <strong>accès à vie pour SEULEMENT 200 DHS</strong> au lieu du futur abonnement mensuel. Mais il ne reste plus que <strong>quelques places dans ce lot final</strong> avant la fermeture définitive de cette offre.</p>
            </div>
            <p style="margin:0 0 24px;">Ne manque pas l'opportunité de transformer ton été. <strong>Ton compte sera débloqué en moins de 60 secondes</strong> dès la réception du justificatif de ton virement (CIH Bank).</p>
            <p style="margin:0 0 24px;">👇 <strong>Clique sur le bouton ci-dessous, envoie-nous ton reçu sur WhatsApp, et accède instantanément à la plateforme :</strong></p>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 40px;">
              <tr>
                <td align="center">
                  <a href="${whatsappUrl}" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 10px 25px -5px rgba(37,211,102,0.4);">
                    🟢 ACTIVER MON COMPTE SUR WHATSAPP 🟢
                  </a>
                </td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #27272a;margin:32px 0;" />
            <div dir="rtl" style="text-align:right;font-family:Tahoma,Arial,sans-serif;">
              <p style="margin:0 0 16px;">أهلاً بك ${name} 👋،</p>
              <p style="margin:0 0 16px;">لاحظت بلي فتحتي حساب ديالك في <strong>Eensell University</strong>، ولكن الحساب ديالك مازال معلق وماكملتيش التفعيل!</p>
              <p style="margin:0 0 16px;">الصيف عاد بدا، وفي الوقت لي كاين لي مازال متردد ومضيع الوقت، الأعضاء المؤسسين ديالنا بداو خدامين كيبنيو <strong>وكالات الذكاء الاصطناعي (AI Agency) ديالهم، كيأتمتوا الخدمة، وكيدخلوا أرباح حقيقية هاد الصيف</strong>. 🚀</p>
              <p style="margin:0 0 8px;">راك بعيد غير بضغطة زر وحدة باش تفتح:</p>
              <p style="margin:0 0 4px;">✅ <strong>الدروس التطبيقية والشاملة</strong> في الذكاء الاصطناعي باش تسيطر على السوق.</p>
              <p style="margin:0 0 4px;">✅ <strong>مكتبة الأوامر (Prompts) الخاصة وخطط العمل الجاهزة للتطبيق</strong>.</p>
              <p style="margin:0 0 16px;">✅ <strong>الدخول المباشر للمجتمع الخاص (Community)</strong> وحصص التوجيه المباشرة (Live Calls).</p>
              <div style="background-color:#27272a;padding:20px;border-radius:12px;margin:24px 0;">
                <p style="margin:0 0 12px;color:#ef4444;font-weight:700;">🚨 عاجل: العرض التأسيسي غادي يتسد في أي لحظة.</p>
                <p style="margin:0;">مازالا عندك الفرصة باش تضمن <strong>الدخول مدى الحياة (Lifetime Access) بمبلغ 200 درهم فقط</strong> في بلاصة الاشتراك الشهري. ولكن بقاو <strong>غير مقاعد قليلة في الدفعة الأخيرة</strong> قبل ما يتسد هاد العرض بصفة نهائية.</p>
              </div>
              <p style="margin:0 0 24px;">ماتزگلش هاد الفرصة باش تبدل حياتك هاد الصيف. <strong>الحساب ديالك غادي يتفعل في أقل من 60 ثانية</strong> مباشرة بعدما تصيفط لينا وصل الدفع (CIH Bank).</p>
              <p style="margin:0 0 24px;">👇 <strong>كليكي على الزر لي لتحت، صيفط لينا وصل الدفع في الواتساب، ودخل فوراً للمنصة:</strong></p>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${whatsappUrl}" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:700;font-size:16px;box-shadow:0 10px 25px -5px rgba(37,211,102,0.4);">
                      🟢 تفعيل حسابي عبر الواتساب 🟢
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;">نشوفوك في المنصة! 🚀</p>
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
  }
}

sendPendingBroadcast();
