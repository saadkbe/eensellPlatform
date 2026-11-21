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
  const withProgress = await db.user.count({
    where: {
      status: 'ACTIVE',
      progress: { some: {} }
    }
  });
  console.log('Active users with progress > 0:', withProgress);

  const withSessions = await db.user.count({
    where: {
      status: 'ACTIVE',
      sessions: { some: {} }
    }
  });
  console.log('Active users with sessions > 0:', withSessions);

  const withOnboarding = await db.user.count({
    where: {
      status: 'ACTIVE',
      onboardingCompleted: true
    }
  });
  console.log('Active users with onboardingCompleted = true:', withOnboarding);

  // Check referrals or challenges
  const withChallenge = await db.user.count({
    where: {
      status: 'ACTIVE',
      challengeDayCompletions: { some: {} }
    }
  });
  console.log('Active users with challenge completions:', withChallenge);
}

main().finally(async () => {
  await db.$disconnect();
  process.exit(0);
});
