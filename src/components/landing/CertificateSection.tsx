"use client";

import { Award, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { type TranslationKey } from "@/lib/translations";

export function CertificateSection() {
  const { t, dir, isRTL } = useLanguage();

  const features = [
    "cert_feat_1",
    "cert_feat_2",
    "cert_feat_3",
  ];

  return (
    <section dir={dir} className="relative py-24 bg-white border-y border-zinc-200 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-[#FF6B4A] font-bold text-sm w-fit mb-6">
              <Award className="w-4 h-4" />
              <span>{t("cert_title")}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 mb-6 leading-tight">
              {t("cert_title")}
            </h2>
            
            <p className="text-lg text-zinc-600 mb-10 leading-relaxed font-medium">
              {t("cert_sub")}
            </p>

            <ul className="space-y-4">
              {features.map((featKey, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#FF6B4A] shrink-0" />
                  <span className="text-zinc-700 font-medium">{t(featKey as TranslationKey)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Visual (Certificate Placeholder) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-zinc-100 rounded-3xl blur-2xl opacity-60"></div>
            
            <div className="relative aspect-[4/3] w-full bg-zinc-50 border-[6px] border-white shadow-xl rounded-2xl flex flex-col items-center justify-center text-center overflow-hidden">
              <img 
                src="/certificate.png" 
                alt="Certificate of Success" 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
