import { getOnboardingData } from "@/actions/onboarding.actions";
import { OnboardingClient } from "@/components/onboarding/onboarding-client";
import { redirect } from "next/navigation";

// ══════════════════════════════════════════════
// The Eensell Journey — Server Entry Point
// ══════════════════════════════════════════════

export default async function OnboardingPage() {
  const data = await getOnboardingData();

  if (!data || !data.user) {
    redirect("/sign-in");
  }

  // If already completed, redirect to dashboard
  if (data.user.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <OnboardingClient
      user={{
        id: data.user.id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        imageUrl: data.user.imageUrl,
        onboardingStep: data.user.onboardingStep,
        challengeStartDate: data.user.challengeStartDate,
        videoWatchTime: data.user.videoWatchTime,
        phone: data.user.phone,
        goal: data.user.goal,
        experienceLevel: data.user.experienceLevel,
        weeklyHours: data.user.weeklyHours,
        incomeGoal: data.user.incomeGoal,
        missions: data.user.missions.map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          type: m.type,
          isCompleted: m.isCompleted,
          order: m.order,
        })),
        weeklySchedules: data.user.weeklySchedules.map((s) => ({
          dayOfWeek: s.dayOfWeek,
          timeBlock: s.timeBlock,
        })),
      }}
      config={data.config.map((c) => ({
        stepNumber: c.stepNumber,
        title: c.title,
        subtitle: c.subtitle,
        metadata: c.metadata,
      }))}
      milestones={data.milestones.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        icon: m.icon,
        weekStart: m.weekStart,
        weekEnd: m.weekEnd,
        order: m.order,
        phase: m.phase,
      }))}
      firstLesson={
        data.firstLesson
          ? {
              title: data.firstLesson.title,
              module: data.firstLesson.module
                ? { title: data.firstLesson.module.title }
                : null,
            }
          : null
      }
    />
  );
}
