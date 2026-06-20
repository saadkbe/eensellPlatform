"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Hourglass } from "lucide-react";

export function MotivationSection() {
  const { t, dir } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section ref={containerRef} dir={dir} className="relative py-20 md:py-40 bg-black text-white overflow-hidden">
      {/* Cinematic Orange Mesh Gradient Lighting */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#FF6B4A]/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#FF6B4A]/10 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-[#FF6B4A]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col items-center text-center">
          <motion.div 
            style={{ rotate }}
            className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-12 backdrop-blur-md shadow-[0_0_50px_rgba(255,107,74,0.15)]"
          >
            <Hourglass className="w-10 h-10 text-[#FF6B4A]" />
          </motion.div>
          
          <motion.h2 
            style={{ scale, opacity }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-16 text-balance"
          >
            {t("motiv_title_1")}{" "}
            <span className="text-[#FF6B4A] drop-shadow-[0_0_15px_rgba(255,107,74,0.4)] block sm:inline mt-2 sm:mt-0">
              {t("motiv_title_2")}
            </span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-10 text-xl sm:text-2xl text-zinc-400 font-medium leading-relaxed max-w-3xl"
          >
            <p className="text-balance">{t("motiv_p1")}</p>
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-[#FF6B4A] blur-2xl opacity-20" />
              <p className="text-white font-black text-3xl sm:text-4xl relative z-10 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                {t("motiv_p2")}
              </p>
            </div>
            <p className="text-balance">{t("motiv_p3")}</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, type: "spring" }}
          className="mt-32 max-w-4xl mx-auto bg-gradient-to-br from-white/10 to-white/5 rounded-[3rem] p-10 sm:p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B4A]/0 via-[#FF6B4A]/5 to-[#FF6B4A]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="text-[#FF6B4A] text-8xl md:text-9xl font-serif leading-none mb-6 absolute top-4 left-6 md:top-8 md:left-10 opacity-20 pointer-events-none">"</div>
          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-10 relative z-10 leading-tight text-balance">
            {t("motiv_quote")}
          </p>
          <div className="flex items-center justify-center gap-4 relative z-10">
            <div className="w-12 h-1 bg-[#FF6B4A] rounded-full" />
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">
              {t("motiv_quote_sub")}
            </p>
            <div className="w-12 h-1 bg-[#FF6B4A] rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
