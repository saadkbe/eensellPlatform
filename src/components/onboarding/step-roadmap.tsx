"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface StepRoadmapProps {
  milestones: RoadmapMilestone[];
  onNext: () => void;
}

const PHASE_COLORS: Record<string, string> = {
  learn_ai: "bg-[#8B5CF6] text-white",
  build_skills: "bg-[#06B6D4] text-white",
  build_offer: "bg-[#F59E0B] text-white",
  build_portfolio: "bg-[#EC4899] text-white",
  first_client: "bg-[#10B981] text-white",
  scale_business: "bg-[#EF4444] text-white",
};

const PHASE_BORDER_COLORS: Record<string, string> = {
  learn_ai: "border-[#8B5CF6]",
  build_skills: "border-[#06B6D4]",
  build_offer: "border-[#F59E0B]",
  build_portfolio: "border-[#EC4899]",
  first_client: "border-[#10B981]",
  scale_business: "border-[#EF4444]",
};

export function StepRoadmap({ milestones, onNext }: StepRoadmapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4"
        >
          The Journey Ahead
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Here is your roadmap to success. Trust the process and stay committed.
        </motion.p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 bg-gradient-to-b from-[#8B5CF6] via-[#06B6D4] to-[#F59E0B] rounded-full timeline-line hidden sm:block opacity-30" />
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 bg-gradient-to-b from-[#8B5CF6] via-[#06B6D4] to-[#F59E0B] rounded-full sm:hidden opacity-30" />

        <div className="space-y-12">
          {milestones.sort((a, b) => a.order - b.order).map((milestone, index) => {
            const isEven = index % 2 === 0;
            const isFirst = index === 0;

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative flex flex-col md:flex-row items-start md:items-center w-full",
                  isEven ? "md:justify-start" : "md:justify-end"
                )}
              >
                {/* Center Node / Dot */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-8 h-8 z-10">
                  <div className="w-4 h-4 rounded-full bg-background border-2 border-primary relative z-10">
                    {isFirst && (
                      <span className="absolute -inset-1 rounded-full bg-primary/50 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Card Container */}
                <div
                  className={cn(
                    "w-full md:w-5/12 pl-16 md:pl-0",
                    isEven ? "md:pr-12" : "md:pl-12"
                  )}
                >
                  <div
                    className={cn(
                      "bg-[#18181B] border border-[#27272A] rounded-xl p-6 shadow-lg hover:border-primary/50 transition-colors relative",
                      isFirst && "border-primary/50 ring-1 ring-primary/20",
                      PHASE_BORDER_COLORS[milestone.phase] || "border-border"
                    )}
                  >
                    {isFirst && (
                      <div className="absolute -top-3 left-6 md:left-auto md:right-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        You are here
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mb-3">
                      {milestone.icon && (
                        <div className="text-2xl">{milestone.icon}</div>
                      )}
                      <h3 className="text-xl font-semibold text-foreground">
                        {milestone.title}
                      </h3>
                    </div>

                    {milestone.description && (
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {milestone.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-medium",
                          PHASE_COLORS[milestone.phase] || "bg-muted text-muted-foreground"
                        )}
                      >
                        Week {milestone.weekStart}-{milestone.weekEnd}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: milestones.length * 0.1 + 0.5 }}
        className="mt-16 flex justify-center"
      >
        <Button onClick={onNext} size="lg" className="w-full sm:w-auto min-w-[200px]">
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
