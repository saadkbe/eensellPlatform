"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { saveOnboardingStep, trackVideoWatchTime } from "@/actions/onboarding.actions";
import { toast } from "sonner";

import { StepWelcome } from "./step-welcome";
import { StepVideo } from "./step-video";
import { StepProfile } from "./step-profile";
import { StepRoadmap } from "./step-roadmap";
import { StepSchedule } from "./step-schedule";
import { StepFirstMission } from "./step-first-mission";
import { StepCompletion } from "./step-completion";

// ══════════════════════════════════════════════
// The Eensell Journey — Main Orchestrator
// ══════════════════════════════════════════════

interface OnboardingUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  onboardingStep: number;
  challengeStartDate: Date | null;
  videoWatchTime: number;
  phone: string | null;
  goal: string | null;
  experienceLevel: string | null;
  weeklyHours: string | null;
  incomeGoal: string | null;
  missions: Array<{
    id: string;
    title: string;
    description: string | null;
    type: string;
    isCompleted: boolean;
    order: number;
  }>;
  weeklySchedules: Array<{
    dayOfWeek: number;
    timeBlock: string;
  }>;
}

interface OnboardingConfig {
  stepNumber: number;
  title: string;
  subtitle: string | null;
  metadata: string | null;
}

interface RoadmapMilestone {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  weekStart: number;
  weekEnd: number;
  order: number;
  phase: string;
}

interface FirstLesson {
  title: string;
  module: { title: string } | null;
}

interface OnboardingClientProps {
  user: OnboardingUser;
  config: OnboardingConfig[];
  milestones: RoadmapMilestone[];
  firstLesson: FirstLesson | null;
}

const TOTAL_STEPS = 7;

export function OnboardingClient({
  user,
  config,
  milestones,
  firstLesson,
}: OnboardingClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(user.onboardingStep);
  const [isPending, startTransition] = useTransition();

  // Parse config metadata for each step
  const getStepConfig = useCallback(
    (stepNumber: number) => {
      const stepConfig = config.find((c) => c.stepNumber === stepNumber);
      if (!stepConfig) return { title: "", subtitle: "", metadata: {} };
      let metadata = {};
      try {
        metadata = stepConfig.metadata ? JSON.parse(stepConfig.metadata) : {};
      } catch {
        metadata = {};
      }
      return { title: stepConfig.title, subtitle: stepConfig.subtitle, metadata };
    },
    [config]
  );

  // Navigate to next step and persist
  const handleNext = useCallback(
    (step: number, data?: Record<string, unknown>) => {
      startTransition(async () => {
        try {
          await saveOnboardingStep(step, data);
          if (step === 7) {
            // Completion — redirect to dashboard community
            window.location.href = "/dashboard/community";
          } else {
            setCurrentStep(step + 1);
          }
        } catch (error) {
          console.error("Error saving step:", error);
          toast.error("Something went wrong. Please try again.");
        }
      });
    },
    []
  );

  // Skip handler (advances step without saving data)
  const handleSkip = useCallback(
    (step: number) => {
      startTransition(async () => {
        try {
          await saveOnboardingStep(step);
          setCurrentStep(step + 1);
        } catch (error) {
          console.error("Error skipping step:", error);
          toast.error("Something went wrong.");
        }
      });
    },
    []
  );

  // Track video watch time
  const handleTrackWatchTime = useCallback((seconds: number) => {
    trackVideoWatchTime(seconds).catch(console.error);
  }, []);

  // Step configs
  const step1Config = getStepConfig(1);
  const step2Config = getStepConfig(2);
  const step3Config = getStepConfig(3);
  const step7Config = getStepConfig(7);

  return (
    <div className="min-h-screen onboarding-bg text-white relative overflow-hidden">
      {/* Progress indicator — top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className="flex-1 flex items-center">
                <motion.div
                  className="h-1 w-full rounded-full relative overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: i + 1 <= currentStep ? 1 : 0,
                      backgroundColor:
                        i + 1 <= currentStep
                          ? "#F59E0B"
                          : "rgba(255,255,255,0.08)",
                    }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: "left" }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center gap-3">
              <img src="/logo2.png" alt="Eensell" className="h-4 w-auto object-contain scale-[3] brightness-0 invert opacity-60" />
              <span className="text-[11px] text-white/30 font-medium tracking-wider uppercase">
                The Eensell Journey
              </span>
            </div>
            <span className="text-[11px] text-white/30 font-medium">
              {currentStep} / {TOTAL_STEPS}
            </span>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="pt-20 min-h-screen">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepWelcome
                firstName={user.firstName || "Explorer"}
                challengeStartDate={user.challengeStartDate}
                challengeDuration={
                  (step1Config.metadata as { challengeDuration?: number })
                    ?.challengeDuration || 60
                }
                onNext={() => handleNext(1)}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepVideo
                videoUrl={
                  (step2Config.metadata as { videoUrl?: string })?.videoUrl ||
                  ""
                }
                founderNoteEn={
                  (step2Config.metadata as { founderNoteEn?: string })
                    ?.founderNoteEn ||
                  "Welcome to Eensell. I built this for the person I used to be."
                }
                founderNoteAr={
                  (step2Config.metadata as { founderNoteAr?: string })
                    ?.founderNoteAr ||
                  "مرحباً بك في إينسيل. لقد بنيت هذا المكان للشخص الذي كنت عليه في الماضي."
                }
                onNext={() => handleNext(2, { watchTime: 0 })}
                onTrackWatchTime={handleTrackWatchTime}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepProfile
                currentImageUrl={user.imageUrl}
                currentFirstName={user.firstName}
                currentLastName={user.lastName}
                goalsConfig={
                  (
                    step3Config.metadata as {
                      goals?: Array<{
                        value: string;
                        label: string;
                        icon: string;
                        description: string;
                      }>;
                    }
                  )?.goals || []
                }
                experienceLevelsConfig={
                  (
                    step3Config.metadata as {
                      experienceLevels?: Array<{
                        value: string;
                        label: string;
                        description: string;
                      }>;
                    }
                  )?.experienceLevels || []
                }
                incomeGoalsConfig={
                  (
                    step3Config.metadata as {
                      incomeGoals?: Array<{ value: string; label: string }>;
                    }
                  )?.incomeGoals || []
                }
                onNext={(data) => handleNext(3, data)}
                onSkip={() => handleSkip(3)}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepRoadmap
                milestones={milestones}
                onNext={() => handleNext(4)}
              />
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepSchedule
                existingSchedules={user.weeklySchedules.map((s) => ({
                  dayOfWeek: s.dayOfWeek,
                  timeBlock: s.timeBlock,
                }))}
                onNext={(schedules) => handleNext(5, { schedules })}
                onSkip={() => handleSkip(5)}
              />
            </motion.div>
          )}

          {currentStep === 6 && (
            <motion.div
              key="step-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepFirstMission
                missions={user.missions}
                onNext={() => handleNext(6)}
              />
            </motion.div>
          )}

          {currentStep === 7 && (
            <motion.div
              key="step-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepCompletion
                firstName={user.firstName || "Explorer"}
                challengeStartDate={user.challengeStartDate}
                challengeDuration={
                  (step1Config.metadata as { challengeDuration?: number })
                    ?.challengeDuration || 60
                }
                firstLessonTitle={firstLesson?.title || null}
                firstLessonModuleTitle={firstLesson?.module?.title || null}
                communityLink={
                  (step7Config.metadata as { communityLink?: string })
                    ?.communityLink || "/dashboard/community"
                }
                founderMessage={
                  (step7Config.metadata as { founderMessage?: string })
                    ?.founderMessage ||
                  "You're not just joining a course. You're joining a movement."
                }
                milestones={milestones.map((m) => ({
                  title: m.title,
                  icon: m.icon,
                  phase: m.phase,
                }))}
                onComplete={() => handleNext(7)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/20 border-t-orange-500 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
