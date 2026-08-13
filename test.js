const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.module.findMany({ select: { title: true, description: true } })
  .then(console.log)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
