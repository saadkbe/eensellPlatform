"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function VslSection() {
  const { dir, isRTL } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayToggle = () => {
    if (!videoRef.current) {
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const takeaways = [
    {
      step: "01",
      title: "Scraping Local Moroccan Markets",
      desc: "How to extract 200+ qualified clinics, real estate firms & auto dealers with direct WhatsApp numbers in under 3 minutes without ban risks.",
      tag: "Maps Radar",
    },
    {
      step: "02",
      title: "Darija & French Voice Note Psychology",
      desc: "The exact 45-second audio angle that gets Moroccan CEOs and practice managers to respond within 15 minutes instead of ghosting.",
      tag: "WhatsApp Studio",
    },
    {
      step: "03",
      title: "Automated Cold Email Copywriting",
      desc: "How our GPT-4o engine drafts hyper-personalized B2B value propositions with 84%+ open rates and 1-click Gmail sync.",
      tag: "Email Drafter",
    },
    {
      step: "04",
      title: "Closing 5K–20K MAD Monthly Retainers",
      desc: "How to generate compliant Moroccan devis, secure 50% upfront bank deposits, and deliver automated AI bots with zero coding.",
      tag: "Devis & Facture",
    },
  ];

  return (
    <section
      id="vsl"
      dir={dir}
      className="relative py-20 sm:py-28 bg-[#FAFBFE] overflow-hidden border-t border-slate-200/70"
    >
      {/* Background ambient light aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-violet-200/40 via-cyan-100/30 to-emerald-100/30 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-orange-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-5 text-xs font-bold text-slate-800 tracking-wide uppercase"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>12-Minute Masterclass • Live Breakdown</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-[1.18] mb-5 text-balance"
          >
            See How The Autonomous{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
              Workspace Closes Clients
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Watch the complete behind-the-scenes walkthrough: from scraping Casablanca & Rabat leads to launching Darija WhatsApp voice pitches and generating 15,000 MAD contracts.
          </motion.p>
        </div>

        {/* Video Player Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Subtle luminous border ring */}
          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-3 bg-white border border-slate-200/80 shadow-[0_20px_70px_-15px_rgba(15,23,42,0.12)]">
            {/* Top Browser Bar */}
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/60 rounded-t-[1.6rem] sm:rounded-t-[2.1rem] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-[11px] font-mono text-slate-400 hidden sm:inline">
                  eensell-workspace-masterclass.mp4
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  1080p HD
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  12:45 min
                </span>
              </div>
            </div>

            {/* Video Frame */}
            <div className="relative aspect-video rounded-b-[1.5rem] sm:rounded-b-[2rem] overflow-hidden bg-slate-950 group">
              {/* HTML5 Video element */}
              <video
                ref={videoRef}
                src="/landingpagevideo.mp4"
                poster="/images/VSL THUMB.jpg"
                className="w-full h-full object-cover"
                controls={isPlaying}
                playsInline
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />

              {/* Custom Poster Overlay when not playing */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handlePlayToggle}
                    className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-slate-950/30 backdrop-blur-[1px] transition-all group-hover:bg-slate-950/20"
                  >
                    {/* Actual High-Res Poster Image */}
                    <Image
                      src="/images/VSL THUMB.jpg"
                      alt="VSL Breakdown Masterclass"
                      fill
                      className="object-cover -z-10 brightness-[0.92] group-hover:scale-[1.01] transition-transform duration-500"
                      priority
                    />

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent -z-10" />

                    {/* Pulsing Central Play Button */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-24 h-24 rounded-full bg-white/20 animate-ping" />
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 text-slate-950 fill-slate-950" />
                      </div>
                    </div>

                    {/* Badge below Play Button */}
                    <div className="mt-6 px-4 py-2 rounded-full bg-slate-950/80 border border-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#FF6B4A]" />
                      <span>Click to Watch the 12-Minute Blueprint</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Social Proof Bar below Video */}
          <div className="mt-5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Over 2,400+ Moroccan agency founders watched this week</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Case Study
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No Card Required
              </span>
            </div>
          </div>
        </motion.div>

        {/* 4 Key Takeaways Bento Grid */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              What You Will Discover Inside This Breakdown
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Four fundamental pillars of building a 30,000 MAD/month B2B AI agency in Morocco.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {takeaways.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-slate-900 transition-colors font-mono">
                      {item.step}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.tag}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-950 mb-2 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Tested & Proven Angle</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick CTA Pill */}
        <div className="mt-12 text-center">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="h-12 px-8 rounded-xl text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <span>Get Immediate Workspace Access</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
