"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlayCircle, UserCircle, Users, BookOpen, Compass, Check } from "lucide-react";

interface Mission {
  id: string;
  title: string;
  description: string | null;
  type: string;
  isCompleted: boolean;
  order: number;
}

interface StepFirstMissionProps {
  missions: Mission[];
  onNext: () => void;
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  watch_welcome: PlayCircle,
  complete_profile: UserCircle,
  join_community: Users,
  first_lesson: BookOpen,
};

const TIME_ESTIMATES: Record<string, string> = {
  watch_welcome: "~5 min",
  complete_profile: "~2 min",
  join_community: "~3 min",
  first_lesson: "~15 min",
};

export function StepFirstMission({ missions, onNext }: StepFirstMissionProps) {
  const sortedMissions = [...missions].sort((a, b) => a.order - b.order);

  // Force mission 1 and 2 to be completed if they aren't, per requirements
  const displayMissions = sortedMissions.map((m, idx) => ({
    ...m,
    isCompleted: idx < 2 ? true : m.isCompleted,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-[-1] bg-[radial-gradient(#27272A_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

      <div className="text-center mb-12 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary"
        >
          <Compass className="w-8 h-8" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4"
        >
          Your First Mission
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground"
        >
          Let's get you set up for success before diving into the core material.
        </motion.p>
      </div>

      <div className="space-y-4 mb-12">
        {displayMissions.map((mission, index) => {
          const Icon = TYPE_ICONS[mission.type] || BookOpen;
          const timeEstimate = TIME_ESTIMATES[mission.type] || "~5 min";

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={cn(
                "p-5 rounded-xl border border-[#27272A] bg-[#18181B] flex items-start gap-4 transition-all duration-300",
                mission.isCompleted ? "opacity-60" : "shadow-lg hover:border-primary/40"
              )}
            >
              <div className="mt-1 flex-shrink-0">
                {mission.isCompleted ? (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin-slow relative">
                     <span className="absolute -inset-1 rounded-full bg-primary/20 animate-pulse" />
                     <div className="w-full h-full bg-background rounded-full border-2 border-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3
                    className={cn(
                      "font-semibold text-base truncate",
                      mission.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {mission.title}
                  </h3>
                  <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
                    {timeEstimate}
                  </span>
                </div>
                {mission.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {mission.description}
                  </p>
                )}
              </div>

              <div
                className={cn(
                  "hidden sm:flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-full",
                  mission.isCompleted ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center"
      >
        <Button onClick={onNext} size="lg" className="w-full sm:w-auto min-w-[240px] group">
          Accept Mission
          <motion.span
            className="ml-2 group-hover:translate-x-1 transition-transform inline-block"
            aria-hidden="true"
          >
            &rarr;
          </motion.span>
        </Button>
      </motion.div>
    </div>
  );
}
