"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Timer, Users, ChevronRight, Play, ArrowRight, ArrowDown,
  CheckCircle2, Sparkles, TrendingUp, DollarSign, Camera,
  Mic, FileText, Lock, Upload, MessageCircle, Zap, Star,
  Eye, Target, Award
} from "lucide-react";
import Link from "next/link";

/* ───────────────────────────────────────────────
   COUNTDOWN HOOK — 48 h from first visit
   ─────────────────────────────────────────────── */
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });

  useEffect(() => {
    const tick = () => {
      const d = targetDate.getTime() - Date.now();
      if (d <= 0) return setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        hours: Math.floor(d / 3_600_000),
        minutes: Math.floor((d % 3_600_000) / 60_000),
        seconds: Math.floor((d % 60_000) / 1_000),
      });
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

/* ───────────────────────────────────────────────
   ANIMATED COUNTER
   ─────────────────────────────────────────────── */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / 40;
    const id = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(id); }
      else setDisplay(Math.floor(start));
    }, 30);
    return () => clearInterval(id);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

/* ───────────────────────────────────────────────
   PAGE
   ─────────────────────────────────────────────── */
export default function AiUgcPage() {
  const [targetDate] = useState(() => new Date(Date.now() + 48 * 3_600_000));
  const { hours, minutes, seconds } = useCountdown(targetDate);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-purple-500/30 flex flex-col overflow-x-hidden">

      {/* ═══════════  URGENCY BANNER  ═══════════ */}
      <div className="bg-gradient-to-r from-[#FF6B4A] via-red-500 to-purple-600 text-white py-3 px-4 text-center text-sm font-bold tracking-wide flex items-center justify-center gap-3 z-50 relative">
        <Timer className="w-4 h-4 animate-pulse" />
        <span className="hidden sm:inline">⚡ ONLY 50 SPOTS.</span>
        <span>Price jumps to 1,999 MAD in</span>
        <span className="font-mono bg-black/30 px-2.5 py-1 rounded-md ml-1 tracking-widest text-xs">
          {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s
        </span>
      </div>

      {/* ═══════════  NAVBAR  ═══════════ */}
      <nav className="border-b border-white/5 bg-[#030303]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Eensell University" className="h-14 sm:h-18 w-auto object-contain brightness-0 invert" />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#opportunity" className="hover:text-white transition-colors">Opportunity</Link>
            <Link href="#curriculum" className="hover:text-white transition-colors">Curriculum</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Enroll</Link>
          </div>
          <Link href="#pricing">
            <button className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 cursor-pointer">
              Claim Your Spot <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 relative">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-purple-900/15 blur-[180px] rounded-full" />
        <div className="pointer-events-none absolute top-[600px] -right-40 w-[600px] h-[600px] bg-[#FF6B4A]/8 blur-[160px] rounded-full" />
        <div className="pointer-events-none absolute top-[1400px] -left-40 w-[500px] h-[500px] bg-blue-900/10 blur-[140px] rounded-full" />

        {/* ═══════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════ */}
        <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 px-6">
          <div className="container max-w-6xl mx-auto text-center flex flex-col items-center">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-sm font-medium mb-10 backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Enrollment Open — Limited to 50 Participants
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.02]">
              The AI UGC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] via-purple-400 to-blue-400">
                Master Course.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Learn exactly how to generate profitable user-generated content ads using artificial intelligence. No camera. No actors. No studio.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <Link href="#pricing">
                <button className="bg-white text-black hover:bg-zinc-200 px-10 py-4.5 rounded-full text-lg font-bold transition-all shadow-[0_0_50px_rgba(255,255,255,0.12)] hover:shadow-[0_0_70px_rgba(255,255,255,0.22)] flex items-center gap-2 cursor-pointer">
                  Enroll Now — 1,000 MAD <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="#curriculum" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                See full curriculum <ArrowDown className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex items-center gap-6 text-zinc-500 text-xs font-medium mt-4 mb-16">
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Secure Payment</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 50 Spots Only</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Instant Access</span>
            </motion.div>

          </div>

          {/* Infinite Scroll Marquee of AI UGC Models */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="w-full relative overflow-hidden mt-4">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10 pointer-events-none"></div>

            <div className="flex gap-5 animate-[marquee-ugc_30s_linear_infinite] hover:[animation-play-state:paused] w-max">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-5 shrink-0">
                  {[
                    { src: "/ugc-model-1.png", label: "Skincare Ad" },
                    { src: "/ugc-model-4.png", label: "Supplement Review" },
                    { src: "/ugc-model-3.png", label: "Beauty Routine" },
                    { src: "/ugc-model-2.png", label: "Tech Review" },
                    { src: "/ugc-model-5.png", label: "Unboxing" },
                    { src: "/ugc-model-6.png", label: "Smartwatch Ad" },
                  ].map((item, i) => (
                    <div key={i} className="w-[280px] shrink-0 group/card">
                      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl group-hover/card:border-white/20 transition-all duration-300">
                        <img src={item.src} alt={item.label} className="w-full aspect-[4/5] object-cover group-hover/card:scale-105 transition-transform duration-700" />
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                          <p className="text-white text-sm font-bold">{item.label}</p>
                          <p className="text-zinc-400 text-xs">AI Generated</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

        </section>

        {/* ═══════════════════════════════════════════
            THE OPPORTUNITY
        ═══════════════════════════════════════════ */}
        <section id="opportunity" className="py-28 md:py-36 px-6 relative border-t border-white/5">
          <div className="container max-w-6xl mx-auto">

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-20">
              <p className="text-[#FF6B4A] font-bold text-sm tracking-widest uppercase mb-4">The Opportunity</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
                Brands pay thousands <br className="hidden md:block"/>for video ads every month.
              </h2>
              <p className="text-xl text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
                You can produce the <strong className="text-white font-semibold">exact same video quality</strong> using AI tools in under an hour. Build a highly requested technical skill and sell these videos to e-commerce stores and marketing agencies.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {[
                { icon: DollarSign, value: 5000, suffix: "+", label: "MAD / month potential", color: "text-green-400" },
                { icon: Camera, value: 0, suffix: "", label: "Cameras needed", color: "text-purple-400", display: "0" },
                { icon: TrendingUp, value: 300, suffix: "%", label: "Demand growth in 2025", color: "text-blue-400" },
                { icon: Star, value: 1, suffix: " hour", label: "To produce a full ad", color: "text-[#FF6B4A]" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:border-white/20 transition-colors">
                  <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-4`} />
                  <p className="text-3xl md:text-4xl font-black text-white mb-1">
                    {stat.display !== undefined ? stat.display : <AnimatedNumber value={stat.value} suffix={stat.suffix} />}
                  </p>
                  <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Who it's for */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 rounded-3xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-8 text-center">This course is for you if...</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "You want to start a service-based business with AI",
                  "You're a freelancer looking for a high-income skill",
                  "You run an e-commerce store and want cheaper ads",
                  "You work at a marketing agency and want to 10x output",
                  "You're a content creator wanting to monetize AI skills",
                  "You have zero technical experience but are willing to learn",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WHAT YOU WILL LEARN (CURRICULUM)
        ═══════════════════════════════════════════ */}
        <section id="curriculum" className="py-28 md:py-36 px-6 relative border-t border-white/5">
          <div className="container max-w-6xl mx-auto">

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-24">
              <p className="text-purple-400 font-bold text-sm tracking-widest uppercase mb-4">The Curriculum</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">What You Will Learn.</h2>
              <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto">
                Four core pillars. Each one a standalone skill that clients will pay for.
              </p>
            </motion.div>

            <div className="space-y-36">

              {/* ── MODULE 1: Avatar Generation ── */}
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
                className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-black text-purple-400">01</span>
                    <span className="text-purple-400 font-bold text-sm tracking-widest uppercase">Module One</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-5 leading-tight">
                    Avatar Generation
                  </h3>
                  <p className="text-lg text-zinc-400 mb-8 font-light leading-relaxed">
                    Create photorealistic characters tailored to specific target audiences. You will learn to generate faces, expressions, and poses that feel completely real — designed to match any brand, niche, or demographic.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" /> Generate diverse, brand-matched AI avatars</li>
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" /> Control age, ethnicity, styling & expression</li>
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" /> Place them in realistic environments</li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 relative group">
                  <div className="absolute -inset-3 bg-purple-500/15 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
                  <div className="relative bg-zinc-900/80 rounded-3xl p-2 border border-white/10 shadow-2xl overflow-hidden">
                    <img src="/avatar-generation.png" alt="AI Avatar Generation" className="w-full rounded-2xl" />
                  </div>
                </div>
              </motion.div>

              {/* ── MODULE 2: Motion Control ── */}
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
                className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="relative group">
                  <div className="absolute -inset-3 bg-emerald-500/15 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
                  <div className="relative bg-zinc-900/80 rounded-3xl p-2 border border-white/10 shadow-2xl overflow-hidden">
                    <img src="/motion-control.png" alt="AI Motion Control" className="w-full rounded-2xl" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-black text-emerald-400">02</span>
                    <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Module Two</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-5 leading-tight">
                    Motion Control
                  </h3>
                  <p className="text-lg text-zinc-400 mb-8 font-light leading-relaxed">
                    Use tools like <strong className="text-white font-semibold">Hailuo AI</strong> and <strong className="text-white font-semibold">Kling AI</strong> to animate subtle human movements. You will learn to add natural breathing, blinking, and micro-expressions to static images — making them indistinguishable from real footage.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Animate static images with Hailuo AI</li>
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Add breathing, blinking & head movements</li>
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> Advanced motion with Kling AI</li>
                  </ul>
                </div>
              </motion.div>

              {/* ── MODULE 3: Voice & Lip Sync ── */}
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
                className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-2xl bg-[#FF6B4A]/20 border border-[#FF6B4A]/30 flex items-center justify-center text-sm font-black text-[#FF6B4A]">03</span>
                    <span className="text-[#FF6B4A] font-bold text-sm tracking-widest uppercase">Module Three</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-5 leading-tight">
                    Voice & Lip Sync
                  </h3>
                  <p className="text-lg text-zinc-400 mb-8 font-light leading-relaxed">
                    Implement audio technology with <strong className="text-white font-semibold">HeyGen</strong> to make your characters speak perfectly and naturally. The result is a video where a human appears to be genuinely talking — with accurate mouth movements, natural pauses, and emotional delivery.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-[#FF6B4A] shrink-0 mt-0.5" /> Perfect AI lip-sync with HeyGen</li>
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-[#FF6B4A] shrink-0 mt-0.5" /> Natural voice cloning & generation</li>
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-[#FF6B4A] shrink-0 mt-0.5" /> Multi-language voice dubbing</li>
                  </ul>
                </div>
                <div className="order-1 md:order-2 relative group">
                  <div className="absolute -inset-3 bg-[#FF6B4A]/15 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
                  <div className="relative bg-zinc-900/80 rounded-3xl p-2 border border-white/10 shadow-2xl overflow-hidden">
                    <img src="/voice-lipsync.png" alt="AI Voice & Lip Sync" className="w-full rounded-2xl" />
                  </div>
                </div>
              </motion.div>

              {/* ── MODULE 4: Direct Response Scripting ── */}
              <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
                className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="relative group">
                  <div className="absolute -inset-3 bg-blue-500/15 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none"></div>
                  <div className="relative bg-zinc-900/80 rounded-3xl p-2 border border-white/10 shadow-2xl overflow-hidden">
                    <img src="/script-writing.png" alt="Direct Response Scripting" className="w-full rounded-2xl" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm font-black text-blue-400">04</span>
                    <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">Module Four</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-5 leading-tight">
                    Direct Response Scripting
                  </h3>
                  <p className="text-lg text-zinc-400 mb-8 font-light leading-relaxed">
                    Write video ad scripts structured strictly to convert viewers into paying customers. You will learn the exact hook → problem → agitate → solution → CTA framework that top performance marketers use to generate millions in revenue.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Proven high-converting script frameworks</li>
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> Hook formulas that stop the scroll</li>
                    <li className="flex items-start gap-3 text-zinc-300"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" /> CTA structures that drive purchases</li>
                  </ul>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            THE TOOLS
        ═══════════════════════════════════════════ */}
        <section className="py-20 px-6 border-t border-white/5 bg-white/[0.01]">
          <div className="container max-w-5xl mx-auto text-center">
            <p className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-10">The AI tools you will master</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
              {[
                { name: "Higgsfield", desc: "AI Avatars", img: "/logo-higgsfield.svg" },
                { name: "Gemini", desc: "Google AI", img: "/logo-gemini.svg" },
                { name: "Veo 3", desc: "Google Labs", img: "/logo-veo3.svg" },
                { name: "HeyGen", desc: "Voice & Lip Sync", img: "/flow-logo.png" },
                { name: "Hailuo AI", desc: "Motion Generation", img: "/higgsfield-logo.png" },
                { name: "Kling AI", desc: "Advanced Animation", img: "/gemini-logo.png" },
              ].map((tool, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 hover:border-white/20 transition-colors hover:bg-white/[0.06]">
                  <img src={tool.img} alt={tool.name} className="h-8 w-8 rounded-lg object-contain" />
                  <div className="text-left">
                    <p className="text-white font-bold text-sm leading-none">{tool.name}</p>
                    <p className="text-zinc-500 text-xs">{tool.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            THE INVESTMENT
        ═══════════════════════════════════════════ */}
        <section id="pricing" className="py-28 md:py-36 px-6 relative border-t border-white/5">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-purple-600/8 blur-[150px] rounded-full" />

          <div className="container max-w-5xl mx-auto relative z-10">

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-16">
              <p className="text-[#FF6B4A] font-bold text-sm tracking-widest uppercase mb-4">The Investment</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">1,000 MAD.</h2>
              <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
                Selling just <strong className="text-white font-semibold">one AI UGC video</strong> to a single client covers your entire entry fee. Everything after that is pure profit.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-start">

              {/* Pricing Card */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#FF6B4A] via-purple-500 to-blue-500 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-500"></div>

                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col shadow-2xl">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">AI UGC Master Course</h3>
                      <p className="text-zinc-400 font-medium text-sm">Complete Program Access</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-600 line-through text-base font-mono">1,999 MAD</p>
                      <p className="text-4xl font-black text-white">1,000<span className="text-base text-zinc-500 font-normal ml-1">MAD</span></p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 border-t border-white/10 pt-6">
                    {[
                      "All 4 Modules + Live Coaching",
                      "2x Live Sessions per Week",
                      "Secret Prompt Library & Swipe File",
                      "Private Community Access",
                      "Direct Video Feedback from Instructor",
                      "Lifetime access to recordings",
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="text-zinc-300 font-medium text-sm">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Spots remaining */}
                  <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="font-medium text-zinc-400 text-sm">Spots Left</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-28 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-[#FF6B4A] w-[28%] rounded-full shadow-[0_0_8px_rgba(255,107,74,0.6)]"></div>
                      </div>
                      <span className="text-sm font-bold text-white font-mono">14/50</span>
                    </div>
                  </div>

                  <p className="text-center text-zinc-600 text-xs mb-4">
                    Once the 50 spots are filled, registration closes completely.
                  </p>

                  <button className="w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-xl text-lg font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 cursor-pointer">
                    Secure Your Access <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* How to Enroll Steps */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.15 }}
                className="flex flex-col gap-6">

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#FF6B4A]" />
                    How to Secure Your Spot
                  </h3>

                  <div className="space-y-6">
                    {[
                      { step: "1", icon: DollarSign, title: "Send your payment", desc: "Transfer 1,000 MAD to the bank account listed below.", color: "text-green-400 bg-green-500/20 border-green-500/30" },
                      { step: "2", icon: Camera, title: "Screenshot your receipt", desc: "Take a clear screenshot of your transfer confirmation.", color: "text-blue-400 bg-blue-500/20 border-blue-500/30" },
                      { step: "3", icon: Upload, title: "Upload or send via WhatsApp", desc: "Upload the receipt here or send it directly to my WhatsApp.", color: "text-purple-400 bg-purple-500/20 border-purple-500/30" },
                      { step: "4", icon: Zap, title: "Instant activation", desc: "Your account will be activated immediately upon receipt verification.", color: "text-[#FF6B4A] bg-[#FF6B4A]/20 border-[#FF6B4A]/30" },
                    ].map((s, i) => (
                      <div key={i} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl ${s.color.split(' ').slice(1).join(' ')} border flex items-center justify-center shrink-0`}>
                          <s.icon className={`w-5 h-5 ${s.color.split(' ')[0]}`} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{s.title}</p>
                          <p className="text-zinc-500 text-sm">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] cursor-pointer">
                  <MessageCircle className="w-6 h-6" />
                  Send Receipt on WhatsApp
                </a>

                <p className="text-zinc-600 text-xs text-center">
                  Questions? Send a message on WhatsApp and I will reply within minutes.
                </p>

              </motion.div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
          <div className="container max-w-3xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Eye className="w-10 h-10 text-[#FF6B4A] mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
                The brands are already looking for you.
              </h2>
              <p className="text-lg text-zinc-400 font-light mb-10 max-w-xl mx-auto">
                Every e-commerce store needs video ads. Every marketing agency needs faster production. Be the person they hire.
              </p>
              <Link href="#pricing">
                <button className="bg-white text-black hover:bg-zinc-200 px-10 py-4.5 rounded-full text-lg font-bold transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center gap-2 mx-auto cursor-pointer">
                  Claim Your Spot — 1,000 MAD <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

      </main>

      {/* ═══════════  FOOTER  ═══════════ */}
      <footer className="border-t border-white/10 py-12 bg-[#030303]">
        <div className="container max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Eensell University" className="h-12 w-auto object-contain brightness-0 invert" />
          </Link>
          <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} Eensell University. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
