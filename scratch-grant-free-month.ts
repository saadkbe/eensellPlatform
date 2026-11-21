import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL || "";
const adapter = new PrismaNeon({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Update all users who are ACTIVE so they get 30 days free from today
  const result = await db.user.updateMany({
    where: {
      status: "ACTIVE",
    },
    data: {
      workspaceExpiresAt: thirtyDaysFromNow,
    },
  });

  console.log(`Successfully granted 30-day free Workspace pass to ${result.count} active users.`);
  console.log(`Expiration date set to: ${thirtyDaysFromNow.toISOString()}`);
}

main()
  .catch((e) => {
    console.error("Error updating users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    process.exit(0);
  });
