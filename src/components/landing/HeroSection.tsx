import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ChevronDown, Play } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggeredText } from "@/components/animations/StaggeredText";

/* ─── animation helpers ─── */
const headlineWords = [
  { text: "اكتشف", line: 1 },
  { text: "سر", line: 1 },
  { text: "بناء", line: 1 },
  { text: "ثروتك", line: 2 },
  { text: "الرقمية", line: 2 },
  { text: "الأولى", line: 2 },
  { text: "بالذكاء", line: 3 },
  { text: "الاصطناعي", line: 3 },
];

const trustItems = [
  "500+ أعضاء نشطين",
  "دعم مستمر 24/7",
  "أدوات ذكاء اصطناعي حصرية",
  "مكالمات أسبوعية مباشرة",
  "وصول مدى الحياة",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-0 bg-background">
      {/* ═══ BACKGROUND LAYER ═══ */}
      {/* Animated gradient orbs */}
      <div className="orb orb-1 -top-40 -right-40 opacity-70" />
      <div className="orb orb-2 top-1/3 -left-60 opacity-60" />
      <div className="orb orb-3 bottom-20 right-1/4 opacity-50" />

      {/* Subtle dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ═══ CONTENT ═══ */}
      <div className="relative z-20 container max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Animated badge with shimmer */}
        <ScrollReveal
          animation="slide-up"
          className="relative inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border/50 backdrop-blur-md mb-10 shadow-sm overflow-hidden"
        >
          {/* Shimmer sweep background */}
          <div
            className="absolute inset-0 animate-shimmer opacity-40 pointer-events-none"
            style={{
              background:
                "linear-gradient(110deg, transparent 25%, rgba(59,130,246,0.12) 50%, transparent 75%)",
              backgroundSize: "200% 100%",
            }}
          />
          <span className="flex h-2 w-2 relative z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
          </span>
          <span className="text-sm font-bold text-foreground relative z-10">
            التسجيل مفتوح للأعضاء المؤسسين
          </span>
        </ScrollReveal>

        {/* Staggered word headline */}
        <StaggeredText
          words={headlineWords}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-foreground tracking-tight leading-[1.35] md:leading-[1.15] mb-6 md:mb-8"
        />

        {/* Sub-headline */}
        <ScrollReveal
          animation="slide-up"
          delay={0.7}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 md:mb-12 leading-relaxed font-medium px-2 md:px-0"
        >
          الطريق التقليدي لن يجعلك حراً أبداً. انضم إلى الحركة الحصرية
          للمؤسسين الذين يربحون المال يومياً باستخدام أحدث أدوات الذكاء
          الاصطناعي.. بدون خبرة سابقة.
        </ScrollReveal>

        {/* Dual CTA buttons */}
        <ScrollReveal
          animation="slide-up"
          delay={0.85}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-16 px-10 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-1 flex items-center gap-3 group cursor-pointer"
            >
              ابدأ في تحقيق أرباحك الآن
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/sign-up" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-16 px-8 text-lg font-bold rounded-2xl border-border/60 hover:border-brand/40 hover:bg-brand/5 transition-all hover:-translate-y-1 flex items-center gap-3 group cursor-pointer"
            >
              <Play className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
              شاهد كيف يعمل
            </Button>
          </Link>
        </ScrollReveal>

        {/* Trust note */}
        <ScrollReveal
          animation="fade"
          delay={1.1}
          className="mt-8 flex items-center gap-2 text-sm font-bold text-muted-foreground"
        >
          <Sparkles className="w-4 h-4 text-brand" />
          <span>الأماكن التأسيسية محدودة وسيتم إغلاقها قريباً</span>
        </ScrollReveal>
      </div>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-background to-transparent z-30 pointer-events-none" />

      <ScrollReveal
        animation="slide-up"
        delay={0.7}
        className="mt-20 relative w-full max-w-5xl mx-auto px-6 z-20"
      >
        <div className="perspective-container">
          <div className="tilt-card w-full rounded-t-[2.5rem] border-t border-x border-brand/30 shadow-[0_-20px_80px_rgba(59,130,246,0.18)] overflow-hidden relative bg-card glow-blue">
            <Image
              src="/dashboard.png"
              alt="Eensell University Dashboard"
              width={1200}
              height={800}
              priority={true}
              className="w-full h-auto object-cover opacity-90"
            />

            {/* Note: In a pure Server Component, we can't use Framer Motion's continuous 'animate' on div directly.
                For this aggressive optimization, we'll replace continuous y-axis floating with pure CSS animations
                so we don't need a client component here. */}
                
            {/* Floating overlay 1 — Revenue */}
            <div className="absolute top-10 left-4 md:left-10 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-success/30 z-10 hidden sm:flex items-center gap-4 animate-float-slow">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <span className="text-success font-black text-xl">$</span>
              </div>
              <div className="text-left">
                <span className="text-xs text-muted-foreground block font-bold">
                  أرباح اليوم
                </span>
                <span className="text-lg font-black text-foreground flex items-center gap-2">
                  +2,450 MAD
                  {/* Mini green trend line */}
                  <svg width="40" height="18" viewBox="0 0 40 18" fill="none" className="inline-block">
                    <path d="M2 14 L8 10 L14 12 L20 6 L26 8 L32 3 L38 2" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 14 L8 10 L14 12 L20 6 L26 8 L32 3 L38 2 L38 18 L2 18Z" fill="url(#trendGrad)" opacity="0.2" />
                    <defs>
                      <linearGradient id="trendGrad" x1="20" y1="2" x2="20" y2="18">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>

            {/* Floating overlay 2 — Live session */}
            <div className="absolute bottom-1/4 right-4 md:right-10 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-brand/30 z-10 hidden sm:flex items-center gap-4 animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-right rtl-content">
                <span className="text-sm font-bold text-foreground block">
                  جلسة عمل حية
                </span>
                <span className="text-xs text-brand font-bold flex items-center gap-1 justify-end">
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  140 عضو متصل الآن
                </span>
              </div>
              <div className="flex -space-x-2">
                {[31, 32, 33].map((seed) => (
                  <div key={seed} className="w-10 h-10 rounded-full border-2 border-white dark:border-black overflow-hidden bg-secondary">
                    <Image
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                      alt="user"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating overlay 3 — AI Tools */}
            <div className="absolute top-1/3 right-4 md:right-10 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-warning/30 z-10 hidden sm:flex items-center gap-3 animate-float-slow" style={{ animationDelay: '2s' }}>
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-lg">
                🤖
              </div>
              <div className="text-right rtl-content">
                <span className="text-sm font-bold text-foreground block">
                  أدوات ذكية
                </span>
                <span className="text-xs text-warning font-bold flex items-center gap-1 justify-end">
                  <Sparkles className="w-3 h-3 animate-pulse-slow" />
                  12 أداة ذكاء اصطناعي
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ═══ MARQUEE TRUST TICKER ═══ */}
      <div className="relative w-full mt-0 pt-8 pb-6 z-20 overflow-hidden border-t border-border/30 bg-background">
        <div className="marquee-track gap-0">
          {[...trustItems, ...trustItems, ...trustItems, ...trustItems, ...trustItems, ...trustItems, ...trustItems, ...trustItems].map(
            (item, idx) => (
              <span
                key={idx}
                className="flex items-center gap-3 text-sm font-bold text-muted-foreground whitespace-nowrap px-6"
              >
                {item}
                <span className="w-1.5 h-1.5 rounded-full bg-brand/40" />
              </span>
            )
          )}
        </div>
      </div>

      {/* ═══ SCROLL INDICATOR ═══ */}
      <ScrollReveal
        animation="fade"
        delay={1.8}
        className="pb-8 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground font-medium">
          اكتشف المزيد
        </span>
        <ChevronDown className="w-5 h-5 text-muted-foreground animate-bounce-slow" />
      </ScrollReveal>
    </section>
  );
}
