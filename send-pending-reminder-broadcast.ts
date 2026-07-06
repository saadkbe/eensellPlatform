import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";
import { Resend } from 'resend';
import { createClerkClient } from '@clerk/backend';

neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaNeon({ connectionString });
const db = new PrismaClient({ adapter });

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";
const APP_NAME = "Eensell University";

const whatsappUrl = "https://wa.me/212666065608?text=Bonjour%20Saad%2C%20voici%20mon%20re%C3%A7u%20de%20200%20DHS%20pour%20activer%20mon%20compte%20Eensell%20University.";
const pendingUrl = "https://eensell.com/pending";

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
    console.log("Fetching all users from database...");
    const allDbUsers = await db.user.findMany({
      select: { id: true, clerkId: true, email: true, firstName: true, status: true, role: true }
    });

    console.log(`Found ${allDbUsers.length} total database users.`);

    console.log("Fetching all users from Clerk to ensure absolute accuracy...");
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    const clerkUsers = await clerk.users.getUserList({ limit: 500 });
    const clerkUserMap = new Map(clerkUsers.data.map(u => [u.id, u]));

    const verifiedPendingUsers: { email: string; firstName: string | null }[] = [];
    let excludedActiveUsers = 0;

    for (const user of allDbUsers) {
      const cu = clerkUserMap.get(user.clerkId);
      const cuStatus = (cu?.publicMetadata as any)?.status;
      const cuRole = (cu?.publicMetadata as any)?.role;

      const isDbActive = user.status === 'ACTIVE' || user.role === 'ACTIVE_USER' || user.role === 'ADMIN';
      const isClerkActive = cuStatus === 'ACTIVE' || cuRole === 'ACTIVE_USER' || cuRole === 'ADMIN';
      const isAdminEmail = user.email === 'saadkbe1@gmail.com';

      if (user.status === 'PENDING' && user.role === 'PENDING_USER' && !isClerkActive && !isAdminEmail) {
        verifiedPendingUsers.push({ email: user.email, firstName: user.firstName });
      } else {
        excludedActiveUsers++;
      }
    }

    console.log(`\n--- FILTERING SUMMARY ---`);
    console.log(`Verified True Pending Users to receive email: ${verifiedPendingUsers.length}`);
    console.log(`Excluded Active/Admin Users: ${excludedActiveUsers}\n`);

    if (verifiedPendingUsers.length === 0) {
      console.log("No verified pending users found to send email to. Exiting.");
      return;
    }

    const BATCH_SIZE = 100;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < verifiedPendingUsers.length; i += BATCH_SIZE) {
      const batch = verifiedPendingUsers.slice(i, i + BATCH_SIZE);
      console.log(`Sending batch ${i / BATCH_SIZE + 1} (${batch.length} users)...`);

      const { data, error } = await resend.batch.send(
        batch.map((user) => {
          const name = user.firstName || "Entrepreneur";
          const title = `🚨 ${name}, l'offre à 200 DHS à vie passe à 499 DHS / mois (Dernier rappel)`;
          const subtitle = "ACCÈS À VIE 200 DHS — FERMETURE IMMINENTE";

          const content = `
            <p style="margin:0 0 16px;">Salut ${name} 👋,</p>
            <p style="margin:0 0 16px;">J'ai remarqué que tu as créé ton compte sur <strong>Eensell University</strong>, mais ton statut est toujours en attente de paiement.</p>
            <p style="margin:0 0 16px;">L'été avance vite. Pendant que certains hésitent encore, nos membres fondateurs sont déjà en train d'implémenter les systèmes pour <strong>lancer leur agence IA, automatiser leurs flux de travail et générer des revenus réels dès cet été</strong>. 🚀</p>
            <p style="margin:0 0 8px;">Tu es littéralement à un seul clic de débloquer :</p>
            <p style="margin:0 0 4px;">✅ <strong>Notre Masterclass et les modules vidéos complets</strong> pour dominer le marché de l'IA.</p>
            <p style="margin:0 0 4px;">✅ <strong>La bibliothèque de prompts privés et les workflows prêts à l'emploi</strong>.</p>
            <p style="margin:0 0 16px;">✅ <strong>L'accès direct à notre communauté privée</strong> et aux appels de coaching en direct.</p>
            
            <div style="background-color:#27272a;padding:22px;border-radius:14px;border:1px solid #3f3f46;margin:28px 0;">
              <p style="margin:0 0 12px;color:#ef4444;font-size:18px;font-weight:700;">🚨 IMPORTANT : L'offre d'accès à vie à 200 DHS disparaît pour toujours.</p>
              <p style="margin:0 0 12px;color:#fafafa;font-size:16px;">Tu as encore l'opportunité d'obtenir ton <strong>ACCÈS À VIE (Lifetime Access) pour SEULEMENT 200 DHS en un seul paiement</strong>.</p>
              <p style="margin:0;color:#d4d4d8;font-size:15px;">Dès la clôture de ce lot, la plateforme passera définitivement au tarif standard de <strong>499 DHS PAR MOIS (abonnement mensuel)</strong>. Ne paie pas 499 DHS chaque mois alors que tu peux sécuriser ton accès à vie aujourd'hui pour 200 DHS.</p>
            </div>
            
            <p style="margin:0 0 24px;">Ne manque pas l'opportunité de transformer ton été. <strong>Ton compte sera débloqué en moins de 60 secondes</strong> dès la réception du justificatif de ton virement (CIH Bank).</p>
            <p style="margin:0 0 24px;">👇 <strong>Accède à ta page d'attente ou envoie-nous directement ton reçu sur WhatsApp pour débloquer ton accès instantanément :</strong></p>
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 16px;">
              <tr>
                <td align="center">
                  <a href="${pendingUrl}" style="display:inline-block;width:80%;max-width:320px;text-align:center;background-color:#fafafa;color:#09090b;text-decoration:none;padding:16px 24px;border-radius:12px;font-weight:700;font-size:15px;box-shadow:0 10px 25px -5px rgba(255,255,255,0.2);">
                    ⚡ ACCÉDER À MA PAGE D'ATTENTE
                  </a>
                </td>
              </tr>
            </table>

            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 40px;">
              <tr>
                <td align="center">
                  <a href="${whatsappUrl}" style="display:inline-block;width:80%;max-width:320px;text-align:center;background-color:#25D366;color:#ffffff;text-decoration:none;padding:16px 24px;border-radius:12px;font-weight:700;font-size:15px;box-shadow:0 10px 25px -5px rgba(37,211,102,0.4);">
                    🟢 VALIDER SUR WHATSAPP 🟢
                  </a>
                </td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #27272a;margin:36px 0;" />

            <div dir="rtl" style="text-align:right;font-family:Tahoma,Arial,sans-serif;">
              <p style="margin:0 0 16px;">أهلاً بك ${name} 👋،</p>
              <p style="margin:0 0 16px;">لاحظت بلي فتحتي حساب ديالك في <strong>Eensell University</strong>، ولكن الحساب ديالك مازال معلق وماكملتيش الدفع!</p>
              <p style="margin:0 0 16px;">الصيف كيدوز بالزربة، وفي الوقت لي كاين لي مازال متردد ومضيع الوقت، الأعضاء المؤسسين ديالنا بداو خدامين كيبنيو <strong>وكالات الذكاء الاصطناعي (AI Agency) ديالهم، كيأتمتوا الخدمة، وكيدخلوا أرباح حقيقية هاد الصيف</strong>. 🚀</p>
              <p style="margin:0 0 8px;">راك بعيد غير بضغطة زر وحدة باش تفتح:</p>
              <p style="margin:0 0 4px;">✅ <strong>الدروس التطبيقية والشاملة</strong> في الذكاء الاصطناعي باش تسيطر على السوق.</p>
              <p style="margin:0 0 4px;">✅ <strong>مكتبة الأوامر (Prompts) الخاصة وخطط العمل الجاهزة للتطبيق</strong>.</p>
              <p style="margin:0 0 16px;">✅ <strong>الدخول المباشر للمجتمع الخاص (Community)</strong> وحصص التوجيه المباشرة (Live Calls).</p>
              
              <div style="background-color:#27272a;padding:22px;border-radius:14px;border:1px solid #3f3f46;margin:28px 0;">
                <p style="margin:0 0 12px;color:#ef4444;font-size:18px;font-weight:700;">🚨 هام جداً: عرض الدخول مدى الحياة بـ 200 درهم غادي يتلغى نهائياً.</p>
                <p style="margin:0 0 12px;color:#fafafa;font-size:16px;">مازالا عندك الفرصة باش تضمن <strong>الدخول مدى الحياة (Lifetime Access) دفعة واحدة بمبلغ 200 درهم فقط</strong>.</p>
                <p style="margin:0;color:#d4d4d8;font-size:15px;">مباشرة بعدما تسد هاد الدفعة، المنصة غادي ترجع للثمن الرسمي وهو <strong>499 درهم في الشهر (اشتراك شهري)</strong>. ماتخلصش 499 درهم كل شهر في الوقت لي تقدر تضمن دخولك مدى الحياة اليوم بـ 200 درهم فقط.</p>
              </div>
              
              <p style="margin:0 0 24px;">ماتزگلش هاد الفرصة باش تبدل حياتك هاد الصيف. <strong>الحساب ديالك غادي يتفعل في أقل من 60 ثانية</strong> مباشرة بعدما تصيفط لينا وصل الدفع (CIH Bank).</p>
              <p style="margin:0 0 24px;">👇 <strong>دخل لصفحة الانتظار ديالك أو صيفط لينا وصل الدفع في الواتساب باش تفعل حسابك فوراً:</strong></p>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 16px;">
                <tr>
                  <td align="center">
                    <a href="${pendingUrl}" style="display:inline-block;width:80%;max-width:320px;text-align:center;background-color:#fafafa;color:#09090b;text-decoration:none;padding:16px 24px;border-radius:12px;font-weight:700;font-size:15px;box-shadow:0 10px 25px -5px rgba(255,255,255,0.2);">
                      ⚡ الدخول لصفحة الانتظار
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${whatsappUrl}" style="display:inline-block;width:80%;max-width:320px;text-align:center;background-color:#25D366;color:#ffffff;text-decoration:none;padding:16px 24px;border-radius:12px;font-weight:700;font-size:15px;box-shadow:0 10px 25px -5px rgba(37,211,102,0.4);">
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
