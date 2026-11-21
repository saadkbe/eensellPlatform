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
  // Check users by createdAt ranges
  const users = await db.user.findMany({
    where: { status: 'ACTIVE' },
    select: { id: true, email: true, createdAt: true, sessions: true, progress: true }
  });

  // Check if there are exactly 115 users in any query:
  // e.g. after a certain date in June?
  // Let's sort by createdAt desc and inspect:
  console.log('Total active users:', users.length);

  // How many users have watched any video (progress length > 0 or session count > 0)?
  const withAnyActivity = users.filter(u => u.progress.length > 0);
  console.log('Users with progress > 0:', withAnyActivity.length);

  // How many users have sessions > 1?
  const sessionsGt1 = users.filter(u => u.sessions.length > 1);
  console.log('Users with sessions > 1:', sessionsGt1.length);

  // How many users have sessions >= 3?
  const sessionsGte3 = users.filter(u => u.sessions.length >= 3);
  console.log('Users with sessions >= 3:', sessionsGte3.length);

  // Users from July 15 onwards? (When July campaign started)
  const july15Onwards = users.filter(u => u.createdAt >= new Date('2026-07-15T00:00:00Z'));
  console.log('Users created from July 15 to Sept 30:', july15Onwards.filter(u => u.createdAt <= new Date('2026-09-30T23:59:59Z')).length);
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
