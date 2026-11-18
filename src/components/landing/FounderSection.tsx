"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Target,
  Zap,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { type TranslationKey } from "@/lib/translations";

export function FounderSection() {
  const { dir, t, isRTL } = useLanguage();

  return (
    <section
      id="founder"
      dir={dir}
      className="relative py-24 sm:py-32 bg-white text-slate-900 overflow-hidden border-t border-slate-200/80"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-orange-100/60 via-amber-100/40 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-orange-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ── LEFT COLUMN: FOUNDER PORTRAIT ── */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            {/* Outer Warm Glow */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-orange-500/30 via-amber-400/20 to-orange-600/30 rounded-[3rem] blur-2xl opacity-75 pointer-events-none" />

            {/* Frame Container */}
            <div className="relative rounded-[2.5rem] p-2.5 sm:p-3 bg-slate-950 border border-orange-500/30 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.25)] group">
              <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-slate-900">
                <Image
                  src="/self portrait founder.png"
                  alt="Saad Kaabouche - Founder of Eensell"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Subtle dark gradient overlay at bottom for badge contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Top Badge: 70K+ Community */}
              <div className="absolute -top-4 -right-3 sm:-right-4 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 border border-slate-200/90 shadow-xl backdrop-blur-md">
                <div className="w-7 h-7 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-600 shadow-xs">
                  <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-pulse" />
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-[11px] font-black text-slate-950 leading-tight">
                    {t("founder_stat1_val" as TranslationKey)}
                  </p>
                  <p className="text-[9px] font-bold text-orange-600 uppercase tracking-wider">
                    {t("founder_badge_community" as TranslationKey)}
                  </p>
                </div>
              </div>

              {/* Floating Bottom Badge: Verified Founder */}
              <div className="absolute -bottom-4 -left-3 sm:-left-4 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/95 border border-orange-500/40 text-white shadow-2xl backdrop-blur-md">
                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                  SK
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-xs font-black text-white leading-tight">
                    {t("founder_name" as TranslationKey)}
                  </p>
                  <p className="text-[10px] text-amber-300 font-medium">
                    {t("founder_role" as TranslationKey)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: FOUNDER STORY & MANIFESTO ── */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-orange-600 font-extrabold text-xs uppercase tracking-wider w-fit shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>{t("founder_eyebrow" as TranslationKey)}</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.2]">
              {t("founder_title_1" as TranslationKey)}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-amber-500">
                {t("founder_title_2" as TranslationKey)}
              </span>
            </h2>

            {/* Story Paragraphs */}
            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p className="font-normal">
                {t("founder_p1" as TranslationKey)}
              </p>
              <p className="font-normal">
                {t("founder_p2" as TranslationKey)}
              </p>
            </div>

            {/* ── Magnetic Personal Quote Box ── */}
            <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-orange-200/80 shadow-xs">
              <span className="absolute -top-4 left-6 rtl:right-6 rtl:left-auto px-2 bg-white text-3xl font-serif text-orange-500 leading-none">
                “
              </span>
              <p className="text-sm sm:text-base font-semibold text-slate-900 italic leading-relaxed pt-1">
                {t("founder_quote" as TranslationKey)}
              </p>
              <div className="mt-4 pt-3 border-t border-orange-200/60 flex items-center justify-between">
                <span className="text-xs font-black text-slate-950">
                  — {t("founder_name" as TranslationKey)}
                </span>
                <span className="text-[11px] font-bold text-orange-600">
                  {t("founder_badge_serial" as TranslationKey)}
                </span>
              </div>
            </div>

            {/* ── 4-Stat Milestones Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
              <div className="rounded-2xl p-3.5 bg-slate-50 border border-slate-200/80 text-center">
                <p className="text-xl sm:text-2xl font-black text-slate-950">
                  {t("founder_stat1_val" as TranslationKey)}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                  {t("founder_stat1_label" as TranslationKey)}
                </p>
              </div>

              <div className="rounded-2xl p-3.5 bg-slate-50 border border-slate-200/80 text-center">
                <p className="text-xl sm:text-2xl font-black text-orange-600">
                  {t("founder_stat2_val" as TranslationKey)}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                  {t("founder_stat2_label" as TranslationKey)}
                </p>
              </div>

              <div className="rounded-2xl p-3.5 bg-slate-50 border border-slate-200/80 text-center">
                <p className="text-xl sm:text-2xl font-black text-slate-950">
                  {t("founder_stat3_val" as TranslationKey)}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                  {t("founder_stat3_label" as TranslationKey)}
                </p>
              </div>

              <div className="rounded-2xl p-3.5 bg-slate-50 border border-slate-200/80 text-center">
                <p className="text-xl sm:text-2xl font-black text-emerald-600">
                  {t("founder_stat4_val" as TranslationKey)}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">
                  {t("founder_stat4_label" as TranslationKey)}
                </p>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <Link href="#pricing">
                <Button
                  size="lg"
                  className="h-12 px-7 rounded-xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <span>Rejoindre la Communauté de Saad</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
