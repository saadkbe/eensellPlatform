import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Key, Star, MessageCircle } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function FinalCtaSection() {
  return (
    <section className="relative py-32 sm:py-48 bg-foreground text-background overflow-hidden flex items-center justify-center">
      
      {/* Cinematic animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-brand-light/10 to-success/20 animate-gradient-shift opacity-50 mix-blend-screen" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1 top-0 left-0" />
        <div className="orb orb-2 bottom-0 right-10" />
        <div className="orb orb-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Dot grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #ffffff 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="container max-w-5xl mx-auto px-6 relative z-10 text-center rtl-content">
        <ScrollReveal
          animation="scale"
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold mb-8 border border-white/20 backdrop-blur-md">
            <span className="animate-pulse-slow">✨</span> أماكن الوصول المبكر محدودة
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight drop-shadow-2xl text-white">
            الوقت يمر، وموجة <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand via-brand-light to-white text-glow-white">الذكاء الاصطناعي</span> لا تنتظر أحداً.
          </h2>
          
          <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            الفرق بين من يقرأ عن المستقبل ومن يصنعه هو خطوة واحدة. اتخذ قرارك اليوم وابدأ في بناء حياة رقمية حرة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link href="/sign-up" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-xl font-bold bg-white text-foreground hover:bg-white/90 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95">
                ابدأ رحلتك الآن
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 px-8 text-lg font-bold border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-2xl backdrop-blur-md transition-all group gap-2">
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              تواصل معنا عبر واتساب
            </Button>
          </div>

          {/* Trust badges row */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-background/50 text-sm font-bold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success/80" />
              <span>دفع آمن 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-light/80" />
              <span>وصول مدى الحياة</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning/80" />
              <span>رضا تام 100%</span>
            </div>
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
}
