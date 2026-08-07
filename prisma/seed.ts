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

  // =============================================
  // THE EENSELL JOURNEY — Onboarding Config Seeds
  // =============================================

  const onboardingSteps = [
    {
      stepNumber: 1,
      title: "Welcome to The Eensell Journey",
      subtitle: "You've just entered the most exclusive AI ecosystem.",
      metadata: JSON.stringify({ challengeDuration: 60 }),
    },
    {
      stepNumber: 2,
      title: "A Message From The Founder",
      subtitle: "Before we begin, there's something I want to share with you.",
      metadata: JSON.stringify({
        videoUrl: "https://player.vimeo.com/video/PLACEHOLDER",
        founderNoteEn: "Welcome to Eensell. I built this for the person I used to be.",
        founderNoteAr: "مرحباً بك في إينسيل. لقد بنيت هذا المكان للشخص الذي كنت عليه في الماضي.",
      }),
    },
    {
      stepNumber: 3,
      title: "Tell Us About You",
      subtitle: "The more we know, the better we can personalize your journey.",
      metadata: JSON.stringify({
        goals: [
          { value: "learning_ai", label: "Learning AI", icon: "Brain", description: "Master AI tools, prompt engineering, and automation fundamentals." },
          { value: "freelancer", label: "Becoming a Freelancer", icon: "Laptop", description: "Build a freelance career powered by AI skills." },
          { value: "agency", label: "Building an Agency", icon: "Building2", description: "Scale an AI services agency from scratch." },
          { value: "exploring", label: "Exploring AI Opportunities", icon: "Compass", description: "Discover where AI can create income and impact." },
          { value: "automations", label: "Building Automations", icon: "Zap", description: "Create powerful automations that save time and generate revenue." },
        ],
        experienceLevels: [
          { value: "beginner", label: "Beginner", description: "Just getting started" },
          { value: "intermediate", label: "Intermediate", description: "Some experience" },
          { value: "advanced", label: "Advanced", description: "Ready to scale" },
        ],
        incomeGoals: [
          { value: "$1K-$3K", label: "$1K – $3K / month" },
          { value: "$3K-$5K", label: "$3K – $5K / month" },
          { value: "$5K-$10K", label: "$5K – $10K / month" },
          { value: "$10K+", label: "$10K+ / month" },
        ],
      }),
    },
    {
      stepNumber: 4,
      title: "Your Journey Ahead",
      subtitle: "Here's exactly where you're headed over the next 60 days.",
    },
    {
      stepNumber: 5,
      title: "Commit to Your Schedule",
      subtitle: "The students who plan their week are 3× more likely to succeed.",
    },
    {
      stepNumber: 6,
      title: "Your First Mission",
      subtitle: "Every great journey starts with a single step.",
    },
    {
      stepNumber: 7,
      title: "Your Welcome Package",
      subtitle: "Everything you need to begin, in one place.",
      metadata: JSON.stringify({
        founderMessage: "You're not just joining a course. You're joining a movement. I'll see you inside.",
        communityLink: "/dashboard/community",
      }),
    },
  ];

  for (const step of onboardingSteps) {
    await prisma.onboardingConfig.upsert({
      where: { stepNumber: step.stepNumber },
      update: { title: step.title, subtitle: step.subtitle, metadata: step.metadata },
      create: step,
    });
  }
  console.log("✅ Onboarding config seeded (7 steps)");

  // =============================================
  // THE EENSELL JOURNEY — Roadmap Milestones
  // =============================================

  const milestones = [
    {
      id: "rm-learn-ai",
      title: "Learn AI",
      description: "Master AI fundamentals, prompt engineering, and the tools that power modern automation.",
      icon: "🧠",
      weekStart: 1,
      weekEnd: 2,
      order: 1,
      phase: "learn_ai",
    },
    {
      id: "rm-build-skills",
      title: "Build Skills",
      description: "Practice with real projects. Build chatbots, automations, and AI-powered workflows.",
      icon: "⚡",
      weekStart: 2,
      weekEnd: 3,
      order: 2,
      phase: "build_skills",
    },
    {
      id: "rm-build-offer",
      title: "Build Your Offer",
      description: "Package your skills into a compelling service offer that clients will pay for.",
      icon: "💎",
      weekStart: 3,
      weekEnd: 4,
      order: 3,
      phase: "build_offer",
    },
    {
      id: "rm-build-portfolio",
      title: "Build Your Portfolio",
      description: "Create case studies, demos, and proof of work that showcase your expertise.",
      icon: "🎨",
      weekStart: 4,
      weekEnd: 5,
      order: 4,
      phase: "build_portfolio",
    },
    {
      id: "rm-first-client",
      title: "Get Your First Client",
      description: "Learn outreach strategies, pricing, and close your first paying client.",
      icon: "🤝",
      weekStart: 5,
      weekEnd: 7,
      order: 5,
      phase: "first_client",
    },
    {
      id: "rm-scale-business",
      title: "Scale Your Business",
      description: "Systemize your delivery, build recurring revenue, and scale beyond your first client.",
      icon: "🚀",
      weekStart: 7,
      weekEnd: 9,
      order: 6,
      phase: "scale_business",
    },
  ];

  for (const milestone of milestones) {
    await prisma.roadmapMilestone.upsert({
      where: { id: milestone.id },
      update: { ...milestone },
      create: { ...milestone },
    });
  }
  console.log("✅ Roadmap milestones seeded (6 phases)");

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
