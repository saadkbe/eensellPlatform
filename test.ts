import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = "postgresql://neondb_owner:npg_HPEr9MR6vTah@ep-old-wildflower-aqz6eppu.c-8.us-east-1.aws.neon.tech/neondb?sslmode=verify-full";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const modules = await prisma.module.findMany({ select: { title: true, description: true } });
  console.log(JSON.stringify(modules, null, 2));
}
main().finally(() => prisma.$disconnect());
