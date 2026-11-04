"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Check,
  Sparkles,
  ArrowRight,
  Play,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function HeroSection() {
  const { dir } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <section
      dir={dir}
      className="relative pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 flex flex-col items-center justify-center overflow-hidden bg-white text-slate-900"
    >
      {/* ── Ambient Web3 Light Mesh Gradients ── */}
      <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-100/50 via-purple-50/40 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[80px] left-[15%] w-[400px] h-[300px] bg-cyan-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[120px] right-[15%] w-[400px] h-[300px] bg-emerald-100/40 rounded-full blur-[120px]" />
      </div>

      {/* ── MAIN HERO CONTENT (Compact, Elegant, High-End Web3) ── */}
      <div className="relative z-20 container max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Subtle Web3 Pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs mb-5 group hover:border-slate-300 transition-colors"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">
            Eensell Workspace 3.0 &bull; University V2
          </span>
          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
            &rarr;
          </span>
        </motion.div>

        {/* Refined, Scaled Headline (Smaller & Crisp) */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black text-slate-950 tracking-tight leading-[1.18] mb-4 max-w-3xl text-balance"
        >
          Scale Your Moroccan B2B AI Agency{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
            On Complete Autopilot.
          </span>
        </motion.h1>

        {/* Refined, Compact Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed font-medium text-balance"
        >
          Scrape verified local decision-makers across Casablanca, Rabat & Marrakech, enrich WhatsApp numbers, and close 10,000 to 30,000 MAD clients with autonomous AI.
        </motion.p>

        {/* Compact CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-8"
        >
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 px-7 text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Join Eensell University V2 &bull; 499 MAD</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            onClick={handlePlayToggle}
            className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border-slate-200 rounded-xl shadow-2xs transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-slate-900 text-slate-900 ml-0.5" />
            </div>
            <span>{isPlaying ? "Pause Video" : "Watch 12-Min Breakdown"}</span>
          </Button>
        </motion.div>
      </div>

      {/* ── THE VSL VIDEO COMPONENT (Right here in the Hero!) ── */}
      <motion.div
        id="vsl-player"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="relative z-20 container max-w-4xl mx-auto px-4 sm:px-6"
      >
        <div className="relative rounded-[2rem] sm:rounded-[2.2rem] p-2 sm:p-2.5 bg-white border border-slate-200/90 shadow-[0_20px_70px_-15px_rgba(15,23,42,0.12)]">
          {/* Top Browser Bar */}
          <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200/60 rounded-t-[1.6rem] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[11px] font-mono text-slate-400 hidden sm:inline">
                eensell-masterclass-breakdown.mp4
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                1080p HD
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                12:45 min
              </span>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video rounded-b-[1.5rem] overflow-hidden bg-slate-950 group">
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

            {/* Poster Overlay when Paused */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handlePlayToggle}
                  className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center bg-slate-950/25 backdrop-blur-[1px] transition-all group-hover:bg-slate-950/15"
                >
                  <Image
                    src="/images/VSL THUMB.jpg"
                    alt="VSL Masterclass Thumbnail"
                    fill
                    className="object-cover -z-10 brightness-[0.92] group-hover:scale-[1.01] transition-transform duration-500"
                    priority
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent -z-10" />

                  {/* Pulsing Play Button */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-20 h-20 rounded-full bg-white/20 animate-ping" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1 text-slate-950 fill-slate-950" />
                    </div>
                  </div>

                  <div className="mt-4 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FF6B4A]" />
                    <span>Click to Watch The 12-Minute Blueprint</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Verified Trust Metrics below the Video */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-500"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>14,800+ Leads Extracted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>84.6% WhatsApp Open Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Darija & French AI Copywriting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>0 Coding Skills Required</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── INTEGRATIONS MARQUEE ── */}
      <div className="relative z-20 w-full mt-14 pt-6 border-t border-slate-100 bg-[#FAFAFA]/70">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Natively Integrated With The Modern Tech Stack
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 opacity-75 grayscale hover:grayscale-0 transition-all text-xs sm:text-sm font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span> Maps
            </span>

            <span className="flex items-center gap-1">
              <span className="text-[#25D366]">●</span> WhatsApp Cloud
            </span>

            <span>OpenAI GPT-4o</span>

            <span className="flex items-center gap-1">
              <span className="text-[#EA4335]">M</span> Gmail Engine
            </span>

            <span>Stripe & CIH Bank</span>
          </div>
        </div>
      </div>
    </section>
  );
}
