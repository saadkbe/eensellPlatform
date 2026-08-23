import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const modules = await prisma.module.findMany({
    orderBy: { order: 'asc' },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, videoUrl: true, isPublished: true, order: true, duration: true }
      }
    }
  });
  
  for (const mod of modules) {
    const videoLessons = mod.lessons.filter(l => l.videoUrl);
    const publishedLessons = mod.lessons.filter(l => l.isPublished);
    console.log(`\n[Order ${mod.order}] ${mod.title}`);
    console.log(`  ID: ${mod.id}`);
    console.log(`  Published: ${mod.isPublished}`);
    console.log(`  Total Lessons: ${mod.lessons.length}`);
    console.log(`  Published Lessons: ${publishedLessons.length}`);
    console.log(`  Lessons with Video: ${videoLessons.length}`);
    if (videoLessons.length > 0) {
      console.log(`  HAS VIDEO CONTENT:`);
      for (const l of videoLessons) {
        console.log(`    - [${l.order}] ${l.title} | ${l.videoUrl?.substring(0, 60)}... | pub: ${l.isPublished}`);
      }
    }
  }
}

main().finally(async () => {
  await prisma.$disconnect();
  process.exit(0);
});
