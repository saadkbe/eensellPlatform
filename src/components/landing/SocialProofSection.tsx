"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "أحمد م.",
    role: "عضو مؤسس",
    income: "+$1,200 أول شهر",
    content: "كنت أظن أن العمل على الإنترنت مجرد وهم. بفضل الأدوات والتوجيه المباشر هنا، أغلقت أول عميل لي بـ 1200 دولار بعد 3 أسابيع فقط."
  },
  {
    name: "سارة ب.",
    role: "عضو مؤسس",
    income: "+$850 أسبوعياً",
    content: "استطعت ترك وظيفتي القديمة. المجتمع هنا علمّني كيف أستخدم الذكاء الاصطناعي لأنجز عمل أسبوع في يومين فقط وأضاعف أرباحي."
  },
  {
    name: "ياسين ع.",
    role: "عضو مؤسس",
    income: "بناء وكالة ذكاء اصطناعي",
    content: "الوصول لأدوات الذكاء الاصطناعي وفر علي مئات الساعات وآلاف الدولارات. أنا الآن أدير وكالتي الخاصة بفضل استراتيجيات هذا البرنامج."
  }
];

export function SocialProofSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-background border-y border-border/40">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 fill-warning text-warning" />
            ))}
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">قصص نجاح واقعية، أرباح حقيقية.</h2>
          <p className="text-xl text-muted-foreground">لا نبيع الوهم. هؤلاء أشخاص مثلك اتخذوا القرار وبدأوا في جني الأرباح.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-[2rem] bg-card border border-border shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 text-right rtl-content relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-success to-brand opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                   <span className="text-success font-black text-lg bg-success/10 px-3 py-1 rounded-lg w-fit mb-3">{test.income}</span>
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${test.name}`} alt={test.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-lg">{test.name}</h4>
                        <p className="text-sm text-muted-foreground">{test.role}</p>
                      </div>
                   </div>
                </div>
              </div>
              <p className="text-foreground/80 leading-relaxed text-lg font-medium">
                "{test.content}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Live Notification Style */}
        <div className="mt-20 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-success/5 border border-success/20 shadow-lg"
          >
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-base font-bold text-foreground">طالب جديد حقق أول أرباحه اليوم</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
