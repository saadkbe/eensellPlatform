import { Resend } from "resend";
import * as dotenv from "dotenv";
import { render } from "@react-email/components";
import { PendingFollowUpEmail } from "./src/emails/PendingFollowUpEmail";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@eensell.com";

async function main() {
  const toEmail = "saadkbe1@gmail.com";
  
  console.log(`Sending test email to ${toEmail}...`);
  
  try {
    const { data, error } = await resend.emails.send({
      from: `Eensell University <${FROM_EMAIL}>`,
      to: toEmail,
      subject: "Ne payez pas 599 MAD pour ça... (ouvrez immédiatement) ⏳",
      react: PendingFollowUpEmail({
        userName: "Saad",
        remainingSpots: 12,
      }),
    });

    if (error) {
      console.error("Failed to send:", error);
    } else {
      console.log("Successfully sent test email!", data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
