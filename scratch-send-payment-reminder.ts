import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually as fallback
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/^"|"$/g, '');
      } else if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
        value = value.replace(/^'|'$/g, '');
      }
      process.env[key] = value;
    }
  });
}

dotenv.config();

async function main() {
  const { db } = await import('./src/lib/db');
  const { sendBroadcastEmail } = await import('./src/actions/email.actions');

  console.log("Fetching pending users...");
  const pendingUsers = await db.user.findMany({
    where: {
      status: 'PENDING'
    },
    select: {
      email: true,
      firstName: true
    }
  });

  console.log(`Found ${pendingUsers.length} pending users.`);

  if (pendingUsers.length === 0) {
    console.log("No pending users found. Exiting.");
    return;
  }

  const emails = pendingUsers.map(u => u.email);
  // Optional: slice emails to testing count if needed, but the user wants all 127
  
  const subject = "Final Step: Complete Your Registration for Eensell University 🚀";
  const content = `
    <p style="margin:0 0 16px;">Hi there,</p>
    <p style="margin:0 0 16px;">We noticed you have a pending account in our system. You're just one step away from unlocking full access to Eensell University!</p>
    <p style="margin:0 0 16px;">To get approved and join us on our <strong>first live call this Wednesday</strong>, please complete your one-time payment of <strong>200 MAD</strong>.</p>
    <div style="background-color:#27272a;padding:20px;border-radius:8px;margin-bottom:16px;">
      <p style="margin:0 0 8px;"><strong>How to pay:</strong></p>
      <p style="margin:0;">Contact us on WhatsApp at <strong><a href="https://wa.me/212666065608" style="color:#ffffff;text-decoration:underline;">0666065608</a></strong> to get the payment details.</p>
    </div>
    <p style="margin:0 0 16px;">Once you pay, your account will be immediately approved. Remember, this is a <strong>one-time only payment</strong>, and this exclusive offer ends in exactly <strong>two days</strong>.</p>
    <p style="margin:0;">Don't miss out on this opportunity. We look forward to seeing you on the inside!</p>
  `;

  console.log("Sending emails...");
  const result = await sendBroadcastEmail(emails, subject, content);

  console.log("Email sending result:", result);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
