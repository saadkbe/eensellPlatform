"use client";

import { motion } from "framer-motion";

export function TransformationSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-foreground text-background overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-right rtl-content"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-8 leading-tight">
              أنت لا تشتري دورة..<br />
              <span className="text-brand-light">أنت تستثمر في نسختك المستقبلية.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-background/80">
              <p>
                تخيل نفسك بعد 60 يوماً من الآن:
              </p>
              <ul className="space-y-4 font-medium">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-light" />
                  شخص يفهم لغة الذكاء الاصطناعي ويستخدمه يومياً ببراعة.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-light" />
                  شخص يمتلك مهارات رقمية حديثة يطلبها السوق بشدة.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-light" />
                  شخص بدأ في بناء مصادر دخل أونلاين وتجاوز الطرق التقليدية.
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-light" />
                  شخص محاط بشبكة من رواد الأعمال الطموحين الذين يدعمونه.
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] rounded-3xl overflow-hidden glass-border"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-transparent mix-blend-overlay" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {/* Abstract futuristic shape instead of a boring image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute w-64 h-64 border border-brand-light/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute w-48 h-48 border border-brand-light/50 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
                <div className="w-32 h-32 bg-brand rounded-full blur-[20px] opacity-80" />
                <div className="w-16 h-16 bg-white rounded-full z-10 shadow-[0_0_50px_rgba(255,255,255,1)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
