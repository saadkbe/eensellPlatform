"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "أحمد م.",
    role: "عضو مؤسس",
    income: "+$1,200 أول شهر",
    gradient: "from-brand to-success",
    seed: "Ahmad",
    content: "كنت أظن أن العمل على الإنترنت مجرد وهم. بفضل الأدوات والتوجيه المباشر هنا، أغلقت أول عميل لي بـ 1200 دولار بعد 3 أسابيع فقط."
  },
  {
    name: "سارة ب.",
    role: "عضو مؤسس",
    income: "+$850 أسبوعياً",
    gradient: "from-success to-warning",
    seed: "Sarah",
    content: "استطعت ترك وظيفتي القديمة. المجتمع هنا علمّني كيف أستخدم الذكاء الاصطناعي لأنجز عمل أسبوع في يومين فقط وأضاعف أرباحي."
  },
  {
    name: "ياسين ع.",
    role: "عضو مؤسس",
    income: "بناء وكالة ذكاء اصطناعي",
    gradient: "from-brand to-purple-500",
    seed: "Yassine",
    content: "الوصول لأدوات الذكاء الاصطناعي وفر علي مئات الساعات وآلاف الدولارات. أنا الآن أدير وكالتي الخاصة بفضل استراتيجيات هذا البرنامج."
  },
  {
    name: "كريم ل.",
    role: "عضو مؤسس",
    income: "+$2,000 شهرياً",
    gradient: "from-purple-500 to-rose-500",
    seed: "Karim",
    content: "بدأت من الصفر بدون أي خبرة. خلال 6 أسابيع كنت أحقق دخل ثابت من خدمات الذكاء الاصطناعي."
  },
  {
    name: "نور ح.",
    role: "عضو مؤسس",
    income: "3 عملاء في أسبوع واحد",
    gradient: "from-rose-500 to-warning",
    seed: "Nour",
    content: "الأدوات والملقنات الجاهزة وفرت علي ساعات من العمل. الآن أنا أقدم خدمات بجودة عالية وسرعة مذهلة."
  }
];

export function SocialProofSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-background border-y border-border/40 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <div className="text-center flex flex-col items-center">
          
          {/* Avatar Stack & Stars */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-8"
          >
            <div className="flex -space-x-3 rtl:space-x-reverse mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-secondary shadow-sm relative z-10">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=member${i}`} alt="Member" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-auto px-4 h-12 rounded-full border-2 border-background bg-secondary flex items-center justify-center relative z-20 text-sm font-bold text-foreground">
                +200 عضو
              </div>
            </div>
            
            <div className="inline-flex items-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-warning text-warning" />
              ))}
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-foreground mb-6"
          >
            قصص نجاح واقعية، أرباح حقيقية.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            لا نبيع الوهم. هؤلاء أشخاص مثلك اتخذوا القرار وبدأوا في جني الأرباح.
          </motion.p>
        </div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden py-10">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
        
        <div className="marquee-track flex w-max">
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((test, idx) => (
            <div
              key={idx}
              className="min-w-[350px] max-w-[400px] mx-4 p-8 rounded-[2rem] bg-card border border-border shadow-md hover:shadow-xl transition-all text-right rtl-content relative overflow-hidden group flex flex-col"
            >
              <div className={`absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l ${test.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col items-start w-full gap-4">
                   <span className="text-success font-black text-sm bg-success/10 px-3 py-1.5 rounded-xl w-fit border border-success/20 glow-success">{test.income}</span>
                   
                   <div className="flex items-center gap-3 w-full">
                      <div className="w-14 h-14 rounded-full bg-brand/5 flex items-center justify-center overflow-hidden border border-border">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${test.seed}`} alt={test.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{test.name}</h4>
                        <p className="text-sm text-muted-foreground">{test.role}</p>
                      </div>
                   </div>
                </div>
              </div>
              
              <p className="text-foreground/80 leading-relaxed text-lg font-medium flex-1">
                "{test.content}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Toast */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-6 z-40"
      >
        <div className="glass bg-background/80 backdrop-blur-xl border border-border shadow-elevated px-6 py-4 rounded-2xl flex items-center gap-4 w-max max-w-[90vw]">
          <span className="flex h-3 w-3 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
          </span>
          <span className="text-sm sm:text-base font-bold text-foreground">طالب جديد حقق 1500 درهم اليوم</span>
        </div>
      </motion.div>

    </section>
  );
}
