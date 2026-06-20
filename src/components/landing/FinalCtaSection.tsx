"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Key, Star, MessageCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function FinalCtaSection() {
  const { t, dir } = useLanguage();

  return (
    <section dir={dir} className="relative py-20 md:py-32 bg-black overflow-hidden">
      
      {/* Cinematic Orange Mesh Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B4A]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#FF6B4A]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-[#FF6B4A] text-sm font-bold mb-8 border border-orange-100"
        >
          {t("cta_badge")}
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-[1.2]"
        >
          {t("cta_title_1")}{" "}
          <span className="text-[#FF6B4A]">{t("cta_title_2")}</span>{" "}
          {t("cta_title_3")}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto mb-12"
        >
          {t("cta_sub")}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto mb-16"
        >
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg font-bold bg-[#FF6B4A] hover:bg-[#E85A3B] text-white rounded-xl shadow-[0_12px_24px_-8px_rgba(255,107,74,0.5)] transition-all hover:-translate-y-1">
              <Key className="w-5 h-5 rtl:ml-2 ltr:mr-2" />
              {t("cta_primary")}
            </Button>
          </Link>
          
          <a href="https://wa.me/212666065608" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-xl transition-all hover:-translate-y-1 shadow-sm backdrop-blur-md">
              <MessageCircle className="w-5 h-5 rtl:ml-2 ltr:mr-2 text-green-400" />
              {t("cta_whatsapp")}
            </Button>
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-12"
        >
          <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-green-400" /> {t("cta_trust_safe")}
          </div>
          <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm">
            <Star className="w-5 h-5 text-yellow-500" /> {t("cta_trust_lifetime")}
          </div>
          <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-[#FF6B4A]" /> {t("cta_trust_satisfaction")}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
