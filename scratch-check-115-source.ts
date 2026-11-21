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
  // Let's check users by role
  const roles = await db.user.groupBy({
    by: ['role'],
    _count: { id: true }
  });
  console.log('Roles:', roles);

  // Let's check how many total users in database
  const total = await db.user.count();
  console.log('Total users in DB:', total);

  // Check campaigns snapshots
  const campaigns = await db.campaign.findMany({
    include: { snapshots: true }
  });
  console.log('Campaigns:', JSON.stringify(campaigns, null, 2));
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
