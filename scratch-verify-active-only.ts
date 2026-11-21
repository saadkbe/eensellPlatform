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

async function verify() {
  // 1. Check all users who have workspaceExpiresAt set
  const usersWithPass = await db.user.findMany({
    where: {
      workspaceExpiresAt: { not: null },
    },
    select: {
      id: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
    },
  });

  console.log('====================================');
  console.log(`TOTAL USERS WITH PASS: ${usersWithPass.length}`);
  console.log('====================================');

  // Breakdown by status
  const byStatus: Record<string, number> = {};
  for (const u of usersWithPass) {
    byStatus[u.status] = (byStatus[u.status] || 0) + 1;
  }
  console.log('Status breakdown of users with pass:', byStatus);

  // Check if ANY non-active user has a pass:
  const nonActiveWithPass = usersWithPass.filter(u => u.status !== 'ACTIVE');
  console.log(`NON-ACTIVE USERS WITH PASS: ${nonActiveWithPass.length} (MUST BE ZERO)`);

  // Check PENDING users in the DB
  const pendingCount = await db.user.count({ where: { status: 'PENDING' } });
  const pendingWithPass = await db.user.count({ where: { status: 'PENDING', workspaceExpiresAt: { not: null } } });
  console.log(`Total PENDING in DB: ${pendingCount}`);
  console.log(`PENDING with pass: ${pendingWithPass} (MUST BE ZERO)`);

  // Check REJECTED users in the DB
  const rejectedCount = await db.user.count({ where: { status: 'REJECTED' } });
  const rejectedWithPass = await db.user.count({ where: { status: 'REJECTED', workspaceExpiresAt: { not: null } } });
  console.log(`Total REJECTED in DB: ${rejectedCount}`);
  console.log(`REJECTED with pass: ${rejectedWithPass} (MUST BE ZERO)`);
}

verify().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
