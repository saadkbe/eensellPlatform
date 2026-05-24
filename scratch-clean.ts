import { db } from "./src/lib/db";

async function main() {
  // 1. Delete all users except saadkbe1@gmail.com
  const usersDeleted = await db.user.deleteMany({
    where: {
      email: {
        not: "saadkbe1@gmail.com",
      },
    },
  });
  console.log(`Deleted ${usersDeleted.count} users.`);

  // 2. Find and delete the "pdf action plan" resource
  const resourcesDeleted = await db.resource.deleteMany({
    where: {
      title: {
        contains: "action plan",
        mode: "insensitive"
      }
    }
  });
  console.log(`Deleted ${resourcesDeleted.count} resources containing 'action plan'.`);
  
  // Check other PDF resources if any
  const pdfResources = await db.resource.findMany({
    where: {
      type: "pdf"
    }
  });
  console.log(`Found ${pdfResources.length} PDF resources:`, pdfResources.map(r => r.title));
  
}

main()
  .catch(e => console.error(e))
  .finally(() => {
    process.exit(0);
  });
