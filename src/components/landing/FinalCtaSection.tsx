"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Key,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function FinalCtaSection() {
  const { dir, t } = useLanguage();

  return (
    <section
      dir={dir}
      className="relative py-24 sm:py-36 bg-white text-slate-900 overflow-hidden border-t border-slate-200/70"
    >
      {/* ── Warm Orange-to-Amber Luminous Ambient Aura ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center">
        {/* Luxury Dark Gradient Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-14 lg:p-16 bg-gradient-to-b from-slate-950 via-slate-900 to-black border border-slate-800 shadow-[0_25px_80px_-15px_rgba(249,115,22,0.18)] flex flex-col items-center text-center overflow-hidden"
        >
          {/* Top ambient highlight line - Signature Orange to Orangish-Yellow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-600 via-amber-400 to-orange-500" />

          {/* Luxury Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/30 shadow-2xs text-xs font-bold text-amber-300 tracking-wide uppercase mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            <span>{t("fcta_badge")}</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6 max-w-3xl text-balance">
            {t("fcta_title_1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              {t("fcta_title_2")}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
            {t("fcta_sub")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto mb-10">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-13 px-9 text-sm sm:text-base font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-2xl shadow-[0_10px_35px_-5px_rgba(249,115,22,0.4)] transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 border border-orange-400/30"
              >
                <Key className="w-4 h-4 rtl:ml-1 ltr:mr-1" />
                <span>{t("fcta_cta_primary")}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>

            <a
              href="https://wa.me/212666065608?text=Bonjour%20Saad,%20j'aimerais%20en%20savoir%20plus%20sur%20Eensell%20University"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-13 px-8 text-sm sm:text-base font-bold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600 shadow-2xs rounded-2xl transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-orange-400" />
                <span>{t("fcta_cta_secondary")}</span>
              </Button>
            </a>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-slate-400 pt-6 border-t border-slate-800/80 w-full">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t("fcta_trust_1")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{t("fcta_trust_2")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{t("fcta_trust_3")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
