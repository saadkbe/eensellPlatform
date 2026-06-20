import { sendLiveSessionScheduledEmail } from './src/actions/email.actions';
import * as dotenv from 'dotenv';
dotenv.config();

async function testLiveSessionEmail() {
  console.log("Sending Live Session Scheduled email test...");
  
  const recipients = [
    { email: 'saadkbe1@gmail.com', name: 'Saad' }
  ];

  const formattedDate = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const result = await sendLiveSessionScheduledEmail(
    recipients, 
    "Weekly Q&A and Portfolio Review", 
    formattedDate,
    "/dashboard/live-calls"
  );
  
  if (result.success) {
    console.log('Live Session email sent successfully!');
  } else {
    console.error('Error sending email:', result);
  }
}

testLiveSessionEmail();
