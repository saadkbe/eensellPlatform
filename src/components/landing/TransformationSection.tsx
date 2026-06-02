"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2 } from "lucide-react";

export function TransformationSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-foreground text-background overflow-hidden">
      {/* Background with dramatic spotlight and noise */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand rounded-full blur-[120px]" />
      </div>
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="container max-w-5xl mx-auto px-6 relative z-10 text-right rtl-content">
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight"
          >
            أنت لا تشتري دورة..<br />
            <span className="text-brand-light text-glow">أنت تستثمر في نسختك المستقبلية.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-4 items-stretch relative">
          
          {/* Before Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] bg-white/5 border border-white/10 p-8 sm:p-10 relative overflow-hidden backdrop-blur-md grayscale-[0.5]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-error/10 blur-[50px] rounded-full" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 text-error font-bold mb-8 border border-error/20">
              <XCircle className="w-5 h-5" />
              قبل الانضمام
            </div>
            
            <ul className="space-y-6">
              {[
                "تبحث عن طريقة للربح بدون نتائج",
                "تعتمد على الراتب الشهري فقط",
                "لا تعرف كيف تستخدم الذكاء الاصطناعي",
                "محاط بأشخاص يثبطون طموحك"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 text-background/70 font-medium text-lg">
                  <XCircle className="w-6 h-6 text-error shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Divider */}
          <div className="hidden md:flex flex-col items-center justify-center relative py-10">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-brand/50 to-transparent" />
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-foreground border-4 border-brand flex items-center justify-center z-10 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
            >
              <span className="text-brand font-black text-sm">VS</span>
            </motion.div>
          </div>

          {/* After Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-[2rem] bg-brand/10 border border-brand/30 p-8 sm:p-10 relative overflow-hidden backdrop-blur-md glow-brand"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-success/10 to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-brand/10 to-transparent" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-success/20 text-success font-bold mb-8 border border-success/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-5 h-5" />
                بعد 60 يوماً
              </div>
              
              <ul className="space-y-6">
                {[
                  "شخص يفهم لغة الذكاء الاصطناعي ويستخدمه يومياً",
                  "شخص يمتلك مهارات رقمية حديثة يطلبها السوق",
                  "شخص بدأ في بناء مصادر دخل أونلاين",
                  "محاط بشبكة من رواد الأعمال الطموحين"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-white font-bold text-lg">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>

        {/* Floating Testimonial Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute -bottom-6 lg:-bottom-10 left-6 lg:left-20 z-20 animate-float hidden sm:block"
        >
          <div className="bg-background/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-brand overflow-hidden bg-foreground">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad" alt="Ahmad" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white font-bold text-sm mb-1">أحمد م.</p>
              <p className="text-brand-light text-xs font-medium">"حققت 2450 درهم في شهرين"</p>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
