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
  const byStatus = await db.user.groupBy({
    by: ['status', 'role', 'tier'],
    _count: { id: true },
  });
  console.log('Groupings:', JSON.stringify(byStatus, null, 2));

  // Check date ranges for active users
  const activeUsers = await db.user.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, email: true, createdAt: true, role: true, tier: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Total ACTIVE users in DB: ${activeUsers.length}`);
  if (activeUsers.length > 0) {
    console.log('Earliest active user:', activeUsers[0].createdAt, activeUsers[0].email);
    console.log('Latest active user:', activeUsers[activeUsers.length - 1].createdAt, activeUsers[activeUsers.length - 1].email);
  }

  // How many joined from June to September 2026?
  // Or June 1 to September 30?
  const juneStart = new Date('2026-06-01T00:00:00Z');
  const septEnd = new Date('2026-10-01T00:00:00Z');

  const juneSept = activeUsers.filter(u => u.createdAt >= juneStart && u.createdAt < septEnd);
  console.log(`Active users from June to Sept: ${juneSept.length}`);

  // Let's also check by months
  const monthlyCount: Record<string, number> = {};
  for (const u of activeUsers) {
    const m = u.createdAt.toISOString().substring(0, 7);
    monthlyCount[m] = (monthlyCount[m] || 0) + 1;
  }
  console.log('Monthly distribution of active users:', monthlyCount);
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
