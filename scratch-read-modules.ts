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
    orderBy: { order: 'asc' }
  });
  console.log(JSON.stringify(modules, null, 2));
}

main().finally(async () => {
  await prisma.$disconnect();
  process.exit(0);
});
