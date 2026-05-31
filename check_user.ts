import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const email = "saadkbe1@gmail.com";
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log('User state:', user);
  } catch (error) {
    console.error('Error fetching user:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
