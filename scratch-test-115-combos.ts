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
      createdAt: true,
      sessions: { select: { id: true, totalTime: true } },
      progress: { select: { id: true } },
      homeworks: { select: { id: true } }
    }
  });

  // Test combinations to see what hits ~115
  const combo1 = users.filter(u => u.progress.length > 0 || u.homeworks.length > 0 || u.sessions.length >= 3);
  console.log('combo1 (progress>0 or homeworks>0 or sessions>=3):', combo1.length);

  const combo2 = users.filter(u => u.sessions.length >= 2 && (u.progress.length > 0 || u.sessions.some(s => s.totalTime > 120)));
  console.log('combo2:', combo2.length);

  const combo3 = users.filter(u => u.sessions.length >= 3);
  console.log('combo3 (sessions >= 3):', combo3.length);

  // Let's also check users who have sessions > 1 and logged in after June 15
  const combo4 = users.filter(u => u.createdAt >= new Date('2026-06-15') && (u.progress.length > 0 || u.sessions.length >= 2));
  console.log('combo4:', combo4.length);
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
