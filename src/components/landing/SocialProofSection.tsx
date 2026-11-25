"use client";

import { Star, PlayCircle, Check, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { type TranslationKey } from "@/lib/translations";

export function SocialProofSection() {
  const { t, dir, isRTL } = useLanguage();

  const testimonials = [
    { nameKey: "social_t1_name", roleKey: "social_t1_role", incomeKey: "social_t1_income", contentKey: "social_t1_content", initials: "AM" },
    { nameKey: "social_t2_name", roleKey: "social_t2_role", incomeKey: "social_t2_income", contentKey: "social_t2_content", initials: "YB" },
    { nameKey: "social_t3_name", roleKey: "social_t3_role", incomeKey: "social_t3_income", contentKey: "social_t3_content", initials: "OT" },
    { nameKey: "social_t4_name", roleKey: "social_t4_role", incomeKey: "social_t4_income", contentKey: "social_t4_content", initials: "SK" },
    { nameKey: "social_t5_name", roleKey: "social_t5_role", incomeKey: "social_t5_income", contentKey: "social_t5_content", initials: "MR" },
    { nameKey: "social_t6_name", roleKey: "social_t6_role", incomeKey: "social_t6_income", contentKey: "social_t6_content", initials: "HL" },
    { nameKey: "social_t7_name", roleKey: "social_t7_role", incomeKey: "social_t7_income", contentKey: "social_t7_content", initials: "KD" },
    { nameKey: "social_t8_name", roleKey: "social_t8_role", incomeKey: "social_t8_income", contentKey: "social_t8_content", initials: "NB" },
  ];

  return (
    <section dir={dir} className="relative py-24 md:py-32 bg-zinc-50 border-y border-zinc-200 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="container max-w-6xl mx-auto px-6 mb-16 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center mb-6">
            {/* Clean, Anonymous Monogram UI Avatars */}
            <div className="flex -space-x-2.5 rtl:space-x-reverse mb-4">
              {[
                { label: "AM", bg: "from-slate-800 to-slate-950 text-slate-100" },
                { label: "YB", bg: "from-orange-500 to-amber-600 text-white" },
                { label: "OT", bg: "from-zinc-800 to-zinc-950 text-zinc-100" },
                { label: "SK", bg: "from-slate-700 to-slate-900 text-slate-100" },
                { label: "MR", bg: "from-amber-600 to-orange-700 text-white" },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`w-11 h-11 rounded-full border-[2.5px] border-white bg-gradient-to-br ${item.bg} flex items-center justify-center text-xs font-black shadow-sm relative z-10 select-none`}
                >
                  {item.label}
                </div>
              ))}
              <div className="w-11 h-11 rounded-full border-[2.5px] border-white bg-slate-950 text-orange-400 flex items-center justify-center text-[10px] font-black shadow-sm relative z-10 select-none tracking-tight">
                +1.3k
              </div>
            </div>
            <div className="inline-flex items-center gap-1 bg-white px-4 py-1.5 rounded-full shadow-sm border border-zinc-200">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              <span className="ml-2 font-bold text-sm text-zinc-700">5.0</span>
            </div>
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-black text-zinc-900 mb-4 tracking-tight">
            {t("social_title")}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-xl text-zinc-500 max-w-2xl font-medium">
            {t("social_sub")}
          </motion.p>
        </div>

        {/* Featured Video Testimonial Section */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-24">
          
          {/* Video Player (Left side on LTR, Right side on RTL) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="lg:col-span-7 relative"
          >
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-[#FF6B4A]/20 blur-3xl rounded-full z-0"></div>
            
            <div className="relative z-10 p-[3px] bg-gradient-to-br from-[#FF6B4A] to-orange-200 rounded-[2rem] shadow-2xl overflow-hidden group">
              <div className="relative aspect-video rounded-[1.8rem] bg-zinc-900 overflow-hidden flex items-center justify-center">
                
                {/* 
                  TODO: Tomorrow, replace src with your real video file name (e.g. "/testimonial.mp4") 
                  and add `controls` to the video tag so users can play it. 
                */}
                <video 
                  src="/FEEDBACK1.mp4" 
                  poster="/images/confident_thumbnail_cinematic.webp" 
                  preload="none"
                  controls
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />

                {/* Optional Play Button Overlay (for aesthetic if no controls are used initially) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <PlayCircle className="w-10 h-10 text-white fill-white/10" />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Featured Quote Text (Right side on LTR, Left side on RTL) */}
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 mb-8 leading-[1.3] relative">
              <span className="absolute -top-6 -left-6 text-6xl text-[#FF6B4A] opacity-20 font-serif">"</span>
              {t("social_featured_quote" as TranslationKey)}
            </h3>

            <div className="flex items-center gap-5 pt-6 border-t border-zinc-200/80">
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white flex items-center justify-center font-bold text-base shadow-md border-2 border-white shrink-0 select-none">
                <span>YB</span>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 border-2 border-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </span>
              </div>
              <div>
                <p className="font-bold text-zinc-900 text-lg">
                  {t("social_featured_name" as TranslationKey)}
                </p>
                <p className="text-sm font-medium text-[#FF6B4A] uppercase tracking-wider">
                  {t("social_featured_badge" as TranslationKey)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* The existing text marquees below to show VOLUME of success */}
      <div className="relative w-full overflow-hidden pb-12 pt-4 border-t border-zinc-200/50 bg-white/50 backdrop-blur-sm">
        {/* Marquee Title */}
        <p className="text-center text-sm font-bold text-zinc-400 uppercase tracking-widest mb-8">
          {isRTL ? "المزيد من قصص النجاح في مجتمعنا" : "MORE SUCCESS STORIES FROM OUR COMMUNITY"}
        </p>

        {/* Gradients for smooth infinite scroll edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-zinc-50 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-zinc-50 to-transparent z-20 pointer-events-none" />
        
        <motion.div 
          animate={{ x: isRTL ? ["0%", "50%"] : ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
          style={{ willChange: "transform" }}
          className="flex w-max hover:[animation-play-state:paused]"
        >
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials, ...testimonials].map((test, idx) => (
            <div key={idx} className="min-w-[340px] max-w-[380px] mx-4 p-8 rounded-[2rem] bg-white border border-zinc-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B4A] to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <span className="text-[#FF6B4A] font-bold text-sm bg-orange-50 px-4 py-1.5 rounded-full w-fit border border-orange-100 mb-6 relative z-10 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B4A] animate-pulse" />
                {t(test.incomeKey as TranslationKey)}
              </span>
              <p className="text-zinc-600 leading-relaxed text-lg font-medium flex-1 mb-8 relative z-10">
                "{t(test.contentKey as TranslationKey)}"
              </p>
              <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-zinc-100">
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900 border border-slate-700/60 flex items-center justify-center shadow-xs shrink-0 select-none">
                  <span className="font-bold text-xs tracking-wider text-orange-400">
                    {test.initials}
                  </span>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 border-2 border-white flex items-center justify-center">
                    <Check className="w-2 h-2 text-white stroke-[3]" />
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 text-base">{t(test.nameKey as TranslationKey)}</h4>
                  <p className="text-sm text-zinc-500 font-medium mt-0.5">{t(test.roleKey as TranslationKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
