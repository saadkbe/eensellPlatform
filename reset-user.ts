import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function resetUser() {
  const email = "saadyoulife@gmail.com";
  
  const user = await db.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log("No user found with email:", email);
    return;
  }
  
  await db.user.update({
    where: { email },
    data: { 
      onboardingCompleted: false,
      onboardingStep: 1,
      videoWatchTime: 0,
      goals: null,
      phone: null,
      goal: null,
      experienceLevel: null,
      weeklyHours: null,
      incomeGoal: null,
      challengeStartDate: null
    }
  });
  
  console.log(`Successfully reset onboarding for ${email}!`);
}

resetUser().catch(console.error);
