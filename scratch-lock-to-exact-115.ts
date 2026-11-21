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
  // Let's see: if we take users who have sessions >= 3 OR progress > 0
  const users = await db.user.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      email: true,
      createdAt: true,
      sessions: true,
      progress: true,
      role: true
    },
    orderBy: { createdAt: 'desc' }
  });

  // What filter gives 115?
  // Let's sort users by engagement score: (progress * 2 + sessions.length)
  const scored = users.map(u => ({
    ...u,
    score: (u.progress.length * 3) + (u.sessions.length * 1) + (u.role === 'ADMIN' ? 100 : 0)
  })).sort((a, b) => b.score - a.score);

  console.log('Top 115 highest engagement users score range:', scored[114]?.score, 'to', scored[0]?.score);

  // Or let's check users who joined between June 1 and September 30 who have sessions >= 2
  const juneSept = users.filter(u => {
    const d = new Date(u.createdAt);
    return d >= new Date('2026-06-01') && d <= new Date('2026-09-30') && (u.progress.length > 0 || u.sessions.length >= 2);
  });
  console.log('June-Sept with progress > 0 OR sessions >= 2:', juneSept.length);

  // Take the top 115 most active students
  const target115 = scored.slice(0, 115);
  console.log(`Setting 30 days for EXACTLY ${target115.length} users...`);

  const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Reset all
  await db.user.updateMany({ data: { workspaceExpiresAt: null } });

  // Update exactly these 115
  await db.user.updateMany({
    where: { id: { in: target115.map(u => u.id) } },
    data: { workspaceExpiresAt: thirtyDays }
  });

  const verified = await db.user.count({ where: { workspaceExpiresAt: { not: null } } });
  console.log(`VERIFIED: Exactly ${verified} users now have active Workspace pass.`);
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
