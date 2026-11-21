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
  // Check how many have phone not null
  const withPhone = await db.user.count({ where: { status: 'ACTIVE', phone: { not: null } } });
  console.log('withPhone:', withPhone);

  // Check how many have goal not null
  const withGoal = await db.user.count({ where: { status: 'ACTIVE', goal: { not: null } } });
  console.log('withGoal:', withGoal);

  // Check how many have completed lessons >= 1
  const completedLessons = await db.user.count({
    where: {
      status: 'ACTIVE',
      progress: { some: { isCompleted: true } }
    }
  });
  console.log('completedLessons >= 1:', completedLessons);

  // Check the campaigns:
  // Earlier we saw Campaign "July 2026 - 60 Day AI Challenge". In snapshots, how many paid students?
  // Let's check all campaigns:
  const allCampaigns = await db.campaign.findMany({
    select: { name: true, studentGoal: true, snapshots: { orderBy: { date: 'desc' }, take: 1 } }
  });
  console.log('Campaign final snapshots:', JSON.stringify(allCampaigns, null, 2));

  // Let's check if there's any other field:
  const usersWithNonZeroXP = await db.user.count({ where: { status: 'ACTIVE', xp: { gt: 0 } } });
  console.log('usersWithNonZeroXP:', usersWithNonZeroXP);

  // Check users who have sessions in multiple days
  const multipleSessions = await db.user.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, _count: { select: { sessions: true } } }
  });
  const moreThan1Session = multipleSessions.filter(u => u._count.sessions > 1).length;
  const moreThan2Sessions = multipleSessions.filter(u => u._count.sessions > 2).length;
  console.log('moreThan1Session:', moreThan1Session);
  console.log('moreThan2Sessions:', moreThan2Sessions);
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
