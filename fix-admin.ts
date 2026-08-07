import { db } from "./src/lib/db";
import { createClerkClient } from "@clerk/backend";
import "dotenv/config";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function fix() {
  const email = process.env.ADMIN_EMAIL || "saadkbe1@gmail.com";
  
  // 1. Fetch user from clerk by email
  const users = await clerk.users.getUserList({ emailAddress: [email] });
  if (users.data.length === 0) {
    console.log("No user found in Clerk with email", email);
    return;
  }
  
  const actualClerkId = users.data[0].id;
  console.log("Actual Clerk ID for admin:", actualClerkId);
  
  // 2. Update DB with this actual clerkId
  await db.user.updateMany({
    where: { email },
    data: { clerkId: actualClerkId, role: "ADMIN", status: "ACTIVE" }
  });
  
  console.log("Fixed DB admin record successfully!");
}

fix().catch(console.error);
