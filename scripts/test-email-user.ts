import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env') });

import { Resend } from 'resend';

async function main() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";

  const name = "Saad"; // Test name
  
  const { data, error } = await resend.emails.send({
    from: `Eensell University <${FROM_EMAIL}>`,
    to: "saadyoulife@gmail.com",
    subject: "خطوة واحدة تفصلك عن الانضمام! السعر سيرتفع قريباً ⏳",
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>مرحباً ${name}،</h2>
        <p>لقد لاحظنا أنك قمت بإنشاء حسابك معنا في الأسبوع الماضي، ولم يتبق لك سوى خطوة واحدة لإكمال عملية التسجيل وفتح جميع مزايا العضوية.</p>
        <p>نود تذكيرك بأن السعر سيرتفع من <strong>200 درهم</strong> إلى <strong>799 درهم</strong> ابتداءً من بعد غد!</p>
        <p>لا تفوت هذه الفرصة، أكمل تسجيلك الآن واستفد من السعر الحالي قبل فوات الأوان.</p>
        <p style="margin-top: 20px;">
          <a href="https://university.eensell.com/pending" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">أكمل حسابك الآن</a>
        </p>
        <p>إذا كان لديك أي أسئلة، فلا تتردد في الرد على هذا البريد الإلكتروني.</p>
        <p>مع تحيات،<br>فريق Eensell University</p>
      </div>
    `
  });

  if (error) {
    console.error("Error sending test email:", error);
  } else {
    console.log("Test email sent successfully to saadyoulife@gmail.com!");
  }
}

main().catch(console.error);
