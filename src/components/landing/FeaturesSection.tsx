"use client";

import { motion } from "framer-motion";
import { Video, Key, Users, Sparkles, Compass, Rocket, CalendarCheck, Target } from "lucide-react";

const features = [
  {
    icon: <Video className="w-6 h-6 text-brand" />,
    title: "مكالمات مباشرة أسبوعياً",
    description: "جلستين مباشرتين كل أسبوع للتوجيه، بناء الاستراتيجيات، والإجابة على كل استفساراتك خطوة بخطوة."
  },
  {
    icon: <Key className="w-6 h-6 text-warning" />,
    title: "وصول مدى الحياة للمؤسسين",
    description: "ادفع مرة واحدة اليوم، واحصل على كل التحديثات والأدوات المستقبلية مجاناً للأبد."
  },
  {
    icon: <Users className="w-6 h-6 text-success" />,
    title: "مجتمع طموح وخاص",
    description: "أحط نفسك بأشخاص يشاركونك نفس الطموح والعقلية. شبكة علاقاتك هي ثروتك."
  },
  {
    icon: <Sparkles className="w-6 h-6 text-info" />,
    title: "خزينة أدوات الذكاء الاصطناعي",
    description: "أفضل الأدوات والملقنات (Prompts) الجاهزة التي نستخدمها شخصياً لتسريع العمل وتحقيق الأرباح."
  },
  {
    icon: <Compass className="w-6 h-6 text-brand-light" />,
    title: "توجيه خطوة بخطوة",
    description: "من الصفر وحتى تحقيق أول دولار لك على الإنترنت. خريطة طريق واضحة ومجربة."
  },
  {
    icon: <Rocket className="w-6 h-6 text-error" />,
    title: "فرص حقيقية في السوق",
    description: "مشاركة أحدث فرص العمل الحر والمشاريع التي يمكنك البدء بها فوراً باستخدام الذكاء الاصطناعي."
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6">ماذا ستحصل عند انضمامك؟</h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            كل ما تحتاجه للبدء، مجمع في مكان واحد بأعلى معايير الجودة والتصميم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-card hover:border-brand/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10 flex flex-col items-start text-right rtl-content h-full">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
