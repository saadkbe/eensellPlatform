"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/landing/LanguageProvider";

interface HeroSectionProps {
  firstName: string;
  greeting: string;
  activeCampaign: any | null;
  completedLessons: number;
  totalLessons: number;
  currentFocus: string;
  estimatedTime: string;
}

export function HeroSection({
  firstName,
  greeting,
  activeCampaign,
  completedLessons,
  totalLessons,
  currentFocus,
  estimatedTime,
}: HeroSectionProps) {
  const { t } = useLanguage();
  
  // Calculate Challenge Metrics
  let dayOfChallenge = 1;
  let daysRemaining = 60;
  let progressPercent = 0;
  let isActiveChallenge = false;

  if (activeCampaign) {
    const today = new Date();
    const start = new Date(activeCampaign.startDate);
    const end = new Date(activeCampaign.endDate);
    
    if (today >= start && today <= end) {
      isActiveChallenge = true;
      const diffTime = Math.abs(today.getTime() - start.getTime());
      dayOfChallenge = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const remainingTime = Math.abs(end.getTime() - today.getTime());
      daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    }
  }

  if (totalLessons > 0) {
    progressPercent = Math.round((completedLessons / totalLessons) * 100);
  }

  // Generate ASCII progress bar
  const totalBars = 20;
  const filledBars = Math.round((progressPercent / 100) * totalBars);
  const progressBar = "█".repeat(filledBars) + "░".repeat(totalBars - filledBars);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0b10] shadow-2xl"
    >
      {/* Background Gradients & Meshes */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-violet-500/[0.05]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 left-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2" />
      
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
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-white/80">{greeting}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8">
            Welcome back, {firstName} 👋
          </h1>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">60-Day AI Challenge</h2>
                <p className="text-sm text-white/60">
                  {isActiveChallenge ? `Day ${dayOfChallenge} of 60` : "Challenge Preparation Phase"}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  {progressPercent}%
                </span>
              </div>
            </div>

            <div className="font-mono text-sm tracking-widest text-indigo-500/80 mb-4 overflow-hidden truncate">
              {progressBar}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-white/40 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              {isActiveChallenge ? `${daysRemaining} Days Remaining` : "Starts Soon"}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Focus & CTA */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex flex-col h-full justify-between bg-gradient-to-br from-indigo-500/[0.05] to-transparent border border-indigo-500/[0.1] rounded-2xl p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Today's Focus</h3>
              </div>
              
              <p className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight">
                {currentFocus}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-white/60 mb-8">
                <Target className="w-4 h-4" />
                <span>Estimated time: {estimatedTime}</span>
              </div>
            </div>

            <Link href="/dashboard/modules" className="mt-auto">
              <Button className="w-full sm:w-auto h-14 px-8 bg-white text-black hover:bg-white/90 rounded-xl font-bold text-base shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all hover:scale-105 group border-0">
                <span className="flex items-center gap-3">
                  Continue Learning
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
