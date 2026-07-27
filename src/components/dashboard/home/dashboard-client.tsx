"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

// Import all our new premium components
import { HeroSection } from "./hero-section";
import { JourneyRoadmap } from "./journey-roadmap";
import { TodaysMission } from "./todays-mission";
import { ContinueLearning } from "./continue-learning";
import { LearningStreak } from "./learning-streak";
import { LiveCallEvent } from "./live-call-event";
import { RecentActivity } from "./recent-activity";
import { WeeklyChallenge } from "./weekly-challenge";
import { AcceleratorTeaser } from "./accelerator-teaser";
import { TodaysProgress } from "./todays-progress";

interface DashboardClientProps {
  firstName: string;
  greeting: string;
  activeCampaign: any | null;
  completedLessons: number;
  totalLessons: number;
  continueLesson: any | null;
  continueModule: any | null;
  upcomingCall: any | null;
  dailyProgresses: any[];
  weeklyChallenge: any | null;
  recentActivity: any[];
}

export function DashboardClient({
  firstName,
  greeting,
  activeCampaign,
  completedLessons,
  totalLessons,
  continueLesson,
  continueModule,
  upcomingCall,
  dailyProgresses,
  weeklyChallenge,
  recentActivity,
}: DashboardClientProps) {
  const { t } = useLanguage();

  // 1. Calculate Streak
  let streakDays = 0;
  if (dailyProgresses && dailyProgresses.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let currentDateToCheck = new Date(dailyProgresses[0].date);
    currentDateToCheck.setHours(0, 0, 0, 0);

    // If the most recent progress is today or yesterday, count the streak
    if (currentDateToCheck.getTime() === today.getTime() || currentDateToCheck.getTime() === yesterday.getTime()) {
      streakDays = 1;
      for (let i = 1; i < dailyProgresses.length; i++) {
        const prevDate = new Date(dailyProgresses[i-1].date);
        prevDate.setHours(0, 0, 0, 0);
        
        const currDate = new Date(dailyProgresses[i].date);
        currDate.setHours(0, 0, 0, 0);

        const diffTime = Math.abs(prevDate.getTime() - currDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          streakDays++;
        } else {
          break; // Broken streak
        }
      }
    }
  }

  // 2. Map Module Progress to Journey Stage
  // This is a naive calculation for now: 6 stages distributed over total lessons.
  let currentStageIndex = 0;
  if (totalLessons > 0) {
    const lessonsPerStage = Math.ceil(totalLessons / 6);
    currentStageIndex = Math.min(5, Math.floor(completedLessons / lessonsPerStage));
  }

  // 3. Today's Progress (Tasks)
  // For the OS, today's progress could be derived from whether today's lesson is complete + homework.
  // We'll mock a simple 0/2 or 1/2 or 2/2 based on daily progress.
  let todaysCompletedTasks = 0;
  if (dailyProgresses.some(p => new Date(p.date).setHours(0,0,0,0) === new Date().setHours(0,0,0,0))) {
    todaysCompletedTasks = 1;
  }
  const todaysTotalTasks = 2; // e.g. Lesson + Action step

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* ── HERO SECTION ── */}
      <HeroSection 
        firstName={firstName}
        greeting={greeting}
        activeCampaign={activeCampaign}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
        currentFocus={continueModule?.title || "Welcome to the Journey"}
        estimatedTime={continueLesson?.duration ? `${Math.ceil(continueLesson.duration / 60)} mins` : "25 mins"}
      />

      {/* ── MAIN DASHBOARD GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main Learning Flow */}
        <div className="lg:col-span-8 space-y-6">
          <TodaysMission 
            lesson={continueLesson}
            homeworkStatus={null} // Defaulting for now, could be fetched
            liveCall={upcomingCall}
            estimatedTime={continueLesson?.duration ? `${Math.ceil(continueLesson.duration / 60)} mins` : "25 mins"}
          />
          
          <JourneyRoadmap currentStageIndex={currentStageIndex} />
          
          <ContinueLearning 
            lesson={continueLesson}
            module={continueModule}
          />
        </div>

        {/* RIGHT COLUMN: Gamification & Events */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <TodaysProgress 
              completedTasks={todaysCompletedTasks} 
              totalTasks={todaysTotalTasks} 
            />
            <LearningStreak streakDays={streakDays} />
          </div>
          
          <WeeklyChallenge challenge={weeklyChallenge} />
          
          <LiveCallEvent liveCall={upcomingCall} />
          
          <RecentActivity activities={recentActivity} />
        </div>
      </div>

      {/* ── BOTTOM ACCELERATOR TEASER ── */}
      <div className="pt-8">
        <AcceleratorTeaser />
      </div>
    </div>
  );
}
