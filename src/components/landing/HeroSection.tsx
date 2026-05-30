"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-20 bg-background">
      
      {/* 10x Premium Background: Ultra clean with single massive soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand/10 blur-[120px] rounded-full opacity-60 pointer-events-none" />
      
      {/* Ultra-subtle grid for depth, not noisy */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-20 container max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Sleek Stripe-like Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-md mb-10 shadow-sm"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
          </span>
          <span className="text-sm font-bold text-foreground">
            التسجيل مفتوح للأعضاء المؤسسين
          </span>
        </motion.div>

        {/* 10x Typography: Massive, tight, solid accent color */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black text-foreground tracking-tight leading-[1.3] md:leading-[1.1] mb-6 md:mb-8"
        >
          اكتشف سر بناء <br />
          <span className="text-brand">
            ثروتك الرقمية الأولى
          </span>
          <br />
          بالذكاء الاصطناعي
        </motion.h1>

        {/* Refined Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium px-2 md:px-0"
        >
          الطريق التقليدي لن يجعلك حراً أبداً. انضم إلى الحركة الحصرية للمؤسسين الذين يربحون المال يومياً باستخدام أحدث أدوات الذكاء الاصطناعي.. بدون خبرة سابقة.
        </motion.p>

        {/* Premium Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-0.5 flex items-center gap-3 group">
              ابدأ في تحقيق أرباحك الآن
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Trust Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-8 flex items-center gap-2 text-sm font-bold text-muted-foreground"
        >
          <Sparkles className="w-4 h-4 text-brand" />
          <span>الأماكن التأسيسية محدودة وسيتم إغلاقها قريباً</span>
        </motion.div>

      </div>

      {/* Dashboard Image with Mock Data Overlays */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-30 pointer-events-none" />
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, type: "spring", bounce: 0.3 }}
        className="mt-20 relative w-full max-w-5xl mx-auto px-6 z-20"
      >
        <div className="w-full rounded-t-[2.5rem] border-t border-x border-brand/20 shadow-[0_-20px_80px_rgba(59,130,246,0.15)] overflow-hidden relative bg-card">
           <img 
             src="/dashboard.png" 
             alt="Eensell University Dashboard" 
             className="w-full h-auto object-cover opacity-90"
           />
           
           {/* Mock Data Overlay 1: Revenue */}
           <motion.div 
             className="absolute top-12 left-4 md:left-12 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-success/30 flex items-center gap-4 z-10 hidden sm:flex"
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           >
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-success font-black text-xl">$</span>
              </div>
              <div className="text-left">
                <span className="text-xs text-muted-foreground block font-bold">أرباح اليوم</span>
                <span className="text-lg font-black text-foreground">+2,450 MAD</span>
              </div>
           </motion.div>

           {/* Mock Data Overlay 2: Active Users/Community */}
           <motion.div 
             className="absolute bottom-1/4 right-4 md:right-12 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-brand/30 flex items-center gap-4 z-10 hidden sm:flex"
             animate={{ y: [0, 10, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           >
              <div className="text-right rtl-content">
                <span className="text-sm font-bold text-foreground block">جلسة عمل حية</span>
                <span className="text-xs text-brand font-bold flex items-center gap-1 justify-end">
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                  140 عضو متصل الآن
                </span>
              </div>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-black flex items-center justify-center overflow-hidden bg-secondary">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+30}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
           </motion.div>
        </div>
      </motion.div>

    </section>
  );
}
