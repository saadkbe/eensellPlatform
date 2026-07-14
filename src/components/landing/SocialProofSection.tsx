"use client";

import { Star, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { type TranslationKey } from "@/lib/translations";

export function SocialProofSection() {
  const { t, dir, isRTL } = useLanguage();

  const avatars = [
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/46.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
    "https://randomuser.me/api/portraits/women/90.jpg",
  ];

  const testimonials = [
    { nameKey: "social_t1_name", roleKey: "social_t1_role", incomeKey: "social_t1_income", contentKey: "social_t1_content", image: avatars[0] },
    { nameKey: "social_t2_name", roleKey: "social_t2_role", incomeKey: "social_t2_income", contentKey: "social_t2_content", image: avatars[1] },
    { nameKey: "social_t3_name", roleKey: "social_t3_role", incomeKey: "social_t3_income", contentKey: "social_t3_content", image: avatars[2] },
    { nameKey: "social_t4_name", roleKey: "social_t4_role", incomeKey: "social_t4_income", contentKey: "social_t4_content", image: avatars[3] },
    { nameKey: "social_t5_name", roleKey: "social_t5_role", incomeKey: "social_t5_income", contentKey: "social_t5_content", image: avatars[4] },
  ];

  return (
    <section dir={dir} className="relative py-24 md:py-32 bg-zinc-50 border-y border-zinc-200 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="container max-w-6xl mx-auto px-6 mb-16 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center mb-6">
            <div className="flex -space-x-2 mb-4">
              {avatars.map((imgUrl, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-[3px] border-zinc-50 overflow-hidden bg-zinc-200 shadow-md relative z-10">
                  <img src={imgUrl} alt="Member" className="w-full h-full object-cover" />
                </div>
              ))}
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
                  src="/placeholder-video.mp4" 
                  poster="/dashboard.png" 
                  controls
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
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
              {/* Featured Quote Placeholder. Update this tomorrow with the best quote from the interview. */}
              {isRTL 
                ? "لقد تغيرت حياتي تماماً. من صفر خبرة إلى تحقيق أول عميل لي في أقل من 30 يوماً!"
                : "It completely changed my life. From zero experience to landing my first client in under 30 days!"}
            </h3>

            <div className="flex items-center gap-5 pt-6 border-t border-zinc-200/80">
              <div className="w-16 h-16 rounded-full bg-zinc-200 overflow-hidden border-2 border-white shadow-sm shrink-0">
                <img src={avatars[1]} alt="Featured Member" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-zinc-900 text-lg">
                  {isRTL ? "لينا أمجادي." : "Lina Amjadi."}
                </p>
                <p className="text-sm font-medium text-[#FF6B4A] uppercase tracking-wider">
                  {isRTL ? "قصة نجاح مميزة" : "Featured Success Story"}
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
                <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src={test.image} alt={t(test.nameKey as TranslationKey)} className="w-full h-full object-cover" />
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
