"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  CreditCard,
  MessageCircle,
  Clock,
  Key,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function PricingSection() {
  const { dir, t, isRTL } = useLanguage();

  const includedItems = [
    t("pricing_v2_inc_1"),
    t("pricing_v2_inc_2"),
    t("pricing_v2_inc_3"),
    t("pricing_v2_inc_4"),
    t("pricing_v2_inc_5"),
    t("pricing_v2_inc_6"),
    t("pricing_v2_inc_7"),
  ];

  return (
    <section
      id="pricing"
      dir={dir}
      className="relative py-20 sm:py-32 bg-[#FAFBFE] text-slate-900 overflow-hidden border-t border-slate-200/70"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-indigo-100/40 via-violet-50/30 to-emerald-50/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs mb-4 text-xs font-bold text-slate-800 tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t("pricing_v2_badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-4"
          >
            {t("pricing_v2_title_1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
              {t("pricing_v2_title_2")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t("pricing_v2_sub")}
          </motion.p>
        </div>

        {/* ── BEAUTIFUL V2 PRICING CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-[2.5rem] bg-white border-2 border-slate-200/90 shadow-[0_20px_70px_-15px_rgba(15,23,42,0.12)] overflow-hidden"
        >
          {/* Top Banner Header */}
          <div className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>OFFICIAL V2 RELEASE &bull; ENROLLMENT OPEN</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>One-Time Program Purchase</span>
            </div>
          </div>

          <div className="p-8 sm:p-12 flex flex-col lg:flex-row gap-10 items-stretch">
            {/* Left Pricing Column */}
            <div className="lg:w-5/12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 lg:pr-10 pb-8 lg:pb-0">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                    PROGRAM PASS
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-600 fill-amber-500" /> 50% OFF
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
                  {t("pricing_v2_card_title")}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                  {t("pricing_v2_sub")}
                </p>

                {/* Big Bold Pricing Display (499 MAD instead of 997 MAD) */}
                <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-left rtl:text-right">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-950 font-mono tracking-tight">
                      {t("pricing_v2_price")}
                    </span>
                    <span className="text-2xl font-black text-slate-800">
                      {t("pricing_v2_currency")}
                    </span>
                    <span className="text-sm font-bold text-slate-400 line-through ml-2 rtl:mr-2 rtl:ml-0">
                      {t("pricing_v2_old_price")}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t("pricing_v2_frequency")}</span>
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3">
                <Link href="/sign-up" className="block w-full">
                  <Button
                    size="lg"
                    className="w-full h-12 rounded-2xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-xl cursor-pointer transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <span>{t("pricing_v2_cta")}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Button>
                </Link>

                <a
                  href="https://wa.me/212666065608?text=Bonjour%20Saad,%20je%20souhaite%20rejoindre%20Eensell%20University%20V2%20(499%20MAD)%20via%20virement%20bancaire%20(CIH)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-11 rounded-2xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>CIH Bank / WhatsApp</span>
                  </Button>
                </a>

                <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t("pricing_v2_guarantee")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Features Column: Included Items */}
            <div className="lg:w-7/12 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>{t("pricing_v2_inc_heading")}</span>
                </h4>

                <ul className="space-y-3.5">
                  {includedItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* BYO Keys & Usage Limits Box */}
              <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-950">
                  <Key className="w-4 h-4 text-amber-500" />
                  <span>{t("ws_byo_title")}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {t("pricing_v2_byo_note")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
