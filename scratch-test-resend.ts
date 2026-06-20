import { Resend } from 'resend';
import * as dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log("Sending email from:", process.env.RESEND_FROM_EMAIL);
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'noreply@eensell.com',
    to: process.env.ADMIN_EMAIL || 'saadkbe1@gmail.com',
    subject: 'Resend Verification Successful! 🎉',
    html: '<p>If you are reading this, your Resend configuration is working perfectly with your newly verified domain <strong>eensell.com</strong>.</p>'
  });

  if (error) {
    console.error('Error sending email:', error);
  } else {
    console.log('Email sent successfully! ID:', data?.id);
  }
}

testEmail();
