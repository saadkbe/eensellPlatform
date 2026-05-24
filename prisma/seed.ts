import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { createClerkClient } from "@clerk/backend";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function main() {
  console.log("🌱 Seeding database...");

  const ADMIN_CLERK_ID = process.env.ADMIN_CLERK_ID || "REPLACE_WITH_CLERK_ID";
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@eensell.com";
  const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || "Admin";
  const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || "Eensell";

  if (ADMIN_CLERK_ID === "REPLACE_WITH_CLERK_ID") {
    console.warn("⚠️  WARNING: ADMIN_CLERK_ID is not set in .env! Please set it to your real Clerk User ID.");
  } else {
    try {
      console.log("🔄 Updating Clerk user metadata...");
      await clerk.users.updateUserMetadata(ADMIN_CLERK_ID, {
        publicMetadata: {
          role: "ADMIN",
          status: "ACTIVE",
        },
      });
      console.log("✅ Clerk metadata updated successfully.");
    } catch (e) {
      console.error("❌ Failed to update Clerk metadata. Make sure your CLERK_SECRET_KEY and ADMIN_CLERK_ID are correct.");
      console.error(e);
    }
  }

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      role: "ADMIN",
      status: "ACTIVE",
      clerkId: ADMIN_CLERK_ID,
    },
    create: {
      clerkId: ADMIN_CLERK_ID,
      email: ADMIN_EMAIL,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`✅ Admin account created/updated in DB: ${admin.email}`);


  // =============================================
  // SAMPLE DATA (Optional — remove in production)
  // =============================================

  // Sample announcement
  await prisma.announcement.upsert({
    where: { id: "announcement-welcome" },
    update: {},
    create: {
      id: "announcement-welcome",
      title: "Welcome to Eensell University! 🎓",
      content:
        "We're excited to launch our premium education platform. Stay tuned for new modules, live sessions, and exclusive resources.",
      isPublished: true,
    },
  });

  console.log("✅ Sample announcement created");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
