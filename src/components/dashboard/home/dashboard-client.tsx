"use client";

import { motion } from "framer-motion";
import { PromoHeroBanner } from "./promo-hero-banner";
import { ProgressHub } from "./progress-hub";
import { ActiveMissionCard } from "./active-mission-card";
import { VaultShortcuts } from "./vault-shortcuts";
import { WinsFeed } from "./wins-feed";
import { WeeklyOfficeHours } from "./weekly-office-hours";

export interface DashboardClientProps {
  firstName?: string;
  userTier?: string;
  userRole?: string;
  userXp?: number;
  referralEarnings?: number;
  upcomingCall?: any;
  challengeProgress?: any;
  continueLesson?: any;
  continueModule?: any;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 24,
    },
  },
};

export function DashboardClient({
  firstName = "Member",
  userTier = "FREE_LIBRARY",
  userRole = "ACTIVE_USER",
  userXp = 12450,
  referralEarnings = 2400,
  upcomingCall = null,
  challengeProgress = null,
  continueLesson = null,
  continueModule = null,
}: DashboardClientProps) {
  // Resolve challenge metrics
  const completedDays = challengeProgress?.completedDays ?? 8;
  const dayNumber =
    challengeProgress?.todaysChallengeDay?.dayNumber ??
    (challengeProgress?.completedDays ? challengeProgress.completedDays + 1 : 9);

  const currentPhaseName =
    challengeProgress?.currentPhase === "build_skills"
      ? "Phase 2 — AI Skills & Workflows"
      : challengeProgress?.currentPhase === "build_offer"
      ? "Phase 3 — Irresistible Offer Creation"
      : challengeProgress?.currentPhase === "first_client"
      ? "Phase 4 — Client Acquisition & Outreach"
      : challengeProgress?.currentPhase === "scale_business"
      ? "Phase 5 — Agency Scale & Automation"
      : "Phase 1 — Technical Foundations";

  const activeLessonUrl =
    continueLesson && continueModule
      ? `/dashboard/modules/${continueModule.id}/${continueLesson.id}`
      : "/dashboard/challenge";

  const tierStatus =
    userRole === "ADMIN"
      ? "Admin Elite"
      : userTier === "UNIVERSITY_V2"
      ? "V2 Founding Member"
      : "V2 Member";

  const missionTitle =
    challengeProgress?.todaysChallengeDay?.title ||
    `Day ${dayNumber}: Configure Inbound Webhooks & Meta WhatsApp Verification`;

  const missionDescription =
    challengeProgress?.todaysChallengeDay?.description ||
    "Set up your Meta Developer account, configure incoming webhook verification tokens, and test routing in Make.com.";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-16"
    >
      {/* ── 1. Top Promotional Hero Banner (Affiliate Showcase) ── */}
      <motion.div variants={itemVariants}>
        <PromoHeroBanner />
      </motion.div>

      {/* ── 2. Core Metric & Progress Hub (Replacing Calendar Look) ── */}
      <motion.div variants={itemVariants}>
        <ProgressHub
          completedDays={completedDays}
          totalDays={60}
          currentPhaseName={currentPhaseName}
          activeDayNumber={dayNumber}
          userXp={userXp}
          referralEarnings={referralEarnings}
          tierStatus={tierStatus}
          activeLessonUrl={activeLessonUrl}
        />
      </motion.div>

      {/* ── 3. Main Two-Column Execution Layout (65% / 35%) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column (Primary Focus - 65% width) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 space-y-6"
        >
          {/* Active Mission Card */}
          <ActiveMissionCard
            missionTitle={missionTitle}
            missionDescription={missionDescription}
            dayNumber={dayNumber}
            estimatedTime="25 mins"
            actionUrl={activeLessonUrl}
          />

          {/* Quick Vault Shortcuts */}
          <VaultShortcuts />
        </motion.div>

        {/* Right Column (Feed & Activity - 35% width) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 space-y-6"
        >
          {/* Recent Member Proof / Wins Feed */}
          <WinsFeed />

          {/* Weekly Schedule & Office Hours */}
          <WeeklyOfficeHours upcomingCall={upcomingCall} />
        </motion.div>
      </div>
    </motion.div>
  );
}
