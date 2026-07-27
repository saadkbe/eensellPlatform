import { db as prisma } from './src/lib/db';

async function main() {
  const users = await prisma.user.findMany({
    where: {
      status: 'ACTIVE',
      role: 'ACTIVE_USER'
    },
    orderBy: {
      createdAt: 'asc'
    },
    take: 5
  });

  console.log("Found active users:", users.length);
  users.forEach((u, i) => {
    console.log(`${i + 1}: ${u.email} - Created: ${u.createdAt.toISOString()}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
