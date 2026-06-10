import { Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function OpportunitySection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, var(--color-brand) 0, var(--color-brand) 1px, transparent 0, transparent 50%)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="container max-w-6xl mx-auto px-6 relative z-10 rtl-content text-right">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Right Column (RTL primary) - Text Content */}
          <ScrollReveal
            animation="slide-left"
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-bold mb-6 border border-success/20">
              أقصر طريق للحرية المالية
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground mb-8 leading-tight">
              الراتب الشهري لن يجعلك غنياً <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-success to-brand">
                هذا هو وقت التغيير الحقيقي
              </span>
            </h2>

            <div className="space-y-6 text-xl text-muted-foreground leading-relaxed font-medium">
              <p>
                بينما يشتكي الجميع من قلة الوظائف وغلاء المعيشة، هناك فئة صامتة
                من الشباب تصنع ثروات يومياً من غرف نومهم باستخدام الذكاء
                الاصطناعي.
              </p>
              <p>
                الذكاء الاصطناعي ليس مجرد "أداة ذكية".. إنه{" "}
                <strong className="text-success font-black">
                  آلة طباعة أموال
                </strong>{" "}
                إذا عرفت كيف تستخدمه لتقديم قيمة حقيقية وخدمات يطلبها السوق
                ويدفع مقابلها آلاف الدولارات.
              </p>
            </div>
          </ScrollReveal>

          {/* Left Column - Stat Cards */}
          <div className="order-2 lg:order-1 flex flex-col gap-6">
            <ScrollReveal
              animation="slide-right"
              delay={0.1}
              className="glass glass-border rounded-2xl p-8 relative overflow-hidden flex items-center justify-between"
            >
              <div className="absolute right-0 top-0 w-32 h-full bg-brand/5" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                  <div className="w-8 h-8 rounded-full bg-brand animate-pulse-slow" />
                </div>
                <div>
                  <h3 className="text-5xl font-black text-brand mb-1">$100M+</h3>
                  <p className="text-lg text-foreground font-bold">
                    حجم سوق الذكاء الاصطناعي
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal
              animation="slide-right"
              delay={0.2}
              className="glass glass-border rounded-2xl p-8 relative overflow-hidden flex items-center justify-between"
            >
              <div className="absolute right-0 top-0 w-32 h-full bg-success/5" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <div
                    className="w-8 h-8 rounded-full bg-success animate-pulse-slow"
                    style={{ animationDelay: "1s" }}
                  />
                </div>
                <div>
                  <h3 className="text-5xl font-black text-success mb-1">10x</h3>
                  <p className="text-lg text-foreground font-bold">
                    أسرع في الإنتاجية
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal
              animation="slide-right"
              delay={0.3}
              className="glass glass-border rounded-2xl p-8 relative overflow-hidden flex items-center justify-between"
            >
              <div className="absolute right-0 top-0 w-32 h-full bg-warning/5" />
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  <div
                    className="w-8 h-8 rounded-full bg-warning animate-pulse-slow"
                    style={{ animationDelay: "2s" }}
                  />
                </div>
                <div>
                  <h3 className="text-5xl font-black text-warning mb-1">0</h3>
                  <p className="text-lg text-foreground font-bold">خبرة مطلوبة</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Callout Card */}
        <ScrollReveal
          animation="slide-up"
          delay={0.4}
          className="w-full relative"
        >
          <div className="animated-border rounded-[2.5rem]">
            <div className="glass-card rounded-[2.5rem] p-12 text-center relative overflow-hidden group bg-background/80 dark:bg-black/80">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Floating Sparkles */}
              <Sparkles className="absolute top-8 right-12 w-6 h-6 text-brand opacity-50 animate-pulse" />
              <Sparkles
                className="absolute bottom-12 left-16 w-8 h-8 text-success opacity-50 animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <Sparkles
                className="absolute top-1/2 left-1/4 w-4 h-4 text-warning opacity-50 animate-pulse"
                style={{ animationDelay: "2s" }}
              />

              <div className="relative z-10">
                <p className="text-3xl sm:text-4xl font-black text-foreground mb-4 drop-shadow-md">
                  لا تضيع المزيد من سنوات عمرك.
                </p>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                  انضم إلينا اليوم لتتعلم المهارة الوحيدة التي يمكنها مضاعفة
                  دخلك خلال الـ 60 يوماً القادمة.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
