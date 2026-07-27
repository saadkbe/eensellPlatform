"use client";

import { motion } from "framer-motion";
import { Check, Compass, Search, PenTool, Image as ImageIcon, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: 1, title: "Learn AI", icon: Compass },
  { id: 2, title: "Discover Opportunities", icon: Search },
  { id: 3, title: "Build Your Offer", icon: PenTool },
  { id: 4, title: "Portfolio", icon: ImageIcon },
  { id: 5, title: "First Client", icon: Users },
  { id: 6, title: "Scale Business", icon: Briefcase },
];

interface JourneyRoadmapProps {
  currentStageIndex: number;
}

export function JourneyRoadmap({ currentStageIndex }: JourneyRoadmapProps) {
  return (
    <div className="bg-[#0a0b10] border border-white/[0.08] rounded-3xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight">Journey Roadmap</h2>
        <span className="text-sm font-semibold text-white/40 uppercase tracking-widest">
          Stage {currentStageIndex + 1} of {STAGES.length}
        </span>
      </div>

      <div className="relative">
        {/* Background Track */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-white/[0.04] rounded-full" />
        
        {/* Progress Track */}
        <motion.div 
          className="absolute top-6 left-0 h-1 bg-emerald-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        <div className="relative flex justify-between">
          {STAGES.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const Icon = stage.icon;
            
            return (
              <div key={stage.id} className="flex flex-col items-center group relative z-10 w-24">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 transition-all duration-300",
                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : 
                    isCurrent ? "bg-white/[0.08] border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : 
                    "bg-[#0a0b10] border-white/[0.1] text-white/30"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />
                  )}
                </motion.div>
                
                <span className={cn(
                  "text-xs font-semibold text-center transition-colors duration-300",
                  isCompleted ? "text-white/80" : 
                  isCurrent ? "text-white" : 
                  "text-white/30"
                )}>
                  {stage.title}
                </span>

                {isCurrent && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -bottom-4 w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
