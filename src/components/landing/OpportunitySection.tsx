"use client";

import { motion } from "framer-motion";

export function OpportunitySection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
      
      <div className="container max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-bold mb-6 border border-success/20">
            أقصر طريق للحرية المالية
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground mb-10 leading-tight">
            الراتب الشهري لن يجعلك غنياً <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-success to-brand">هذا هو وقت التغيير الحقيقي</span>
          </h2>

          <div className="space-y-8 text-xl sm:text-2xl text-foreground/80 leading-relaxed text-right rtl-content max-w-3xl mx-auto font-medium">
            <p>
              بينما يشتكي الجميع من قلة الوظائف وغلاء المعيشة، هناك فئة صامتة من الشباب تصنع ثروات يومياً من غرف نومهم باستخدام الذكاء الاصطناعي.
            </p>
            <p>
              الذكاء الاصطناعي ليس مجرد "أداة ذكية".. إنه <strong className="text-success font-black">آلة طباعة أموال</strong> إذا عرفت كيف تستخدمه لتقديم قيمة حقيقية وخدمات يطلبها السوق ويدفع مقابلها آلاف الدولارات.
            </p>
            <div className="p-10 mt-12 rounded-[2rem] glass glass-border shadow-2xl relative overflow-hidden group bg-white dark:bg-black border-2 border-brand/20">
              <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <p className="text-2xl sm:text-3xl font-black text-foreground text-center mb-4">
                  لا تضيع المزيد من سنوات عمرك.
                </p>
                <p className="text-lg text-muted-foreground text-center">
                  انضم إلينا اليوم لتتعلم المهارة الوحيدة التي يمكنها مضاعفة دخلك خلال الـ 60 يوماً القادمة.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
