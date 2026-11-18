"use client";

import { useState, useRef, useEffect } from "react";
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
  Maximize2,
  Star,
  Users,
  Flame,
  Zap,
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
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-slate-900 dark:fill-white" xmlns="http://www.w3.org/2000/svg">
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
  {
    name: "Apify Cloud",
    category: "Data Extraction",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#00A651]" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00A651" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
  {
    name: "Stripe & CIH",
    category: "Retainers & Invoicing",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#635BFF]" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.5 12.521.5 6.084.5 1.77 3.843 1.77 9.537c0 5.86 5.485 6.84 8.784 8.077 2.378.89 3.197 1.624 3.197 2.617 0 1.015-.905 1.572-2.39 1.572-2.41 0-5.11-1.127-6.937-2.188l-.946 5.626c1.69.832 4.673 1.517 7.883 1.517 6.643 0 10.868-3.19 10.868-9.356 0-5.69-5.263-6.903-8.253-8.252z"/>
      </svg>
    ),
  },
];

export function HeroSection() {
  const { dir, t, isRTL, language } = useLanguage();

  return (
    <section
      dir={dir}
      className="relative pt-28 sm:pt-36 md:pt-40 pb-12 sm:pb-16 flex flex-col items-center justify-center overflow-hidden bg-white text-slate-900"
    >
      {/* ── Ambient Web3 Light Mesh Gradients ── */}
      <div className="absolute top-0 inset-x-0 h-[650px] overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-orange-100/40 via-amber-50/40 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[80px] left-[10%] w-[450px] h-[350px] bg-orange-100/30 rounded-full blur-[130px]" />
        <div className="absolute top-[120px] right-[10%] w-[450px] h-[350px] bg-emerald-100/30 rounded-full blur-[130px]" />
      </div>

      {/* ── MAIN HERO HEADER (High Trust, Authority & Social Proof) ── */}
      <div className="relative z-20 container max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Authority & Trust Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs mb-5 group hover:border-orange-500/40 transition-colors"
        >
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-800 tracking-wide">
            {t("hero_v2_badge")}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider">
            +70,000 Membres
          </span>
        </motion.div>

        {/* Refined, Prestigious Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-black text-slate-950 tracking-tight leading-[1.18] mb-4 max-w-3xl text-balance"
        >
          {t("hero_v2_title_1")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-orange-600 to-amber-600">
            {t("hero_v2_title_2")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed font-medium text-balance"
        >
          {t("hero_v2_sub")}
        </motion.p>

        {/* CTA Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-8"
        >
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>{t("hero_v2_cta_primary")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Button
            size="lg"
            variant="outline"
            onClick={() => document.getElementById("vsl-player")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full sm:w-auto h-12 px-6 text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border-slate-200 rounded-xl shadow-2xs transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <div className="w-4 h-4 rounded-full bg-orange-50 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-orange-600 text-orange-600 ml-0.5" />
            </div>
            <span>{t("hero_v2_cta_secondary")}</span>
          </Button>
        </motion.div>
      </div>

      {/* ── THE VSL FRAME (Clean, Lightweight Video Player Frame) ── */}
      <motion.div
        id="vsl-player"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="relative z-20 container max-w-4xl mx-auto px-4 sm:px-6"
      >
        {/* Glowing Rim Frame Container */}
        <div className="relative rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-300 dark:border-slate-800 shadow-[0_25px_80px_-15px_rgba(249,115,22,0.18)]">
          
          {/* Subtle Live Badge at Top of Video Frame */}
          <div className="px-4 py-2 bg-slate-950 text-slate-400 border-b border-slate-800/80 rounded-t-xl sm:rounded-t-2xl flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-bold text-slate-200">
                {isRTL ? "عرض تقديمي مباشر • Eensell University V2" : "EXCLUSIF • Démonstration Pratique B2B Maroc"}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Video Breakdown</span>
            </div>
          </div>

          {/* Empty Video Frame Area */}
          <div className="relative rounded-b-xl sm:rounded-b-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black aspect-video flex flex-col items-center justify-center p-6 text-center group border border-white/5 select-none">
            {/* Ambient Background Grid & Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Play Icon Frame */}
            <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_35px_rgba(249,115,22,0.45)] group-hover:scale-110 transition-transform duration-300">
              <Play className="w-7 h-7 sm:w-8 sm:h-8 text-slate-950 fill-slate-950 ml-1" />
            </div>

            <div className="relative z-10 mt-5 space-y-1">
              <p className="text-sm sm:text-base font-bold text-white tracking-wide">
                {isRTL
                  ? "فيديو الشرح التقديمي • Eensell University V2"
                  : language === "fr"
                  ? "Démonstration Complète Eensell University V2"
                  : "Official Eensell University V2 Breakdown"}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {isRTL
                  ? "انقر على زر الاشتراك بالأسفل للوصول إلى كافة الدروس ومساحة العمل"
                  : language === "fr"
                  ? "Découvrez comment lancer votre agence IA au Maroc pas à pas"
                  : "Complete step-by-step agency launch blueprint"}
              </p>
            </div>
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
            <span>{t("hero_v2_pill_1")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("hero_v2_pill_2")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("hero_v2_pill_3")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t("hero_v2_pill_4")}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── INFINITE SCROLL TECH STACK MARQUEE ── */}
      <div className="relative z-20 w-full mt-16 pt-8 border-t border-slate-200/80 bg-gradient-to-b from-[#FAFAFA]/90 to-white overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4 text-center mb-6">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-2">
            <Zap className="w-3.5 h-3.5 text-orange-500" />
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
        <div className="relative w-full overflow-hidden py-2">
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Infinite Motion Scroll Track */}
          <motion.div
            animate={{ x: isRTL ? ["0%", "50%"] : ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 32 }}
            className="flex items-center w-max gap-4 sm:gap-6 hover:[animation-play-state:paused]"
          >
            {[...techStack, ...techStack, ...techStack].map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-orange-500/40 transition-all duration-300 group shrink-0"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                    {tech.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
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
