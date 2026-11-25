"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function VslSection() {
  const { dir, t, isRTL } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section
      id="vsl-player"
      dir={dir}
      className="relative w-full py-16 sm:py-24 bg-black text-white overflow-hidden border-t border-white/5"
    >
      {/* ── AMBIENT STUDIO GLOW BEHIND VIDEO ── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-b from-orange-500/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* ── HOOKING HEADLINE & INTRO ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/30 shadow-lg mb-4 sm:mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="text-xs sm:text-sm font-black tracking-wide text-orange-400 uppercase">
              {t("vsl_badge")}
            </span>
          </motion.div>

          {/* Hook Title */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.2] sm:leading-[1.15] mb-4 text-white"
          >
            {t("vsl_hook_title_1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
              {t("vsl_hook_title_2")}
            </span>
          </motion.h2>

          {/* Hook Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            {t("vsl_hook_desc")}
          </motion.p>
        </div>

        {/* ── SIMPLE, CLEAN VSL FRAME ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95)] aspect-video group"
        >
          {/* Subtle Orange Glow Border Accent */}
          <div className="absolute -inset-px rounded-2xl sm:rounded-3xl pointer-events-none border border-orange-500/20 group-hover:border-orange-500/40 transition-colors duration-500" />

          {/* Native HTML5 Video Element */}
          <video
            ref={videoRef}
            src="/landingpagevideo.mp4"
            poster="/vsl_poster.jpg"
            controls={isPlaying}
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain bg-black"
          />

          {/* Play Overlay (Visible before video starts playing) */}
          {!isPlaying && (
            <div
              onClick={handlePlayClick}
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px] hover:bg-black/25 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer select-none group/play"
              role="button"
              aria-label="Play 12-Minute Breakdown Video"
            >
              {/* Pulsing Play Button */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange-500/30 animate-ping pointer-events-none" />
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(249,115,22,0.6)] group-hover/play:scale-110 transition-transform duration-300 border border-orange-300/40">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 rtl:rotate-180" />
                </div>
              </div>

              {/* Sub-text under Play button */}
              <p className="mt-4 text-xs sm:text-sm font-bold tracking-wide text-white drop-shadow-md flex items-center gap-2">
                <span>{t("hero_v2_cta_secondary")}</span>
                <span className="text-orange-400 font-extrabold">• 12:00</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* ── FAST-ACTION CTA BELOW VIDEO ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 sm:mt-12 flex flex-col items-center justify-center text-center"
        >
          <Link href="#pricing">
            <Button
              size="lg"
              className="rounded-full px-8 sm:px-10 py-6 sm:py-7 text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-[0_10px_35px_rgba(249,115,22,0.4)] hover:shadow-[0_15px_45px_rgba(249,115,22,0.55)] transition-all duration-300 hover:-translate-y-0.5 cursor-pointer border border-orange-400/40 flex items-center gap-3"
            >
              <span>{t("vsl_cta_button")}</span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </Button>
          </Link>

          {/* Micro-Trust Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t("vsl_guarantee_pill")}</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
              <span>{t("pricing_v2_sub")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
