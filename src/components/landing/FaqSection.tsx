"use client";

import { motion } from "framer-motion";
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
    <section className="relative py-24 sm:py-32 bg-background">
      <div className="container max-w-3xl mx-auto px-6 text-right rtl-content">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground mb-6">الأسئلة الشائعة</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-brand/50 transition-colors">
                <AccordionTrigger className="text-lg font-bold hover:no-underline hover:text-brand transition-colors text-right py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
