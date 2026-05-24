"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section className="relative py-32 sm:py-48 bg-foreground text-background overflow-hidden">
      {/* Intense animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand rounded-full blur-[150px] opacity-20 animate-pulse-slow" />
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at center, #ffffff 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight drop-shadow-lg">
            الوقت يمر، وموجة <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand via-brand-light to-white">الذكاء الاصطناعي</span> لا تنتظر أحداً.
          </h2>
          
          <p className="text-xl sm:text-2xl text-background/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            الفرق بين من يقرأ عن المستقبل ومن يصنعه هو خطوة واحدة. اتخذ قرارك اليوم وابدأ في بناء حياة رقمية حرة.
          </p>

          <div className="flex flex-col items-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-16 px-12 text-xl font-bold bg-white text-foreground hover:bg-white/90 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95">
                ابدأ رحلتك الآن
              </Button>
            </Link>
            <p className="text-sm text-brand-light font-medium mt-4">
              ✨ أماكن الوصول المبكر محدودة
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
