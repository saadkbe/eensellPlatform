"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, UserPlus, MessageCircle, Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { CountUpPrice } from "@/components/animations/CountUpPrice";
import { useLanguage } from "@/components/landing/LanguageProvider";

const featureKeys = [
  "pricing_feat_1",
  "pricing_feat_2",
  "pricing_feat_3",
  "pricing_feat_4",
  "pricing_feat_5",
  "pricing_feat_6",
] as const;

export function PricingSection() {
  const { t, dir, isRTL } = useLanguage();

  return (
    <section dir={dir} className="relative py-16 md:py-24 bg-[#FAFAFA] text-zinc-900 overflow-hidden">
      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 mb-6 tracking-tight"
          >
            {t("pricing_title")}{" "}
            <span className="text-[#FF6B4A]">{t("pricing_title_highlight")}</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium"
          >
            {t("pricing_sub")}
          </motion.p>
        </div>

        {/* Pricing Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto bg-white rounded-[2rem] border border-zinc-200/60 shadow-xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Pricing Side */}
          <div className="flex-1 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-zinc-200/60 rtl:md:border-l rtl:md:border-r-0 relative overflow-hidden">
            {/* Background Image & Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105 opacity-90 z-0"
              style={{ backgroundImage: "url('/pricingBackground.jpg')" }}
            />
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full justify-center">
              <div>
                <div className="inline-flex px-4 py-1.5 rounded-full bg-white/20 text-white font-bold text-sm mb-6 border border-white/30 backdrop-blur-md shadow-sm">
                  {t("pricing_badge")}
                </div>
                <p className="text-zinc-300 line-through mb-2 font-medium drop-shadow-sm">
                  {t("pricing_old")}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <CountUpPrice target={200} duration={1.5} className="text-6xl sm:text-7xl font-black text-white tracking-tight drop-shadow-md" />
                  <span className="text-xl text-zinc-200 font-bold drop-shadow-sm">{t("pricing_currency")}</span>
                </div>
                <p className="text-white/90 font-bold text-sm mb-8 drop-shadow-sm">
                  {t("pricing_note")}
                </p>
              </div>

              <div className="mt-auto pt-4">
                <Link href="/sign-up" className="block w-full">
                  <Button className="w-full h-14 text-lg font-bold bg-[#FF6B4A] hover:bg-[#E85A3B] text-white rounded-xl shadow-[0_8px_20px_-8px_rgba(255,107,74,0.6)] border border-[#FF6B4A]/50 transition-all hover:-translate-y-0.5">
                    {t("pricing_cta")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Features Side */}
          <div className="flex-1 p-8 sm:p-12 bg-zinc-50 flex flex-col justify-center">
            <h3 className="text-lg font-black text-zinc-900 mb-6">{t("pricing_includes" as any)}</h3>
            <div className="space-y-4">
              {featureKeys.map((key, idx) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                  </div>
                  <span className="font-medium text-zinc-700">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* How to Join Steps */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto mt-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">{t("pricing_steps_title")}</h3>
            <p className="text-zinc-500 font-medium">{t("pricing_steps_subtitle")}</p>
          </div>
          <div className="relative mt-16">
            {/* Horizontal Road Line (Desktop) */}
            <div className="hidden md:block absolute top-[24px] left-[16.66%] right-[16.66%] h-1 bg-zinc-200 rounded-full" />
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
              viewport={{ once: true }}
              style={{ originX: isRTL ? 1 : 0 }}
              className="hidden md:block absolute top-[24px] left-[16.66%] right-[16.66%] h-1 bg-[#FF6B4A] rounded-full z-0"
            />

            {/* Vertical Road Line (Mobile) */}
            <div className="md:hidden absolute top-0 bottom-0 left-[24px] rtl:left-auto rtl:right-[24px] w-1 bg-zinc-200 rounded-full" />
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
              viewport={{ once: true }}
              style={{ originY: 0 }}
              className="md:hidden absolute top-0 bottom-0 left-[24px] rtl:left-auto rtl:right-[24px] w-1 bg-[#FF6B4A] rounded-full z-0"
            />

            <div className="grid md:grid-cols-3 gap-12 md:gap-6 relative z-10">
              {[1, 2, 3].map((step, idx) => (
                <div key={step} className="relative flex flex-col md:items-center">
                  
                  {/* Step Circle */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 + idx * 0.4 }}
                    viewport={{ once: true }}
                    className="w-12 h-12 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center font-black text-xl shrink-0 mx-0 md:mx-auto mb-6 shadow-[0_0_0_8px_#FAFAFA] relative z-20"
                  >
                    {step}
                  </motion.div>

                  {/* Step Card */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + idx * 0.4 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[1.5rem] p-6 border border-zinc-200/60 shadow-sm text-start md:text-center ml-16 rtl:ml-0 rtl:mr-16 md:ml-0 md:rtl:mr-0 flex-1 w-[calc(100%-4rem)] md:w-full"
                  >
                    <h4 className="font-bold text-zinc-900 mb-3 text-lg">
                      {t(`pricing_step_${step}_title` as any)}
                    </h4>
                    <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                      {t(`pricing_step_${step}_desc` as any)}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Urgency */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-50 border border-orange-200/60 text-orange-800 font-bold text-sm sm:text-base">
            <span className="text-xl">⏳</span> {t("pricing_urgency")}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
