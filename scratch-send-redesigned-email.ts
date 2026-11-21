import * as dotenv from 'dotenv';
dotenv.config();

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";
const TARGET_EMAIL = "saadkbe1@gmail.com";

function buildModernEmailHtml(firstName: string) {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Mise à jour Eensell University</title>
    <style type="text/css">
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
      body { margin: 0; padding: 0; width: 100% !important; background-color: #0B0C10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
      
      @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 12px 6px !important; }
        .email-card { padding: 24px 16px !important; border-radius: 16px !important; }
        .inner-box { padding: 16px 12px !important; margin: 16px 0 !important; }
        .h1-title { font-size: 21px !important; line-height: 1.35 !important; }
        .body-text { font-size: 14.5px !important; line-height: 1.65 !important; }
        .cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; padding: 15px 16px !important; font-size: 15px !important; }
        .logo-img { width: 140px !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0B0C10; color: #FFFFFF;">
    <!-- Background Wrapper -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color: #0B0C10; padding: 32px 12px;">
      <tr>
        <td align="center">
          <!-- Main Container (Broad 600px) -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; width: 100%;">
            
            <!-- ── Top Brand Header with Logo ── -->
            <tr>
              <td align="center" style="padding: 0 0 20px 0;">
                <a href="https://eensell.com" target="_blank" style="text-decoration: none; display: inline-block;">
                  <img src="https://eensell.com/workspace-logo-white.png" alt="Eensell University" width="165" class="logo-img" style="display: block; width: 165px; max-width: 165px; height: auto;" />
                </a>
              </td>
            </tr>

            <!-- ── Main Executive Card ── -->
            <tr>
              <td class="email-card" style="background-color: #12141D; border: 1px solid #1E2232; border-radius: 20px; padding: 36px 30px; box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.65);">
                
                <!-- Category Badge -->
                <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                  <tr>
                    <td style="background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 20px; padding: 4px 12px; color: #34D399; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                      ✦ MISE À JOUR OFFICIELLE PLATEFORME
                    </td>
                  </tr>
                </table>

                <!-- Main Title -->
                <h1 class="h1-title" style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 24px; font-weight: 800; line-height: 1.35; letter-spacing: -0.4px;">
                  Les Nouveaux Modules Sont En Ligne <br />+ Votre Cadeau Exclusif 🎁
                </h1>

                <!-- Body Text -->
                <div class="body-text" style="color: #D1D5DB; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                  <p style="margin: 0 0 16px 0;">Salam <strong style="color: #FFFFFF;">${firstName}</strong>,</p>

                  <p style="margin: 0 0 16px 0;">
                    Je prends directement mon clavier aujourd'hui pour vous écrire en toute franchise et transparence.
                  </p>

                  <p style="margin: 0 0 16px 0;">
                    Ces dernières semaines ont été particulièrement exigeantes. Comme vous le savez, notre plateforme a fait face à des tentatives d'intrusion et des instabilités techniques qui ont ralenti notre calendrier initial. Plutôt que de publier des cours à la va-vite sur un système vulnérable, nous avons fait le choix responsable de <strong>reconstruire et blinder toute l'infrastructure de sécurité</strong>.
                  </p>

                  <p style="margin: 0 0 20px 0;">
                    Je sais que certains d'entre vous ont trouvé l'attente longue. Votre exigence est tout à fait légitime, et je vous remercie sincèrement pour votre patience et votre confiance envers Eensell.
                  </p>

                  <!-- ── Block 1: Modules Débloqués ── -->
                  <div class="inner-box" style="background-color: #181B26; border: 1px solid #272C3D; border-radius: 14px; padding: 18px 16px; margin: 0 0 20px 0;">
                    <div style="color: #FFFFFF; font-size: 15px; font-weight: 700; margin-bottom: 8px;">
                      ✅ 1. Vos Nouveaux Modules Sont 100% En Ligne
                    </div>
                    <p style="margin: 0 0 10px 0; color: #9CA3AF; font-size: 13.5px;">
                      L'ensemble des leçons promises est disponible sur votre espace membre :
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #E5E7EB; font-size: 13.5px; line-height: 1.6;">
                      <tr>
                        <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #10B981;">•</td>
                        <td style="padding: 4px 0;"><strong style="color: #FFFFFF;">Offre B2B Irrésistible :</strong> Tarification en MAD & closing terrain.</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #10B981;">•</td>
                        <td style="padding: 4px 0;"><strong style="color: #FFFFFF;">Workflows Make.com :</strong> Blueprints .JSON prêts à l'import en 1 clic.</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #10B981;">•</td>
                        <td style="padding: 4px 0;"><strong style="color: #FFFFFF;">Scraping & Prospection :</strong> Scripts réels en Darija & templates éprouvés.</td>
                      </tr>
                    </table>
                  </div>

                  <!-- ── Block 2: 30 Days Free Gift ── -->
                  <div class="inner-box" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 14px; padding: 20px 16px; margin: 0 0 24px 0;">
                    <div style="color: #34D399; font-size: 15px; font-weight: 700; margin-bottom: 8px;">
                      🎁 2. Mon Cadeau : 30 Jours Gratuits sur Eensell Workspace OS
                    </div>
                    <p style="margin: 0 0 12px 0; color: #D1D5DB; font-size: 13.5px; line-height: 1.6;">
                      Pour récompenser votre fidélité, <strong>votre compte a été crédité de 30 jours d'accès complet et gratuit à notre logiciel interne Eensell Workspace OS</strong> (valeur : 199 MAD/mois).
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #E5E7EB; font-size: 13px; line-height: 1.6;">
                      <tr>
                        <td style="padding: 3px 0; vertical-align: top; width: 18px; color: #F59E0B;">✦</td>
                        <td style="padding: 3px 0;"><strong>Scraper Google Maps :</strong> Extrayez des centaines de cliniques, agences et commerces au Maroc avec numéros WhatsApp.</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; vertical-align: top; width: 18px; color: #F59E0B;">✦</td>
                        <td style="padding: 3px 0;"><strong>CRM & Devis Marocains :</strong> Pipeline de deals et devis/factures en Dirhams en 2 clics.</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; vertical-align: top; width: 18px; color: #F59E0B;">✦</td>
                        <td style="padding: 3px 0;"><strong>Studio WhatsApp & Cold Email :</strong> Scripts IA prêts à envoyer.</td>
                      </tr>
                    </table>
                  </div>

                  <!-- ── CTA Button ── -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://eensell.com/dashboard" target="_blank" class="cta-btn" style="background: linear-gradient(90deg, #10B981 0%, #059669 100%); color: #FFFFFF; text-decoration: none; padding: 15px 36px; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.45); letter-spacing: 0.2px;">
                          Accéder à mes cours & mon Workspace OS &rarr;
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 8px 0; font-size: 14.5px;">
                    On ne lâche rien. Le marché de l'IA au Maroc est en pleine explosion, et les premières vraies agences se créent maintenant.
                  </p>

                  <p style="margin: 0; color: #FFFFFF; font-size: 14.5px; font-weight: 600;">
                    Rendez-vous sur le dashboard pour attaquer les leçons du jour !
                  </p>
                </div>

                <!-- ── Signature ── -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #1E2232; padding-top: 20px; margin-top: 24px;">
                  <tr>
                    <td>
                      <p style="margin: 0; color: #FFFFFF; font-size: 15px; font-weight: 700;">Saad Kaabouche</p>
                      <p style="margin: 2px 0 0 0; color: #9CA3AF; font-size: 12.5px;">Fondateur, Eensell University & Agency</p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- ── Footer ── -->
            <tr>
              <td align="center" style="padding: 24px 10px 0 10px;">
                <p style="margin: 0 0 4px 0; color: #6B7280; font-size: 11.5px;">
                  Envoyé avec précision par <strong>Eensell University</strong>
                </p>
                <p style="margin: 0; color: #4B5563; font-size: 11px;">
                  © ${new Date().getFullYear()} Eensell Agency. Casablanca, Maroc. Tous droits réservés.
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

async function sendUpdatedPreview() {
  console.log(`Sending redesigned preview email to ${TARGET_EMAIL}...`);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TARGET_EMAIL,
    subject: "[PREVIEW V2] Les nouveaux modules sont en ligne + Votre cadeau de 30 jours 🎁",
    html: buildModernEmailHtml("Saad"),
  });

  if (error) {
    console.error("Resend error:", error);
    process.exit(1);
  }

  console.log("SUCCESS! Redesigned preview sent with ID:", data?.id);
}

sendUpdatedPreview();
