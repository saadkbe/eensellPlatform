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

  // 1. Reset all users first
  await db.user.updateMany({
    data: {
      workspaceExpiresAt: null,
    },
  });

  // 2. Identify the active students cohort:
  // Active students who have progress, homework, or engaged sessions (combo1 = ~115 students)
  const activeStudents = await db.user.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { progress: { some: {} } },
        { homeworks: { some: {} } },
        { sessions: { some: { totalTime: { gt: 120 } } } },
        { role: "ADMIN" },
      ],
    },
    select: { id: true, email: true },
  });

  console.log(`Found ${activeStudents.length} truly active students to grant 30 days.`);

  const activeIds = activeStudents.map((u) => u.id);

  // 3. Grant only these active students the 30 days free pass
  const updateResult = await db.user.updateMany({
    where: {
      id: { in: activeIds },
    },
    data: {
      workspaceExpiresAt: thirtyDaysFromNow,
    },
  });

  console.log(`✅ EXACTLY ${updateResult.count} active students have been granted the 30-day Workspace OS pass.`);
  console.log(`All other users have workspaceExpiresAt = null (they will see the 199 MAD recharge modal).`);
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
