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
  // Check users by progress count
  const withProgress = await db.user.findMany({
    where: {
      status: 'ACTIVE',
      progress: { some: {} }
    },
    select: { id: true, email: true, createdAt: true, progress: true }
  });
  console.log(`withProgress: ${withProgress.length}`);

  // Check users with sessions after July or August?
  const afterJune = await db.user.count({
    where: {
      status: 'ACTIVE',
      createdAt: { gte: new Date('2026-07-01') }
    }
  });
  console.log(`afterJune (July, Aug, Sept...): ${afterJune}`);

  // What about users with totalTime > 0?
  const withTime = await db.user.count({
    where: {
      status: 'ACTIVE',
      sessions: { some: { totalTime: { gt: 60 } } }
    }
  });
  console.log(`withTime > 60s: ${withTime}`);

  // What about user activities count?
  const withActivities = await db.user.count({
    where: {
      status: 'ACTIVE',
      activities: { some: {} }
    }
  });
  console.log(`withActivities: ${withActivities}`);

  // Check homeworks
  const withHomework = await db.user.count({
    where: {
      status: 'ACTIVE',
      homeworks: { some: {} }
    }
  });
  console.log(`withHomework: ${withHomework}`);
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
