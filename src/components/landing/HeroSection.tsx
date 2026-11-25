"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Play,
  ShieldCheck,
  CheckCircle2,
  Star,
  Zap,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";

// Tech stack logo definitions with authentic SVG branding
const techStack = [
  {
    name: "OpenAI GPT-4o",
    category: "AI Brain & Reasoning",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#10a37f]" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829 14.6174 7.2144a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4022-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
      </svg>
    ),
  },
  {
    name: "Make.com",
    category: "Workflow Engine",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#6D00CC"/>
        <path d="M5 12L9.5 7.5L13 11L9.5 14.5L5 12Z" fill="#00D2D2"/>
        <path d="M12.5 11L16 7.5L20 12L16 16.5L12.5 13V11Z" fill="#FF00A0"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp Cloud API",
    category: "Receptionist Bot",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9.07 7.42 8.85 7.66C8.63 7.9 8 8.49 8 9.69C8 10.89 8.88 12.05 9 12.21C9.12 12.37 10.7 14.82 13.14 15.87C13.72 16.12 14.17 16.27 14.53 16.38C15.11 16.57 15.64 16.54 16.06 16.48C16.53 16.41 17.5 15.89 17.7 15.32C17.9 14.76 17.9 14.28 17.84 14.18C17.78 14.08 17.62 14.02 17.38 13.9C17.14 13.78 15.96 13.2 15.74 13.12C15.52 13.04 15.36 13 15.2 13.24C15.04 13.48 14.58 14.02 14.44 14.18C14.3 14.34 14.16 14.36 13.92 14.24C13.68 14.12 12.91 13.87 11.99 13.05C11.28 12.42 10.8 11.64 10.66 11.4C10.52 11.16 10.65 11.03 10.77 10.91C10.88 10.8 11.02 10.62 11.14 10.48C11.26 10.34 11.3 10.24 11.38 10.08C11.46 9.92 11.42 9.78 11.36 9.66C11.3 9.54 10.84 8.41 10.65 7.95C10.46 7.5 10.27 7.56 10.13 7.56C10 7.56 9.8 7.55 9.6 7.55"/>
      </svg>
    ),
  },
  {
    name: "Anthropic Claude",
    category: "System Prompts",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#D97706]" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.87 14.28c-.28.45-.73.68-1.27.68-.42 0-.81-.14-1.12-.41l-2.43-2.14-1.28 1.43v.83c0 .54-.44.98-.98.98s-.98-.44-.98-.98v-7.34c0-.54.44-.98.98-.98s.98.44.98.98v3.42l3.41-3.81c.31-.35.72-.53 1.18-.53.52 0 .96.2 1.25.58.3.38.35.84.15 1.33l-2.73 3.05 3.01 2.65c.38.33.5.79.33 1.26-.08.21-.23.44-.5.7z"/>
      </svg>
    ),
  },
  {
    name: "Google Maps",
    category: "Lead Extraction",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335"/>
        <circle cx="12" cy="9" r="2.5" fill="#4285F4"/>
      </svg>
    ),
  },
  {
    name: "ElevenLabs Voice",
    category: "Audio Voice Notes",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 3h3v18h-3V3zm10 0h3v18h-3V3z" />
      </svg>
    ),
  },
  {
    name: "n8n Automation",
    category: "Self-Hosted Workflows",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#EA4B71]" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 12a4.5 4.5 0 0 1 4.5-4.5h2.2a2.3 2.3 0 0 1 2.3 2.3v.4a2.3 2.3 0 0 1-2.3 2.3H7a2.2 2.2 0 0 0-2.2 2.2 2.2 2.2 0 0 0 2.2 2.2h8.6a2.2 2.2 0 0 0 2.2-2.2 2.2 2.2 0 0 0-2.2-2.2h-2.2a2.3 2.3 0 0 1-2.3-2.3v-.4a2.3 2.3 0 0 1 2.3-2.3H17a4.5 4.5 0 0 1 4.5 4.5 4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 12z" />
      </svg>
    ),
  },
  {
    name: "Gmail & SMTP",
    category: "B2B Cold Email",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#EA4335" />
      </svg>
    ),
  },
];

export function HeroSection() {
  const { dir, t, isRTL, language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.setAttribute("muted", "");
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback handled gracefully
        });
      }
    }
  }, []);

  return (
    <section
      dir={dir}
      className="relative w-full overflow-hidden flex flex-col justify-between items-center text-center bg-black text-white min-h-[92svh] md:min-h-[85vh] md:aspect-video aspect-[9/16]"
    >
      {/* ── BACKGROUND VIDEO LOOP WITH ASPECT RATIO 16:9 (Laptop) & 9:16 (Mobile) ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none">
        <video
          ref={videoRef}
          src="/herovideobackground.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/herovideobackground_frame0.jpg"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        >
          <source src="/herovideobackground.mp4" type="video/mp4" />
          <source src="/herovideobackground.MOV" type="video/quicktime" />
        </video>

        {/* ── DARK SUBTLE OVERLAY (Clear video visibility with crisp contrast) ── */}
        <div className="absolute inset-0 bg-black/52" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.65)_100%)]" />

        {/* ── SIGNATURE ORANGE-TO-AMBER AMBIENT TOP LIGHT ── */}
        <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-orange-500/20 via-amber-500/5 to-transparent pointer-events-none" />
      </div>

      {/* ── FOREGROUND CONTENT (Centered Hero Text & Actions) ── */}
      <div className="relative z-20 container max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center my-auto pt-24 sm:pt-32 md:pt-36 pb-8">
        {/* Authority & Trust Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/20 shadow-xl mb-6 backdrop-blur-md group hover:border-orange-500/50 transition-colors"
        >
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-200 tracking-wide">
            {t("hero_v2_badge")}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider">
            1,370 Membres
          </span>
        </motion.div>

        {/* Massive Hooky Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-black text-white tracking-tight leading-[1.12] mb-6 max-w-4xl text-balance drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
        >
          {t("hero_v2_title_1")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 drop-shadow-sm">
            {t("hero_v2_title_2")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200/90 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal text-balance drop-shadow-md"
        >
          {t("hero_v2_sub")}
        </motion.p>

        {/* CTA Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-8"
        >
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-13 px-9 text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl shadow-[0_12px_45px_-5px_rgba(249,115,22,0.6)] transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 border border-orange-400/30 group"
            >
              <span>{t("hero_v2_cta_primary")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <a href="#vsl-player" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-13 px-7 text-xs sm:text-sm md:text-base font-bold bg-slate-900/80 hover:bg-slate-800 text-white border-white/20 backdrop-blur-md rounded-2xl shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2.5"
            >
              <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-400/40 flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-orange-400 text-orange-400 ml-0.5 rtl:rotate-180" />
              </div>
              <span>{t("hero_v2_cta_secondary")}</span>
            </Button>
          </a>
        </motion.div>

        {/* Live Verified Trust Metrics below the Video */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-300 drop-shadow"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t("hero_v2_pill_1")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t("hero_v2_pill_2")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t("hero_v2_pill_3")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t("hero_v2_pill_4")}</span>
          </div>
        </motion.div>
      </div>

      {/* ── INFINITE SCROLL TECH STACK MARQUEE (Base of Hero) ── */}
      <div className="relative z-20 w-full pt-6 pb-6 border-t border-white/10 bg-gradient-to-b from-black/60 to-black/90 backdrop-blur-md overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4 text-center mb-4">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>
              {isRTL
                ? "التقنيات والأنظمة العالمية المعتمدة في برامجنا"
                : language === "fr"
                ? "LES TECHNOLOGIES ET MOTEURS IA INTÉGRÉS DANS NOS SYSTÈMES"
                : "WORLD-CLASS AI ENGINES & TECHNOLOGIES POWERING OUR PLATFORM"}
            </span>
          </p>
        </div>

        {/* Gradients for smooth fade on marquee edges */}
        <div className="relative w-full overflow-hidden py-1">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

          {/* Infinite Motion Scroll Track */}
          <motion.div
            animate={{ x: isRTL ? ["0%", "50%"] : ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
            style={{ willChange: "transform" }}
            className="flex items-center w-max gap-4 sm:gap-6 hover:[animation-play-state:paused]"
          >
            {[...techStack, ...techStack, ...techStack].map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-md hover:border-orange-500/50 transition-all duration-300 group shrink-0"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-xs font-black text-white group-hover:text-orange-400 transition-colors">
                    {tech.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {tech.category}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
