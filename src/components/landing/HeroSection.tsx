"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Lightbulb, Shield, Bot, Eye, MousePointer2 } from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function HeroSection() {
  const { t, dir, isRTL } = useLanguage();

  return (
    <section dir={dir} className="relative min-h-screen pt-32 md:pt-48 pb-12 md:pb-20 flex flex-col items-center justify-center overflow-hidden bg-[#FAFAFA]">
      
      {/* Abstract Orange Mesh Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#FF6B4A]/10 rounded-full blur-[120px]" />
      </div>

      {/* === SCATTERED FLOATING LOGOS === */}
      <div className="absolute inset-0 w-full max-w-[1200px] mx-auto pointer-events-none z-10 hidden md:block">
        
        {/* Top Left: Higgsfield (In focus, large) */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.2 }}
          className="absolute left-[3%] top-[20%]"
        >
          <div className="bg-white shadow-xl w-24 h-24 overflow-hidden rounded-[1.5rem] animate-float-slow flex items-center justify-center border border-zinc-200/50">
            <img src="https://www.google.com/s2/favicons?domain=higgsfield.ai&sz=128" alt="Higgsfield" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Middle Left: OpenAI (Out of focus, small) */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.4 }}
          className="absolute left-[3%] top-[50%]"
        >
          <div className="bg-white shadow-lg w-16 h-16 overflow-hidden rounded-2xl animate-float-delayed flex items-center justify-center border border-zinc-200/50 blur-[1px] opacity-90">
            <img src="https://github.com/openai.png" alt="OpenAI" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Top Right: Runway (Out of focus, medium) */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.3 }}
          className="absolute right-[3%] top-[15%]"
        >
          <div className="bg-white shadow-xl w-[80px] h-[80px] overflow-hidden rounded-2xl animate-float-delayed flex items-center justify-center border border-zinc-200/50 blur-[1.5px] opacity-80">
            <img src="https://github.com/runwayml.png" alt="Runway" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Middle Right: PayPal (In focus, large) */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.5 }}
          className="absolute right-[5%] top-[42%]"
        >
          <div className="bg-white shadow-2xl w-24 h-24 overflow-hidden rounded-[1.5rem] animate-float-slow flex items-center justify-center border border-zinc-200/50">
            <img src="https://cdn.simpleicons.org/paypal/00457C" alt="PayPal" className="w-full h-full object-contain p-5" />
          </div>
        </motion.div>

        {/* Floating Right Inner: Claude (Out of focus, small) */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.6 }}
          className="absolute right-[18%] top-[32%]"
        >
          <div className="bg-white shadow-md w-14 h-14 overflow-hidden rounded-xl animate-float-delayed flex items-center justify-center border border-zinc-200/50 blur-[0.5px] opacity-95">
            <img src="https://cdn.simpleicons.org/claude/black" alt="Claude" className="w-full h-full object-contain p-2.5" />
          </div>
        </motion.div>
        
      </div>

      {/* === HERO TEXT CONTENT === */}
      <div className="relative z-30 container max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Massive Clean Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-black text-zinc-900 tracking-tight leading-[1.15] mb-8 w-full"
        >
          <span className="block">{t("hero_headline_1")}</span>
          <span className="block">{t("hero_headline_2")}</span>
          <span className="block text-[#FF6B4A]">{t("hero_headline_3")}</span>
        </motion.h1>

        {/* Minimalist Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          {t("hero_sub")}
        </motion.p>

        {/* Bright Coral CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <Link href="/sign-up">
            <Button
              size="lg"
              className="h-14 px-10 text-lg font-bold bg-[#FF6B4A] hover:bg-[#E85A3B] text-white rounded-2xl shadow-[0_12px_24px_-8px_rgba(255,107,74,0.5)] transition-all hover:-translate-y-1"
            >
              {t("hero_cta_primary")}
            </Button>
          </Link>
        </motion.div>

      </div>

      {/* === DASHBOARD VIDEO SHOWCASE === */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-20 container max-w-5xl mx-auto px-6 mt-16 sm:mt-24 pb-10"
      >
        {/* Premium Thin Orange Frame */}
        <div className="relative w-full p-[2px] sm:p-[3px] bg-gradient-to-br from-[#FF6B4A]/60 to-[#D14526]/60 backdrop-blur-md rounded-[1.5rem] lg:rounded-[2.5rem] shadow-[0_0_80px_-15px_rgba(255,107,74,0.4)]">
          <div className="overflow-hidden rounded-xl lg:rounded-[2rem] bg-zinc-900 shadow-inner relative aspect-video">
            <video
              src="/dashboard-video.mp4"
              poster="/dashboard.png"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* === FULL-WIDTH INFINITE MARQUEE === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="relative z-30 w-full bg-[#D14526] py-3 mt-8 border-y border-white/20 shadow-xl overflow-hidden"
      >
        <div className="marquee-track flex w-max items-center gap-8">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 text-white font-bold text-sm sm:text-base tracking-widest uppercase whitespace-nowrap">
              <span>Accès à vie pour 200Dh</span>
              <span className="text-white/40 text-xs">✦</span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
