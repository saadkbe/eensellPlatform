import { Video, Key, Users, Sparkles, Compass, Rocket } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function FeaturesSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-background">
      <div className="container max-w-6xl mx-auto px-6 text-right rtl-content">
        <div className="text-center mb-16 flex flex-col items-center">
          <ScrollReveal
            animation="scale"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 text-brand text-sm font-bold mb-6 border border-brand/20"
          >
            ماذا يميزنا؟
          </ScrollReveal>
          <ScrollReveal
            animation="slide-up"
            className="text-4xl sm:text-5xl font-black text-foreground mb-6"
          >
            ماذا ستحصل عند انضمامك؟
          </ScrollReveal>
          <ScrollReveal
            animation="slide-up"
            delay={0.1}
            className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto"
          >
            كل ما تحتاجه للبدء، مجمع في مكان واحد بأعلى معايير الجودة والتصميم.
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Large */}
          <ScrollReveal
            animation="slide-up"
            delay={0.1}
            className="group lg:col-span-2 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-premium hover:border-brand/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-8 min-h-[300px]"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand to-brand-light" />
            <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/5 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Video className="w-7 h-7 text-brand" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">مكالمات مباشرة أسبوعياً</h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                جلستين مباشرتين كل أسبوع للتوجيه، بناء الاستراتيجيات، والإجابة على كل استفساراتك خطوة بخطوة.
              </p>
            </div>

            <div className="relative z-10 mt-8 flex justify-end w-full">
              <div className="bg-background/80 backdrop-blur border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm w-fit">
                <div className="w-10 h-10 rounded-lg bg-brand text-white flex flex-col items-center justify-center font-bold leading-none">
                  <span className="text-xs opacity-80">أكتوبر</span>
                  <span className="text-lg">24</span>
                </div>
                <div>
                  <p className="font-bold text-sm">المكالمة القادمة</p>
                  <p className="text-xs text-muted-foreground">السبت 8:00 PM</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Large */}
          <ScrollReveal
            animation="slide-up"
            delay={0.2}
            className="group lg:col-span-2 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-premium hover:border-warning/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-8 min-h-[300px]"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-warning to-amber-300" />
            <div className="absolute inset-0 bg-warning/0 group-hover:bg-warning/5 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-warning/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Key className="w-7 h-7 text-warning" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">وصول مدى الحياة للمؤسسين</h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                ادفع مرة واحدة اليوم، واحصل على كل التحديثات والأدوات المستقبلية مجاناً للأبد.
              </p>
            </div>

            <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
              <span className="text-[10rem] font-black leading-none text-warning">∞</span>
            </div>
          </ScrollReveal>

          {/* Card 3: Small */}
          <ScrollReveal
            animation="slide-up"
            delay={0.3}
            className="group lg:col-span-1 md:col-span-1 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-premium hover:border-success/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden p-8"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-success to-emerald-300" />
            <div className="absolute inset-0 bg-success/0 group-hover:bg-success/5 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">مجتمع طموح وخاص</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                أحط نفسك بأشخاص يشاركونك نفس الطموح والعقلية. شبكة علاقاتك هي ثروتك.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 4: Small */}
          <ScrollReveal
            animation="slide-up"
            delay={0.4}
            className="group lg:col-span-1 md:col-span-1 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-premium hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden p-8"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-500 to-purple-400" />
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">خزينة أدوات الذكاء الاصطناعي</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                أفضل الأدوات والملقنات الجاهزة لتسريع العمل وتحقيق الأرباح.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 5: Small */}
          <ScrollReveal
            animation="slide-up"
            delay={0.5}
            className="group lg:col-span-1 md:col-span-1 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-premium hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden p-8"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-500 to-cyan-400" />
            <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">توجيه خطوة بخطوة</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                من الصفر وحتى تحقيق أول دولار لك على الإنترنت. خريطة طريق واضحة.
              </p>
            </div>
          </ScrollReveal>

          {/* Card 6: Small */}
          <ScrollReveal
            animation="slide-up"
            delay={0.6}
            className="group lg:col-span-1 md:col-span-1 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-premium hover:border-error/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden p-8"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-error to-rose-400" />
            <div className="absolute inset-0 bg-error/0 group-hover:bg-error/5 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-6 h-6 text-error" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">فرص حقيقية في السوق</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                مشاركة أحدث فرص العمل الحر والمشاريع للبدء فوراً بالذكاء الاصطناعي.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
