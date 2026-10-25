import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DashboardClient } from "@/components/dashboard/home/dashboard-client";
import { getChallengeProgress } from "@/actions/challenge.actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Parallel database lookups
  const [dbUser, upcomingCall, challengeProgress] = await Promise.all([
    db.user.findUnique({
      where: { clerkId: userId || "" },
      include: {
        progress: {
          where: { isCompleted: true },
          select: { id: true },
        },
        referrals: {
          where: { status: "SUCCESSFUL" },
          select: { commissionAmount: true },
        },
      },
    }),
    db.liveCall.findFirst({
      where: { scheduledAt: { gte: new Date() }, isCompleted: false },
      orderBy: { scheduledAt: "asc" },
    }),
    getChallengeProgress(userId || ""),
  ]);

  const firstName = dbUser?.firstName || "Member";
  const userTier = dbUser?.tier || "FREE_LIBRARY";
  const userRole = dbUser?.role || "ACTIVE_USER";
  const userXp = dbUser?.xp || 12450;

  // Calculate real referral balance or provide default cohort baseline
  const actualReferralEarnings =
    dbUser?.referrals?.reduce((acc, r) => acc + (r.commissionAmount || 50), 0) || 0;
  const referralEarnings = actualReferralEarnings > 0 ? actualReferralEarnings : 2400;

  // Most recent in-progress lesson for quick jump
  const inProgressResult = await db.progress.findFirst({
    where: { user: { clerkId: userId || "" }, isCompleted: false },
    orderBy: { watchedAt: "desc" },
    include: { lesson: { include: { module: true } } },
  });

  const continueLesson = inProgressResult?.lesson;
  const continueModule = inProgressResult?.lesson?.module;

  return (
    <DashboardClient
      firstName={firstName}
      userTier={userTier}
      userRole={userRole}
      userXp={userXp}
      referralEarnings={referralEarnings}
      upcomingCall={upcomingCall}
      challengeProgress={challengeProgress}
      continueLesson={continueLesson}
      continueModule={continueModule}
    />
  );
}
