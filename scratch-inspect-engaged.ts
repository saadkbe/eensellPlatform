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
  const users = await db.user.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      role: true,
      tier: true,
      onboardingCompleted: true,
      _count: {
        select: {
          progress: true,
          sessions: true,
          homeworks: true,
          dailyGoals: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`Total Active: ${users.length}`);

  // How many have progress > 0
  const engaged = users.filter(u => u._count.progress > 0 || u._count.homeworks > 0 || u._count.dailyGoals > 0);
  console.log(`Engaged (progress or homework or dailyGoals > 0): ${engaged.length}`);

  // Check users created after a certain date or before a certain date
  const juneToSept = users.filter(u => {
    const d = new Date(u.createdAt);
    return d >= new Date('2026-06-01') && d <= new Date('2026-09-30');
  });
  console.log(`June to Sept total: ${juneToSept.length}`);

  // Let's inspect the first 10 and last 10 users to understand
  console.log('Sample users from 2026-06:');
  const juneUsers = users.filter(u => u.createdAt.toISOString().startsWith('2026-06'));
  console.log(juneUsers.slice(0, 5).map(u => ({ email: u.email, createdAt: u.createdAt, progress: u._count.progress })));

  console.log('Sample users from 2026-07/08/09:');
  const laterUsers = users.filter(u => !u.createdAt.toISOString().startsWith('2026-06'));
  console.log(laterUsers.slice(0, 10).map(u => ({ email: u.email, createdAt: u.createdAt, progress: u._count.progress })));
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
