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
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function HeroSection() {
  const { dir, t, isRTL, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay with sound on landing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // First attempt: Autoplay with sound unmuted
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch((error) => {
          // If browser policy blocks sound autoplay on initial load:
          // Play muted immediately and allow instant unmute on first user click anywhere
          console.log("Unmuted autoplay restricted by browser policy; starting muted:", error);
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    }

    const handleFirstUserGesture = () => {
      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
      window.removeEventListener("click", handleFirstUserGesture);
      window.removeEventListener("touchstart", handleFirstUserGesture);
    };

    window.addEventListener("click", handleFirstUserGesture, { once: true });
    window.addEventListener("touchstart", handleFirstUserGesture, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstUserGesture);
      window.removeEventListener("touchstart", handleFirstUserGesture);
    };
  }, []);

  const handleUnmute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(() => {});
    }
  };

  const handlePlayToggle = () => {
    if (!videoRef.current) {
      setIsPlaying(true);
      return;
    }

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.muted = false;
      setIsMuted(false);
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
            {t("hero_v2_badge")}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-700 transition-colors rtl:rotate-180">
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
          {t("hero_v2_title_1")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
            {t("hero_v2_title_2")}
          </span>
        </motion.h1>

        {/* Refined, Compact Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed font-medium text-balance"
        >
          {t("hero_v2_sub")}
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
              <span>{t("hero_v2_cta_primary")}</span>
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
            <span>{isPlaying ? "Pause" : t("hero_v2_cta_secondary")}</span>
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
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]">
          <video
            ref={videoRef}
            src="/landingpagevideo.mp4"
            poster="/images/VSL THUMB.jpg"
            className="w-full aspect-video object-cover block"
            controls
            autoPlay
            playsInline
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />

          {/* Floating unmute helper button if initial unmuted autoplay was gated by browser policy */}
          {isMuted && (
            <button
              onClick={handleUnmute}
              className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-slate-950/90 hover:bg-black text-white border border-white/20 shadow-xl backdrop-blur-md text-xs sm:text-sm font-bold transition-all hover:scale-105 cursor-pointer"
            >
              <VolumeX className="w-4 h-4 text-amber-400" />
              <span>
                {isRTL
                  ? "انقر لتشغيل الصوت 🔊"
                  : language === "fr"
                  ? "Activer le son 🔊"
                  : "Tap to unmute sound 🔊"}
              </span>
            </button>
          )}
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
