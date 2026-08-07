"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepVideoProps {
  videoUrl: string;
  founderNoteEn: string;
  founderNoteAr: string;
  onNext: () => void;
  onTrackWatchTime: (seconds: number) => void;
}

export function StepVideo({
  videoUrl,
  founderNoteEn,
  founderNoteAr,
  onNext,
  onTrackWatchTime,
}: StepVideoProps) {
  const watchTimeRef = useRef(0);

  useEffect(() => {
    // Track watch time every 10 seconds
    const intervalId = setInterval(() => {
      watchTimeRef.current += 10;
      onTrackWatchTime(watchTimeRef.current);
    }, 10000);

    return () => {
      clearInterval(intervalId);
      // Final flush of watch time if needed could be done here
    };
  }, [onTrackWatchTime]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-16 px-6 bg-background onboarding-bg text-foreground">
      <div className="max-w-4xl w-full flex flex-col gap-16">
        
        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full"
        >
          {/* Premium Glow Behind Video */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 blur-2xl rounded-[3rem] opacity-50" />
          
          <div className="relative aspect-video w-full rounded-2xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-black">
            <iframe
              src={videoUrl}
              title="Founder Welcome Video"
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Founder's Note Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-8 px-4"
        >
          <div className="max-w-2xl w-full space-y-8 relative">
            {/* English Note */}
            <p className="font-handwritten text-2xl md:text-3xl text-zinc-300 leading-relaxed text-left">
              {founderNoteEn}
            </p>
            
            {/* Decorative Separator */}
            <div className="w-full flex items-center justify-center gap-4 opacity-30">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />
            </div>

            {/* Arabic Note */}
            <p 
              dir="rtl" 
              className="font-arabic-hand text-xl md:text-2xl text-zinc-200 leading-loose text-right opacity-90"
            >
              {founderNoteAr}
            </p>
          </div>
        </motion.div>

        {/* Action Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center pt-8 pb-16"
        >
          <Button
            onClick={onNext}
            size="lg"
            className="h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-medium group transition-all duration-300"
          >
            Continue
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
