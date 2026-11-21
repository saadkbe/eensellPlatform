import * as dotenv from 'dotenv';
dotenv.config();

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";
const TARGET_EMAIL = "saadkbe1@gmail.com";

function buildEmailHtml(firstName: string) {
  return `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin:0;padding:0;background-color:#09090b;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#fafafa;-webkit-font-smoothing:antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#09090b;padding:40px 16px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;">
                
                <!-- Brand Header -->
                <tr>
                  <td align="center" style="padding-bottom: 24px;">
                    <span style="display:inline-block;padding:6px 14px;background-color:#18181b;border:1px solid #27272a;border-radius:20px;color:#a1a1aa;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                      Eensell University • Message Officiel
                    </span>
                  </td>
                </tr>

                <!-- Main Card -->
                <tr>
                  <td style="background-color:#18181b;border:1px solid #27272a;border-radius:20px;padding:44px 36px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.7);">
                    
                    <p style="margin:0 0 10px;color:#34d399;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">
                      ✦ Mise à Jour Majeure Plateforme
                    </p>

                    <h1 style="margin:0 0 24px;color:#ffffff;font-size:26px;font-weight:800;line-height:1.3;letter-spacing:-0.5px;">
                      Les Nouveaux Modules Sont En Ligne + Votre Cadeau Exclusif 🎁
                    </h1>

                    <div style="color:#d4d4d8;font-size:15px;line-height:1.75;">
                      <p style="margin:0 0 18px;">Salam <strong>${firstName}</strong>,</p>

                      <p style="margin:0 0 18px;">
                        Je prends directement mon clavier aujourd'hui pour vous écrire en toute franchise et transparence.
                      </p>

                      <p style="margin:0 0 18px;">
                        Ces dernières semaines ont été particulièrement exigeantes. Comme vous le savez, notre plateforme a fait face à des tentatives d'intrusion et des instabilités techniques qui ont ralenti notre calendrier initial. Plutôt que de publier des cours à la va-vite sur un système vulnérable, nous avons fait le choix responsable de <strong>reconstruire et blinder toute l'infrastructure de sécurité</strong>.
                      </p>

                      <p style="margin:0 0 24px;">
                        Je sais que certains d'entre vous ont trouvé l'attente longue. Votre exigence est tout à fait légitime, et je vous remercie sincèrement pour votre patience et votre confiance envers Eensell.
                      </p>

                      <!-- Section 1: Modules -->
                      <div style="background-color:#27272a/40;border:1px solid #3f3f46;border-radius:14px;padding:22px;margin:0 0 24px;">
                        <h3 style="margin:0 0 10px;color:#ffffff;font-size:16px;font-weight:700;display:flex;align-items:center;">
                          ✅ 1. Vos Nouveaux Modules Sont 100% En Ligne
                        </h3>
                        <p style="margin:0 0 12px;color:#a1a1aa;font-size:14px;">
                          L'ensemble des leçons promises est dès à présent disponible sur votre espace membre :
                        </p>
                        <ul style="margin:0;padding-left:20px;color:#e4e4e7;font-size:14px;line-height:1.8;">
                          <li><strong>Création d'Offre B2B Irrésistible</strong> (Tarification en MAD et stratégie de closing)</li>
                          <li><strong>Workflows Make.com & Automatisation Avancée</strong> (Blueprints .JSON prêts à l'import)</li>
                          <li><strong>Scraping B2B & Prospection WhatsApp</strong> (Scripts réels en Darija et closing)</li>
                        </ul>
                      </div>

                      <!-- Section 2: Gift -->
                      <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(245, 158, 11, 0.08) 100%);border:1px solid rgba(16, 185, 129, 0.3);border-radius:14px;padding:24px;margin:0 0 28px;">
                        <h3 style="margin:0 0 10px;color:#34d399;font-size:16px;font-weight:700;">
                          🎁 2. Mon Cadeau : 30 Jours d'Accès Gratuit à Eensell Workspace OS
                        </h3>
                        <p style="margin:0 0 12px;color:#d1d5db;font-size:14px;">
                          Pour vous dédommager de ce contretemps et récompenser les membres fondateurs de l'Université, <strong>j'ai personnellement crédité votre compte de 30 jours d'accès complet et gratuit à notre système d'exploitation d'agence : Eensell Workspace OS</strong> (valeur : 199 MAD/mois).
                        </p>
                        <ul style="margin:0;padding-left:20px;color:#f3f4f6;font-size:14px;line-height:1.8;">
                          <li><strong>Scraper Google Maps B2B :</strong> Extrayez des centaines de cliniques, agences et commerces dans votre ville avec leurs numéros WhatsApp directs.</li>
                          <li><strong>CRM d'Agence Marocain :</strong> Suivez vos deals, relances et contrats retainers.</li>
                          <li><strong>Studio WhatsApp & Cold Email :</strong> Scripts en Darija et français à fort taux de réponse.</li>
                          <li><strong>Facturation & Devis :</strong> Générez vos devis et factures conformes en Dirhams en 2 clics.</li>
                        </ul>
                      </div>

                      <!-- Button CTA -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px;">
                        <tr>
                          <td align="center">
                            <a href="https://eensell.com/dashboard" style="display:inline-block;background:linear-gradient(90deg, #10b981 0%, #059669 100%);color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:12px;font-weight:700;font-size:15px;box-shadow:0 10px 25px -5px rgba(16,185,129,0.4);">
                              Accéder à mes cours & mon Workspace OS &rarr;
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 8px;">
                        On ne lâche rien. Le marché de l'IA au Maroc est en pleine explosion, et les premières vraies agences se créent maintenant.
                      </p>

                      <p style="margin:0;color:#e4e4e7;">
                        Rendez-vous sur le dashboard pour attaquer les leçons du jour !
                      </p>
                    </div>

                    <div style="border-top:1px solid #27272a;margin-top:32px;padding-top:24px;">
                      <p style="margin:0;color:#ffffff;font-size:15px;font-weight:700;">Saad Kaabouche</p>
                      <p style="margin:2px 0 0;color:#a1a1aa;font-size:13px;">Fondateur, Eensell University & Agency</p>
                    </div>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding-top:32px;">
                    <p style="margin:0 0 6px;color:#71717a;font-size:12px;">
                      Envoyé avec précision par <strong>Eensell University</strong>
                    </p>
                    <p style="margin:0;color:#52525b;font-size:11px;">
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

async function sendPreview() {
  console.log(`Sending preview email to ${TARGET_EMAIL} from ${FROM_EMAIL}...`);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TARGET_EMAIL,
    subject: "[PREVIEW ADMIN] Les nouveaux modules sont en ligne + Votre cadeau de 30 jours 🎁",
    html: buildEmailHtml("Saad"),
  });

  if (error) {
    console.error("Resend send error:", error);
    process.exit(1);
  }

  console.log("SUCCESS! Preview email sent with ID:", data?.id);
}

sendPreview();
