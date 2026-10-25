import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env') });

import { Resend } from 'resend';
import { subDays } from 'date-fns';

async function main() {
  const { db } = await import('../src/lib/db');
  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";

  const oneWeekAgo = subDays(new Date(), 7);

  const pendingUsers = await db.user.findMany({
    where: {
      status: "PENDING",
      createdAt: { gte: oneWeekAgo },
    },
    select: {
      email: true,
      firstName: true,
    }
  });

  console.log(`Found ${pendingUsers.length} pending users from the last week.`);

  if (pendingUsers.length === 0) {
    console.log("No pending users found. Exiting.");
    return;
  }

  const BATCH_SIZE = 100;
  let sent = 0;

  for (let i = 0; i < pendingUsers.length; i += BATCH_SIZE) {
    const batch = pendingUsers.slice(i, i + BATCH_SIZE);
    
    const { data, error } = await resend.batch.send(
      batch.map((user) => {
        const name = user.firstName || "عضو";
        return {
          from: `Eensell University <${FROM_EMAIL}>`,
          to: user.email,
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
        };
      })
    );

    if (error) {
      console.error("Batch send error:", error);
    } else {
      sent += batch.length;
      console.log(`Sent batch of ${batch.length}, total sent: ${sent}`);
    }
  }
}

main().catch(console.error).finally(() => db.$disconnect());
