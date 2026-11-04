"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Check,
  Sparkles,
  ArrowRight,
  Play,
  ShieldCheck,
  Zap,
  MapPin,
  MessageSquare,
  Mail,
  Bot,
  Users,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function HeroSection() {
  const { t, dir, isRTL } = useLanguage();

  return (
    <section
      dir={dir}
      className="relative min-h-screen pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 flex flex-col items-center justify-center overflow-hidden bg-white text-slate-900"
    >
      {/* ── Ambient Web3 Light Mesh Gradients ── */}
      <div className="absolute top-0 inset-x-0 h-[650px] overflow-hidden pointer-events-none select-none z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

        {/* Multi-color ambient luminous glows */}
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-indigo-100/50 via-purple-50/40 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[80px] left-[15%] w-[450px] h-[350px] bg-cyan-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-[120px] right-[15%] w-[450px] h-[350px] bg-emerald-100/40 rounded-full blur-[120px]" />
      </div>

      {/* ── MAIN HERO CONTENT ── */}
      <div className="relative z-20 container max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Web3 Announcement Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md mb-8 group hover:border-slate-300 transition-colors"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            Eensell Workspace 3.0 • The Autonomous Moroccan B2B Engine
          </span>
          <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-700 transition-colors">
            &rarr;
          </span>
        </motion.div>

        {/* Clean Web3 High-Impact Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] mb-6 max-w-4xl text-balance"
        >
          Scale Your Moroccan B2B AI Agency{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
            On Complete Autopilot.
          </span>
        </motion.h1>

        {/* Minimalist Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium text-balance"
        >
          Scrape verified local decision-makers across Casablanca, Rabat & Marrakech, enrich WhatsApp phone numbers, and draft high-converting Darija & French pitches that close 10,000 to 30,000 MAD clients.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-12"
        >
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-13 px-8 text-sm sm:text-base font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get Immediate Workspace Access</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </Link>

          <a href="#vsl" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-13 px-7 text-sm sm:text-base font-bold bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 rounded-2xl shadow-xs transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-slate-900 text-slate-900 ml-0.5" />
              </div>
              <span>Watch 12-Min Breakdown</span>
            </Button>
          </a>
        </motion.div>

        {/* Live Verified Trust Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-500 pb-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>14,800+ Leads Extracted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>84.6% WhatsApp Open Rate</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Darija & French AI Copywriting</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>0 Coding Skills Required</span>
          </div>
        </motion.div>
      </div>

      {/* ── WORKSPACE DASHBOARD SHOWCASE (Eensell Workspace.png) ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 container max-w-6xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16"
      >
        {/* Glow halo behind dashboard */}
        <div className="absolute -inset-4 bg-gradient-to-r from-violet-200/50 via-cyan-100/40 to-emerald-100/50 rounded-[3rem] blur-2xl opacity-60 pointer-events-none" />

        {/* Browser Frame */}
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] p-2.5 sm:p-3.5 bg-white border border-slate-200/90 shadow-[0_25px_80px_-20px_rgba(15,23,42,0.14)]">
          {/* macOS Browser Header Bar */}
          <div className="px-4 py-3 bg-slate-50/90 border-b border-slate-200/70 rounded-t-[1.6rem] sm:rounded-t-[2.1rem] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-mono text-slate-500 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>https://workspace.eensell.agency/overview</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">
                Live Cloud Engine
              </span>
            </div>
          </div>

          {/* Real Workspace Screenshot Image */}
          <div className="relative overflow-hidden rounded-b-[1.5rem] sm:rounded-b-[2rem] bg-slate-900 border border-slate-200/60 shadow-inner">
            <Image
              src="/images/Eensell Workspace.png"
              alt="Eensell Workspace Dashboard"
              width={1800}
              height={1100}
              className="w-full h-auto object-cover"
              priority
            />

            {/* Subtle gloss reflections */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
          </div>

          {/* Floating Web3 Badge - Top Left */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.9 }}
            className="hidden md:flex absolute -top-5 -left-4 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black text-slate-900">Casablanca Scraper</p>
              <p className="text-[10px] text-slate-500 font-medium">+184 Dental Clinics Qualified</p>
            </div>
          </motion.div>

          {/* Floating Web3 Badge - Bottom Right */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 1.1 }}
            className="hidden md:flex absolute -bottom-5 -right-4 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black text-slate-900">WhatsApp Darija Pitch</p>
              <p className="text-[10px] text-emerald-600 font-bold">✓✓ Client Meeting Booked</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── VERIFIED PARTNERS / INTEGRATIONS MARQUEE ── */}
      <div className="relative z-20 w-full mt-20 pt-8 pb-4 border-t border-slate-100 bg-[#FAFAFA]/60">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">
            Natively Integrated With The Modern Tech Stack
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="font-extrabold text-sm sm:text-base text-slate-700 tracking-tight flex items-center gap-1.5">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span> Maps
            </span>

            <span className="font-bold text-sm sm:text-base text-slate-700 tracking-tight flex items-center gap-1.5">
              <span className="text-[#25D366]">●</span> WhatsApp Cloud
            </span>

            <span className="font-bold text-sm sm:text-base text-slate-700 tracking-tight flex items-center gap-1.5">
              OpenAI GPT-4o
            </span>

            <span className="font-bold text-sm sm:text-base text-slate-700 tracking-tight flex items-center gap-1.5">
              <span className="text-[#EA4335]">M</span> Gmail Engine
            </span>

            <span className="font-bold text-sm sm:text-base text-slate-700 tracking-tight flex items-center gap-1.5">
              Stripe & CIH Bank
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
