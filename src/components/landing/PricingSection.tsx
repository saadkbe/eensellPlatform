"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, UserPlus, MessageCircle, Zap, Lock } from "lucide-react";

export function PricingSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-secondary/10 border-t border-border/50">
      {/* Background styling */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">استثمارك نحو الحرية المالية</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            لا توجد اشتراكات شهرية معقدة. ادفع مرة واحدة اليوم، واحصل على وصول مدى الحياة لجميع المحتويات والأدوات والتحديثات.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start rtl-content text-right">
          
          {/* Steps Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 order-2 lg:order-1 space-y-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">كيفية الانضمام (3 خطوات بسيطة):</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0 border border-brand/20">
                  <UserPlus className="w-6 h-6 text-brand" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">1. أنشئ حسابك مجاناً</h4>
                  <p className="text-muted-foreground">اضغط على زر الانضمام وقم بإنشاء حسابك على منصتنا بثوانٍ معدودة.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center shrink-0 border border-success/20">
                  <MessageCircle className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">2. تواصل معنا على واتساب</h4>
                  <p className="text-muted-foreground">تواصل معنا على رقم الواتساب المخصص لنزودك بالمعلومات البنكية، وبعد التحويل أرسل لنا صورة إيصال الدفع (Screenshot).</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0 border border-warning/20">
                  <Zap className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground mb-2">3. احصل على وصول فوري ومدى الحياة</h4>
                  <p className="text-muted-foreground">سنقوم بتفعيل حسابك فوراً لتبدأ رحلتك وتتمتع بكافة الميزات، المكالمات، والمجتمع الخاص.</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-10 pt-8 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-full border border-border">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span>دفع آمن 100%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-4 py-2 rounded-full border border-border">
                <Lock className="w-4 h-4 text-success" />
                <span>خصوصية تامة</span>
              </div>
            </div>
          </motion.div>

          {/* Pricing Card Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 order-1 lg:order-2"
          >
            <div className="rounded-[2.5rem] p-8 bg-card border-2 border-brand shadow-2xl glow-blue relative overflow-hidden flex flex-col h-full">
              {/* Popular Badge */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand to-success" />
              <div className="inline-flex w-fit px-4 py-1.5 rounded-full bg-brand/10 text-brand font-bold text-sm mb-6 border border-brand/20">
                العضوية التأسيسية
              </div>

              <div className="flex items-baseline gap-2 text-foreground font-black mb-2">
                <span className="text-6xl tracking-tight">200</span>
                <span className="text-2xl text-muted-foreground">MAD</span>
              </div>
              <p className="text-success font-bold text-sm mb-8">دفع مرة واحدة فقط. لا توجد رسوم خفية.</p>

              <Link href="/sign-up" className="block w-full mb-8">
                <Button className="w-full h-16 text-xl font-bold bg-foreground text-background hover:bg-foreground/90 rounded-2xl shadow-xl hover:-translate-y-1 transition-all">
                  ابدأ الخطوة الأولى الآن
                </Button>
              </Link>

              <div className="space-y-4 flex-1">
                <p className="font-bold text-foreground mb-4">ماذا تتضمن العضوية؟</p>
                {[
                  "وصول مدى الحياة للمنصة",
                  "مكالمتين مباشرتين أسبوعياً",
                  "مكتبة ملقنات الذكاء الاصطناعي",
                  "توجيه خطوة بخطوة للربح",
                  "مجتمع رواد الأعمال الخاص",
                  "دعم مستمر عبر الواتساب"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-brand" strokeWidth={3} />
                    </div>
                    <span className="font-medium text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
