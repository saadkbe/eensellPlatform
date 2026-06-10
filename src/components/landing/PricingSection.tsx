import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Check,
  ShieldCheck,
  UserPlus,
  MessageCircle,
  Zap,
  Lock,
} from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CountUpPrice } from "@/components/animations/CountUpPrice";

/* ─── data ─── */
const features = [
  "وصول مدى الحياة للمنصة",
  "مكالمتين مباشرتين أسبوعياً",
  "مكتبة ملقنات الذكاء الاصطناعي",
  "توجيه خطوة بخطوة للربح",
  "مجتمع رواد الأعمال الخاص",
  "دعم مستمر عبر الواتساب",
];

const steps = [
  {
    icon: UserPlus,
    title: "أنشئ حسابك مجاناً",
    desc: "اضغط على زر الانضمام وقم بإنشاء حسابك على منصتنا بثوانٍ معدودة.",
    color: "brand",
  },
  {
    icon: MessageCircle,
    title: "تواصل معنا على واتساب",
    desc: "تواصل معنا على رقم الواتساب المخصص لنزودك بالمعلومات البنكية، وبعد التحويل أرسل لنا صورة إيصال الدفع.",
    color: "success",
  },
  {
    icon: Zap,
    title: "احصل على وصول فوري ومدى الحياة",
    desc: "سنقوم بتفعيل حسابك فوراً لتبدأ رحلتك وتتمتع بكافة الميزات، المكالمات، والمجتمع الخاص.",
    color: "warning",
  },
];

export function PricingSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-foreground text-background overflow-hidden">
      {/* ═══ DARK CINEMATIC BACKGROUND ═══ */}
      {/* Large glowing brand orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand/15 rounded-full blur-[120px] pointer-events-none" />
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        {/* ═══ SECTION HEADER ═══ */}
        <div className="text-center mb-16 sm:mb-20">
          <ScrollReveal
            animation="slide-up"
            className="text-4xl sm:text-5xl md:text-6xl font-black text-background mb-6 tracking-tight"
          >
            استثمارك نحو{" "}
            <span className="text-brand">الحرية المالية</span>
          </ScrollReveal>
          <ScrollReveal
            animation="slide-up"
            delay={0.15}
            className="text-xl text-background/60 max-w-2xl mx-auto font-medium"
          >
            ادفع مرة واحدة اليوم، واحصل على وصول مدى الحياة
          </ScrollReveal>
        </div>

        {/* ═══ TWO-COLUMN GRID ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start rtl-content text-right">
          {/* ─── PRICING CARD (5-col) ─── */}
          <ScrollReveal
            animation="slide-up"
            delay={0.1}
            className="lg:col-span-5 order-1"
          >
            {/* Animated rotating border wrapper */}
            <div className="relative rounded-[2rem] p-[2px] overflow-hidden">
              {/* Spinning conic gradient border */}
              <div
                className="absolute inset-[-50%] animate-spin-border"
                style={{
                  background:
                    "conic-gradient(from 0deg, #3B82F6, #10B981, #60A5FA, #8B5CF6, #3B82F6)",
                }}
              />

              {/* Card content */}
              <div className="relative rounded-[calc(2rem-2px)] bg-[#0A0A0A] p-8 sm:p-10 flex flex-col">
                {/* Badge */}
                <div className="inline-flex w-fit px-4 py-1.5 rounded-full bg-brand/15 text-brand font-bold text-sm mb-6 border border-brand/25">
                  العضوية التأسيسية
                </div>

                {/* Comparison price */}
                <p className="text-base text-background/40 line-through mb-2 font-medium">
                  بدلاً من 500 MAD
                </p>

                {/* Animated price */}
                <div className="flex items-baseline gap-3 mb-2">
                  <CountUpPrice
                    target={200}
                    duration={1.5}
                    className="text-7xl sm:text-8xl font-black text-background tabular-nums tracking-tight"
                  />
                  <span className="text-2xl text-background/50 font-bold">
                    MAD
                  </span>
                </div>

                <p className="text-success font-bold text-sm mb-8">
                  دفع مرة واحدة فقط. لا توجد رسوم خفية.
                </p>

                {/* CTA Button */}
                <Link href="/sign-up" className="block w-full mb-8">
                  <Button className="w-full h-16 text-lg sm:text-xl font-bold bg-brand text-white hover:bg-brand-hover rounded-2xl shadow-xl transition-all hover:-translate-y-1 animate-pulse-ring cursor-pointer">
                    ابدأ الخطوة الأولى الآن
                  </Button>
                </Link>

                {/* Feature checklist */}
                <div className="space-y-4">
                  {features.map((feature, idx) => (
                    <ScrollReveal
                      key={idx}
                      animation="slide-right"
                      delay={0.3 + idx * 0.08}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                        <Check
                          className="w-3.5 h-3.5 text-brand"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="font-medium text-background/75 text-[0.95rem]">
                        {feature}
                      </span>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ─── STEPS TIMELINE (7-col) ─── */}
          <ScrollReveal
            animation="slide-left"
            delay={0.25}
            className="lg:col-span-7 order-2"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-background mb-10">
              كيفية الانضمام{" "}
              <span className="text-background/40">(3 خطوات بسيطة):</span>
            </h3>

            {/* Vertical timeline */}
            <div className="relative">
              {/* Connecting line */}
              <ScrollReveal
                animation="scale"
                delay={0.4}
                duration={1.2}
                className="absolute right-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand via-success to-warning origin-top hidden sm:block origin-top-scale"
              />

              <div className="space-y-10 sm:space-y-12">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const colorMap: Record<string, string> = {
                    brand: "bg-brand",
                    success: "bg-success",
                    warning: "bg-warning",
                  };
                  const iconColorMap: Record<string, string> = {
                    brand: "text-brand",
                    success: "text-success",
                    warning: "text-warning",
                  };
                  const bgColor = colorMap[step.color];
                  const iconColor = iconColorMap[step.color];

                  return (
                    <ScrollReveal
                      key={idx}
                      animation="slide-up"
                      delay={0.3 + idx * 0.2}
                      className="flex gap-5 sm:gap-6 items-start relative"
                    >
                      {/* Step number circle */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-white font-black text-lg shadow-lg`}
                        >
                          {idx + 1}
                        </div>
                      </div>

                      {/* Step content */}
                      <div className="flex-1 pb-2">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center`}
                          >
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <h4 className="text-xl font-bold text-background">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-background/50 leading-relaxed text-[0.95rem] mr-[3.25rem]">
                          {step.desc}
                        </p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>

            {/* Trust badges */}
            <ScrollReveal
              animation="slide-up"
              delay={0.9}
              className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-white/10"
            >
              <div className="flex items-center gap-2.5 text-sm text-background/60 bg-white/5 px-5 py-3 rounded-full border border-white/10 hover:border-brand/30 transition-colors">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <span className="font-medium">دفع آمن 100%</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-background/60 bg-white/5 px-5 py-3 rounded-full border border-white/10 hover:border-success/30 transition-colors">
                <Lock className="w-4 h-4 text-success" />
                <span className="font-medium">خصوصية تامة</span>
              </div>
            </ScrollReveal>
          </ScrollReveal>
        </div>

        {/* ═══ URGENCY BANNER ═══ */}
        <ScrollReveal
          animation="slide-up"
          delay={0.3}
          className="mt-16 sm:mt-20"
        >
          <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-brand/10 backdrop-blur-sm px-6 py-5 text-center animate-pulse-slow">
            {/* Glow behind */}
            <div className="absolute inset-0 bg-brand/5 pointer-events-none" />
            <p className="relative z-10 text-lg sm:text-xl font-black text-background flex items-center justify-center gap-3 flex-wrap">
              <span className="text-2xl">⏳</span>
              العرض التأسيسي محدود — الأماكن تنفد بسرعة
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
