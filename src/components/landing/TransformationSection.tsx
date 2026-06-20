"use client";

import { XCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function TransformationSection() {
  const { t, dir, isRTL } = useLanguage();

  const beforeItems = [t("trans_before_1"), t("trans_before_2"), t("trans_before_3"), t("trans_before_4")];
  const afterItems = [t("trans_after_1"), t("trans_after_2"), t("trans_after_3"), t("trans_after_4")];

  return (
    <section dir={dir} className="relative py-16 md:py-24 bg-[#FAFAFA]">
      <div className="container max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight"
          >
            {t("trans_title_1")}<br/>
            <span className="text-[#FF6B4A]">{t("trans_title_2")}</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch relative">
          
          {/* Before Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[2rem] bg-white border border-zinc-200/60 p-8 sm:p-10 shadow-sm"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-500 font-bold mb-8">
              <XCircle className="w-5 h-5" /> {t("trans_before_badge")}
            </div>
            <ul className="space-y-6">
              {beforeItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 text-zinc-500 font-medium">
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" /> <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-[2rem] bg-white border border-zinc-200/60 p-8 sm:p-10 shadow-xl shadow-[#FF6B4A]/5 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-[#FF6B4A]" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-[#FF6B4A] font-bold mb-8">
              <CheckCircle2 className="w-5 h-5" /> {t("trans_after_badge")}
            </div>
            <ul className="space-y-6">
              {afterItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 text-zinc-900 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B4A] shrink-0 mt-0.5" /> <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
