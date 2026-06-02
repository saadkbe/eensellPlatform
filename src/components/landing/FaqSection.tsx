"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "هل هذه المنصة مناسبة للمبتدئين؟",
    answer: "نعم تماماً. صممنا المنصة لتأخذك من الصفر، خطوة بخطوة، حتى وإن لم تكن لديك أي خبرة سابقة في العمل على الإنترنت أو استخدام الذكاء الاصطناعي."
  },
  {
    question: "كيف تعمل المكالمات المباشرة؟",
    answer: "نجتمع مرتين أسبوعياً في مكالمات جماعية خاصة. نناقش الاستراتيجيات، نقوم بتطبيق عملي، ونجيب على كل أسئلتك وتحدياتك وجهاً لوجه."
  },
  {
    question: "إلى متى يستمر وصولي للمنصة؟",
    answer: "إذا انضممت الآن كعضو مؤسس، ستحصل على وصول مدى الحياة للمنصة ولجميع التحديثات المستقبلية دون أي رسوم إضافية."
  },
  {
    question: "ما الذي سأتعلمه بالتحديد؟",
    answer: "ستتعلم كيفية استخدام أدوات الذكاء الاصطناعي لتقديم خدمات رقمية عالية القيمة، بناء منتجات رقمية، وإيجاد عملاء، كل ذلك بهدف الوصول إلى أول دولار لك على الإنترنت ثم التوسع."
  },
  {
    question: "هل هذا مناسب للطلاب؟",
    answer: "بالطبع! المنصة مصممة لتكون مرنة، والمكالمات يتم تسجيلها لتتمكن من مشاهدتها في أي وقت. إنها فرصة مثالية لبناء مهارات ودخل حقيقي أثناء دراستك."
  },
  {
    question: "ماذا يحدث بعد الدفع؟",
    answer: "ستحصل فوراً على بريد إلكتروني يحتوي على تفاصيل الدخول للمنصة، رابط الانضمام للمجتمع الخاص، وجدول المكالمات المباشرة لتبدأ رحلتك فوراً."
  }
];

export function FaqSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-background overflow-hidden">
      {/* Background Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--color-foreground) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container max-w-6xl mx-auto px-6 text-right rtl-content relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column - Branding */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-start text-center lg:text-right">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] lg:text-[14rem] font-black text-foreground/[0.03] select-none pointer-events-none z-0">
              FAQ
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative z-10 mt-10 lg:mt-20"
            >
              <div className="w-20 h-20 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-8 mx-auto lg:mx-0 shadow-[0_0_40px_rgba(59,130,246,0.2)] glow-blue">
                <HelpCircle className="w-10 h-10 text-brand" />
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                الأسئلة <br className="hidden lg:block" />
                الشائعة
              </h2>
              <p className="text-xl text-muted-foreground font-medium">
                كل ما تحتاج معرفته قبل الانضمام.
              </p>
            </motion.div>
          </div>

          {/* Right Column - Accordion */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Accordion className="w-full space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem 
                    key={idx} 
                    value={`item-${idx}`} 
                    className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-brand/50 data-[state=open]:border-r-4 data-[state=open]:bg-brand/5 transition-all shadow-sm overflow-hidden"
                  >
                    <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-brand transition-colors text-right py-5 group">
                      <div className="flex items-center gap-4 text-right">
                        <span className="text-sm font-black text-brand bg-brand/10 px-2 py-1 rounded-md shrink-0">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base font-medium pr-14">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
