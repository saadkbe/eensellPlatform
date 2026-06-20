"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function FaqSection() {
  const { t, dir } = useLanguage();
  const [openItem, setOpenItem] = useState<string[]>(["item-0"]);

  const faqs = [
    { q: "faq_q1", a: "faq_a1" },
    { q: "faq_q2", a: "faq_a2" },
    { q: "faq_q3", a: "faq_a3" },
    { q: "faq_q4", a: "faq_a4" },
    { q: "faq_q5", a: "faq_a5" },
    { q: "faq_q6", a: "faq_a6" },
  ] as const;

  return (
    <section dir={dir} className="relative py-16 md:py-24 bg-white">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-5 relative">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="sticky top-32">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#FF6B4A]/20 to-purple-500/10 flex items-center justify-center mb-8 border border-white shadow-[inset_0_4px_10px_rgba(255,255,255,0.8),0_10px_20px_rgba(255,107,74,0.15)] relative backdrop-blur-md">
                <div className="absolute inset-0 bg-[#FF6B4A]/10 rounded-[2rem] blur-xl" />
                <span className="text-4xl relative z-10 drop-shadow-md">💡</span>
              </div>
              <h2 className="text-4xl font-black text-zinc-900 mb-6 tracking-tight">
                {t("faq_title")} <span className="text-[#FF6B4A]">{t("faq_title_2")}</span>
              </h2>
              <p className="text-xl text-zinc-500 font-medium">
                {t("faq_sub")}
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="lg:col-span-7"
          >
            <Accordion value={openItem} onValueChange={setOpenItem} className="space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="bg-[#FAFAFA] border border-zinc-200/60 rounded-2xl px-6 data-[state=open]:bg-white data-[state=open]:shadow-lg data-[state=open]:border-[#FF6B4A]/40 data-[state=open]:ring-4 data-[state=open]:ring-[#FF6B4A]/10 transition-all">
                  <AccordionTrigger className="text-lg font-bold text-zinc-900 hover:no-underline py-6 text-start data-[state=open]:text-[#FF6B4A] transition-colors">
                    {t(faq.q)}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-600 text-base leading-relaxed pb-6">
                    {t(faq.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
