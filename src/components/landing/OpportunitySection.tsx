"use client";

import { useRef } from "react";
import { Sparkles, TrendingUp, Zap, Target } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function OpportunitySection() {
  const { t, dir } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth Parallax effects
  const yText = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yCards = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const opacityGradient = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <section ref={containerRef} className="relative py-16 md:py-32 bg-[#FAFAFA] overflow-hidden" dir={dir}>
      {/* Orange Mesh Gradient Light */}
      <motion.div 
        style={{ opacity: opacityGradient }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] bg-[#FF6B4A]/10 rounded-full blur-[120px] pointer-events-none z-0"
      />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center mb-12 lg:mb-24">
          
          {/* Left Text Content - Parallax */}
          <motion.div 
            style={{ y: yText }}
            className="lg:col-span-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-zinc-900 text-sm font-bold mb-8 shadow-sm border border-zinc-200"
            >
              <Sparkles className="w-4 h-4 text-[#FF6B4A]" />
              {t("opp_badge")}
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 mb-8 leading-[1.15] tracking-tight text-balance">
              {t("opp_title_1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] to-[#E85A3B] block mt-2">
                {t("opp_title_2")}
              </span>
            </h2>
            
            <div className="space-y-6 text-lg lg:text-xl text-zinc-500 leading-relaxed font-medium">
              <p>{t("opp_p1")}</p>
              <div className="p-6 bg-white rounded-2xl border border-zinc-200/60 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 w-1.5 bg-[#FF6B4A]" />
                <p className="px-2">
                  {t("opp_p2_pre")}{" "}
                  <strong className="text-zinc-900 font-black">{t("opp_p2_bold")}</strong>{" "}
                  {t("opp_p2_post")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Stats Cards - Floating & Parallax */}
          <motion.div 
            style={{ y: yCards }}
            className="lg:col-span-6 relative flex flex-col md:block justify-center items-center h-full lg:min-h-[450px]"
          >
            {/* Decorative background dashed circle */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border-2 border-dashed border-zinc-300 rounded-full animate-[spin_60s_linear_infinite] z-0" />

            {[
              { val: t("opp_stat_1_value"), label: t("opp_stat_1_label"), color: "purple", icon: TrendingUp, pos: "relative md:absolute md:top-[0%] md:right-[5%] rtl:md:right-auto rtl:md:left-[5%] mb-4 md:mb-0", delay: 0.1 },
              { val: t("opp_stat_2_value"), label: t("opp_stat_2_label"), color: "blue", icon: Target, pos: "relative md:absolute md:top-[40%] md:left-[0%] rtl:md:left-auto rtl:md:right-[0%] mb-4 md:mb-0", delay: 0.3 },
              { val: t("opp_stat_3_value"), label: t("opp_stat_3_label"), color: "yellow", icon: Zap, pos: "relative md:absolute md:bottom-[5%] md:right-[15%] rtl:md:right-auto rtl:md:left-[15%] mb-4 md:mb-0", delay: 0.5 }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.5, y: 50 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }} 
                transition={{ type: "spring", stiffness: 100, delay: stat.delay }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-white rounded-[2rem] border border-zinc-200/80 p-6 flex items-center gap-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all ${stat.pos} w-full md:w-[300px] z-20 backdrop-blur-sm bg-white/95`}
              >
                <div className={`icon-squircle icon-squircle-${stat.color} w-14 h-14 shrink-0 flex items-center justify-center text-white shadow-sm`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-zinc-900 mb-0.5">{stat.val}</h3>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Callout Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
          className="w-full max-w-5xl mx-auto bg-zinc-900 rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Animated Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B4A]/20 via-purple-500/10 to-[#FF6B4A]/20 opacity-60 blur-3xl pointer-events-none" />
          
          <Sparkles className="absolute top-10 right-10 md:right-20 w-8 h-8 text-[#FF6B4A] animate-pulse" />
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 tracking-tight relative z-10 text-balance leading-tight">
            {t("opp_callout_1")}
          </p>
          <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto relative z-10 leading-relaxed text-balance">
            {t("opp_callout_2")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
