"use client";

import { Video, Key, Users, Sparkles, Compass, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function FeaturesSection() {
  const { t, dir, isRTL } = useLanguage();

  return (
    <section className="relative py-16 md:py-24 bg-[#FAFAFA]" dir={dir}>
      <div className="container max-w-5xl mx-auto px-6">
        
        {/* Minimalist Section Header */}
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4"
          >
            {t("features_badge")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-zinc-900 mb-6 tracking-tight"
          >
            {t("features_title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium"
          >
            {t("features_sub")}
          </motion.p>
        </div>

        {/* CoreShift style Bento Grid (White cards, subtle shadow, clean icons) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card 1: Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-[2rem] bg-white border border-zinc-200/60 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            <div className="icon-squircle icon-squircle-blue w-14 h-14 mb-6">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">
              {t("features_3_title")}
            </h3>
            <p className="text-zinc-500 leading-relaxed text-sm flex-1">
              {t("features_3_desc")}
            </p>
          </motion.div>
          
          {/* Card 2: Live Calls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lg:col-span-3 rounded-[2rem] bg-white border border-zinc-200/60 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="icon-squircle icon-squircle-purple w-14 h-14 mb-6">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">
              {t("features_1_title")}
            </h3>
            <p className="text-zinc-500 text-lg leading-relaxed max-w-xl mb-8">
              {t("features_1_desc")}
            </p>
            
            <div className="bg-[#FAFAFA] border border-zinc-200 rounded-2xl p-4 flex items-center gap-4 w-fit">
              <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex flex-col items-center justify-center font-bold text-zinc-900">
                <span className="text-[10px] text-zinc-500 uppercase">{t("features_1_next_month")}</span>
                <span className="text-lg leading-none">{t("features_1_next_day")}</span>
              </div>
              <div>
                <p className="font-bold text-sm text-zinc-900">{t("features_1_next_label")}</p>
                <p className="text-sm text-zinc-500">{t("features_1_next_time")}</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Lifetime Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-[2rem] bg-white border border-zinc-200/60 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="icon-squircle icon-squircle-red w-14 h-14 mb-6">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight">
                {t("features_2_title")}
              </h3>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-md">
                {t("features_2_desc")}
              </p>
            </div>
            <div className={`absolute bottom-[-20px] ${isRTL ? "left-10" : "right-10"} text-[10rem] font-black text-zinc-50 select-none pointer-events-none`}>
              ∞
            </div>
          </motion.div>

          {/* Card 4: AI Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="rounded-[2rem] bg-white border border-zinc-200/60 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col aspect-square"
          >
            <div className="icon-squircle icon-squircle-yellow w-14 h-14 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-900" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">
              {t("features_4_title")}
            </h3>
            <p className="text-zinc-500 leading-relaxed text-sm flex-1">
              {t("features_4_desc")}
            </p>
          </motion.div>


          {/* Card 5: Step-by-step */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="rounded-[2rem] bg-white border border-zinc-200/60 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col aspect-square"
          >
            <div className="icon-squircle bg-zinc-900 w-14 h-14 mb-6">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">
              {t("features_5_title")}
            </h3>
            <p className="text-zinc-500 leading-relaxed text-sm flex-1">
              {t("features_5_desc")}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
