import { createClerkClient } from "@clerk/backend";
import "dotenv/config";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function check() {
  const user = await clerk.users.getUser("user_3EV5JMmeYQEEf0uoH2nrA4yQ4sD");
  console.log("Admin user:", user.emailAddresses.map((e) => e.emailAddress));
}
check();




