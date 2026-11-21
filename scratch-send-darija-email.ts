import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";
const TARGET_EMAIL = "saadkbe1@gmail.com";

const logoBuffer = fs.readFileSync('public/eensell-university-white.png');

function buildDarijaEmailHtml(firstName: string) {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ar" dir="rtl">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>رسالة خاصة من سعد قعبوش</title>
    <style type="text/css">
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      body { margin: 0; padding: 0; width: 100% !important; background-color: #0A0B10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Arial, sans-serif; }
      
      @media only screen and (max-width: 600px) {
        .email-wrapper { padding: 12px 6px !important; }
        .email-card { padding: 24px 16px !important; border-radius: 16px !important; }
        .inner-box { padding: 16px 14px !important; margin: 16px 0 !important; }
        .h1-title { font-size: 21px !important; line-height: 1.4 !important; }
        .body-text { font-size: 15px !important; line-height: 1.8 !important; }
        .cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; text-align: center !important; padding: 15px 16px !important; font-size: 15px !important; }
        .logo-img { width: 210px !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0A0B10; color: #FFFFFF;" dir="rtl">
    <!-- Wrapper -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper" style="background-color: #0A0B10; padding: 32px 10px;" dir="rtl">
      <tr>
        <td align="center">
          <!-- Main 600px Container -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; width: 100%; text-align: right;" dir="rtl">
            
            <!-- ── Eensell University Logo (Bigger & Crisp) ── -->
            <tr>
              <td align="center" style="padding: 0 0 24px 0;">
                <a href="https://eensell.com" target="_blank" style="text-decoration: none; display: inline-block;">
                  <img 
                    src="cid:eensell-logo" 
                    alt="Eensell University" 
                    width="230" 
                    class="logo-img" 
                    style="display: block; width: 230px; max-width: 230px; height: auto;" 
                  />
                </a>
              </td>
            </tr>

            <!-- ── Main Card ── -->
            <tr>
              <td class="email-card" style="background-color: #12141F; border: 1px solid #1F2436; border-radius: 20px; padding: 36px 28px; box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.75); text-align: right;">
                
                <!-- Badge -->
                <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;" dir="rtl">
                  <tr>
                    <td style="background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 20px; padding: 5px 14px; color: #34D399; font-size: 11px; font-weight: 700;">
                      ✦ رسالة مباشرة من القلب لكل أعضاء الجامعة
                    </td>
                  </tr>
                </table>

                <!-- Main Title -->
                <h1 class="h1-title" style="margin: 0 0 20px 0; color: #FFFFFF; font-size: 23px; font-weight: 800; line-height: 1.42; letter-spacing: -0.3px;">
                  الدروس الجديدة كاملة تلونصات اليوم <br />+ هدية 30 يوم فابور فـ Workspace OS 🎁
                </h1>

                <!-- Body Text -->
                <div class="body-text" style="color: #D1D5DB; font-size: 15px; line-height: 1.82; margin: 0 0 24px 0;">
                  <p style="margin: 0 0 16px 0;">السلام عليكم <strong>${firstName}</strong>،</p>

                  <p style="margin: 0 0 16px 0;">
                    كانكتب ليك هذا الإيميل اليوم مباشرة وبكل شفافية وصراحة من خوكم سعد.
                  </p>

                  <p style="margin: 0 0 16px 0;">
                    السيمانات اللخرة كانت صعيبة بزاف من الناحية التقنية. المنصة واجهات محاولات اختراق وضغط تقني كبير اللي خلانا نوقفو الخدمة باش نأمّنو السيستيم مزيان. كان بإمكاني نسجل فيديوهات بالزربة ونحطهم، ولكن فضلت نبنيو ونأمّنو السيرفورات والبنية التحتية من الصفر باش تكون حاجة احترافية كادوم.
                  </p>

                  <p style="margin: 0 0 20px 0;">
                    كنتفهّم بزاف الناس اللي تقلقو ولا جاهم التعطال طويل. الحق كامل عندكم، وكنشكركم من القلب حيت صبرتو وثقتو في المشروع ديالنا.
                  </p>

                  <!-- ── Block 1: Modules ── -->
                  <div class="inner-box" style="background-color: #171A27; border: 1px solid #262B3F; border-radius: 14px; padding: 18px 16px; margin: 0 0 20px 0; text-align: right;">
                    <div style="color: #FFFFFF; font-size: 15px; font-weight: 700; margin-bottom: 8px;">
                      ✅ 1. جميع الدروس اللي وعدتكم بيهم تحطو فـ Dashboard
                    </div>
                    <p style="margin: 0 0 10px 0; color: #9CA3AF; font-size: 13.5px;">
                      تقدر دابا تدخل وتتفرج فجميع الوحدات الجديدة بالتفصيل التطبيقي:
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #E5E7EB; font-size: 13.5px; line-height: 1.7;" dir="rtl">
                      <tr>
                        <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #10B981;">•</td>
                        <td style="padding: 4px 0;"><strong style="color: #FFFFFF;">بناء عروض B2B قوية :</strong> كيفاش تحدد الأثمنة بالدرهم وتسد أول Retainer شهري.</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #10B981;">•</td>
                        <td style="padding: 4px 0;"><strong style="color: #FFFFFF;">سيناريوهات Make.com جاهزة :</strong> Blueprints .JSON تيليشارجيها بنقرة وحدة.</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; vertical-align: top; width: 18px; color: #10B981;">•</td>
                        <td style="padding: 4px 0;"><strong style="color: #FFFFFF;">استخراج العملاء والتواصل بالدارجة :</strong> نصوص وإيميلات مجربة كاتجيب أعلى نسبة رد.</td>
                      </tr>
                    </table>
                  </div>

                  <!-- ── Block 2: 30 Days Free ── -->
                  <div class="inner-box" style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 14px; padding: 20px 16px; margin: 0 0 24px 0; text-align: right;">
                    <div style="color: #34D399; font-size: 15px; font-weight: 700; margin-bottom: 8px;">
                      🎁 2. الهدية ديالي ليك: 30 يوم فابور فـ Eensell Workspace OS
                    </div>
                    <p style="margin: 0 0 12px 0; color: #D1D5DB; font-size: 13.5px; line-height: 1.7;">
                      باش نعوّضكم على هاد التعطال ونشكركم، <strong>فعّلت ليك شخصياً 30 يوم فابور فـ لوحة تحكم الوكالة Eensell Workspace OS</strong> (اللي الثمن ديالها العادي 199 درهم/شهر).
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #E5E7EB; font-size: 13px; line-height: 1.7;" dir="rtl">
                      <tr>
                        <td style="padding: 3px 0; vertical-align: top; width: 18px; color: #F59E0B;">✦</td>
                        <td style="padding: 3px 0;"><strong>مستخرج خرائط جوجل :</strong> استخرج عيادات وشركات فكازا، الرباط ومراكش مع أرقام الواتساب المباشرة.</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; vertical-align: top; width: 18px; color: #F59E0B;">✦</td>
                        <td style="padding: 3px 0;"><strong>نظام CRM وفواتير بالدرهم :</strong> صاوب Devis و Facture احترافية فـ دقيقة وحدة.</td>
                      </tr>
                      <tr>
                        <td style="padding: 3px 0; vertical-align: top; width: 18px; color: #F59E0B;">✦</td>
                        <td style="padding: 3px 0;"><strong>استوديو الواتساب والبريد :</strong> حملات تواصل مباشرة بالدارجة والفرنسية.</td>
                      </tr>
                    </table>
                  </div>

                  <!-- ── CTA Button ── -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0 20px 0;">
                    <tr>
                      <td align="center">
                        <a href="https://eensell.com/dashboard" target="_blank" class="cta-btn" style="background: linear-gradient(90deg, #10B981 0%, #059669 100%); color: #FFFFFF; text-decoration: none; padding: 15px 36px; border-radius: 12px; font-weight: 700; font-size: 15px; display: inline-block; box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.45); letter-spacing: 0.2px;">
                          دخول للدروس ومساحة العمل الآن &larr;
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 20px 0 8px 0; font-size: 14.5px;">
                    السوق ديال الذكاء الاصطناعي فالمغرب يالاه كيبدا دابا، والفرصة كاينة للناس اللي كيطبقو.
                  </p>

                  <p style="margin: 0; color: #FFFFFF; font-size: 14.5px; font-weight: 700;">
                    نتلاقاو فـ Dashboard وبداو التطبيق من اليوم !
                  </p>
                </div>

                <!-- ── Signature ── -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #1F2436; padding-top: 20px; margin-top: 24px;" dir="rtl">
                  <tr>
                    <td align="right">
                      <p style="margin: 0; color: #FFFFFF; font-size: 15px; font-weight: 700;">خوكم سعد قعبوش</p>
                      <p style="margin: 2px 0 0 0; color: #9CA3AF; font-size: 12.5px;">مؤسس Eensell University & Agency</p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- ── Footer ── -->
            <tr>
              <td align="center" style="padding: 24px 10px 0 10px;">
                <p style="margin: 0 0 4px 0; color: #6B7280; font-size: 11.5px;">
                  مرسل بكل عناية من فريق <strong>Eensell University</strong>
                </p>
                <p style="margin: 0; color: #4B5563; font-size: 11px;">
                  © 2026 Eensell Agency. الدار البيضاء، المغرب. جميع الحقوق محفوظة.
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

async function sendDarijaPreview() {
  console.log(`Sending Darija preview email with large Eensell University logo to ${TARGET_EMAIL}...`);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TARGET_EMAIL,
    subject: "الدروس الجديدة كاملة تلونصات اليوم + هدية 30 يوم فابور فـ Workspace OS 🎁",
    html: buildDarijaEmailHtml("سعد"),
    attachments: [
      {
        filename: "eensell-university-logo.png",
        content: logoBuffer,
      } as any,
    ],
  });

  if (error) {
    console.error("Resend error:", error);
    process.exit(1);
  }

  console.log("SUCCESS! Darija preview sent with ID:", data?.id);
}

sendDarijaPreview();
