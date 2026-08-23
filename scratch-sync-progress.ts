import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting progress synchronization...");

  // Get all existing Progress records that are completed
  const allProgress = await prisma.progress.findMany({
    where: { isCompleted: true },
    select: { userId: true, lessonId: true, watchedAt: true }
  });

  console.log(`Found ${allProgress.length} completed lesson records.`);

  // Get all ChallengeDays that have a lessonId
  const challengeDays = await prisma.challengeDay.findMany({
    where: { lessonId: { not: null } },
    select: { id: true, lessonId: true, dayNumber: true }
  });

  console.log(`Found ${challengeDays.length} challenge days linked to lessons.`);

  let syncedCount = 0;

  for (const progress of allProgress) {
    // Find if this lesson is linked to a challenge day
    const matchingDay = challengeDays.find(cd => cd.lessonId === progress.lessonId);
    
    if (matchingDay) {
      // Upsert the ChallengeDayCompletion
      await prisma.challengeDayCompletion.upsert({
        where: {
          userId_challengeDayId: {
            userId: progress.userId,
            challengeDayId: matchingDay.id
          }
        },
        update: {}, // Already completed, no update needed
        create: {
          userId: progress.userId,
          challengeDayId: matchingDay.id,
          completedAt: progress.watchedAt || new Date()
        }
      });
      syncedCount++;
    }
  }

  console.log(`Successfully synced ${syncedCount} challenge day completions for existing users!`);
}

main().finally(async () => {
  await prisma.$disconnect();
  process.exit(0);
});
