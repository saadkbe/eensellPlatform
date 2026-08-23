"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/landing/LanguageProvider";

interface HeroSectionProps {
  firstName: string;
  greeting: string;
  challengeProgress: any;
}

export function HeroSection({
  firstName,
  greeting,
  challengeProgress,
}: HeroSectionProps) {
  const { t } = useLanguage();
  
  // Calculate Challenge Metrics
  const completedDays = challengeProgress?.completedDays || 0;
  const progressPercent = Math.round((completedDays / 60) * 100);
  const currentPhase = challengeProgress?.currentPhase || "Phase 1";
  
  const todaysChallengeDay = challengeProgress?.todaysChallengeDay;
  const currentMission = todaysChallengeDay?.missionTitle || "Continue your learning journey";
  const daysRemaining = 60 - completedDays;
  const dayNumber = todaysChallengeDay?.dayNumber || completedDays + 1;

  // Generate ASCII progress bar
  const totalBars = 20;
  const filledBars = Math.round((progressPercent / 100) * totalBars);
  const progressBar = "█".repeat(filledBars) + "░".repeat(totalBars - filledBars);

  const ctaLink = todaysChallengeDay?.lessonId && todaysChallengeDay?.moduleId 
    ? `/dashboard/modules/${todaysChallengeDay.moduleId}/${todaysChallengeDay.lessonId}` 
    : "/dashboard/challenge";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0b10] shadow-2xl"
    >
      {/* Background Gradients & Meshes */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.05] via-transparent to-amber-500/[0.05]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 left-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2" />
      
      {/* Linear Style Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row gap-10 md:gap-16">
        
        {/* Left Column: Greeting & Challenge Progress */}
        <div className="flex-1 flex flex-col">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-6 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-semibold text-white/80">{greeting}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8">
            Welcome back, {firstName} 👋
          </h1>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white mb-1 uppercase tracking-wider">60 DAYS CHALLENGE</h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-orange-400 font-bold">DAY {dayNumber} / 60</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">{completedDays} days completed</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div className="font-mono text-sm tracking-widest text-orange-500/80 mb-4 overflow-hidden truncate">
              {progressBar}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                {daysRemaining} DAYS REMAINING
              </div>
              <div className="text-xs font-bold px-2 py-1 bg-white/5 rounded-md text-white/70 uppercase">
                {currentPhase}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Today's Focus & CTA */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex flex-col h-full justify-between bg-gradient-to-br from-orange-500/[0.05] to-transparent border border-orange-500/[0.1] rounded-2xl p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Mission</h3>
              </div>
              
              <p className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight line-clamp-2">
                {currentMission}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-white/60 mb-8">
                <Target className="w-4 h-4" />
                <span>Estimated time: 15-20 mins</span>
              </div>
            </div>

            <Link href={ctaLink} className="mt-auto">
              <Button className="w-full sm:w-auto h-14 px-8 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-bold text-base shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all hover:scale-105 group border-0">
                <span className="flex items-center gap-3">
                  Start Mission
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
