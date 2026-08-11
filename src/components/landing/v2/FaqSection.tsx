"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Wach hadchi khdam lia ila ma 3mri 9rit code aw programmation?",
    answer: "Ah tab3an! Had l'challenge m9ad b dhabt l nass li ma 3mrehom ketbo ster dial code. Kan-khdmo b des outils No-Code b7al Make.com w interfaces m9adin, w kolchi machrou7 étape par étape. L'objectif howa tbni systeme kheddam, machi tweli dev.",
  },
  {
    question: "Ch7al dial lwe9t khasni nkhses l hadchi f nhar?",
    answer: "Khassek 1-2 sa3at f nhar. Ila knti kheddam aw ka t9ra, t9der tkhdem f lil aw f l'weekend. L'mohim howa t'appliqui chno ka tchouf fl vidéos b stmrar.",
  },
  {
    question: "Wach kayn chi garantisat blli ghadi njib clients?",
    answer: "Makayen ta chi garantis fl business. L'garanti lwe7id howa anaka ghat3lem skills مطلوبين bzaf f sou9, w anana ghan3tiwk les scripts w stratégies exacts li kheddamin lina. Ila tbe9ti l'khdma w b9iti mwe9ef 3la l'outreach, les résultats ghadi yjiw.",
  },
  {
    question: "Wach 200 Dh hiya l'khalas lwe7id wla kayn des frais okhrin?",
    answer: "200 Dh hiya l'khalas l'we7id dial l'challenge w l'accés l l'community. Walakin, bzaf dial les outils li ghan-khdmo bihom (b7al Make.com w OpenAI) 3ndhom versions gratuits li kadyen f l'awal, w après t9der t7taj tchri abonnements sghar 3la 7sab ch7al dl clients dkhlti (ex: Make.com ب 9$/mois).",
  },
  {
    question: "Ila 7selt f chi 7aja, chkoun ghay3awenni?",
    answer: "Ghatl9a l'support f l'community VIP dialna 24/7. T9der tswel ay sou'al w drari wla ana ghanjawbok. Zid 3liha, kayn 2 appels live kol simana fin kan-diro Live Troubleshooting w kan7ello les problèmes en direct.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#0a0a0a] py-24 sm:py-32 relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Questions li <span className="text-orange-500">kaytswlo bzaf</span>
          </h2>
          <p className="text-lg text-zinc-400">
            Kolchi li khassek t3rf 9bel ma tbda l'challenge dial 60 yom.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen ? "bg-[#171717] border-orange-500/50" : "bg-[#171717]/50 border-[#262626] hover:border-zinc-700"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`text-lg font-bold pr-8 transition-colors ${isOpen ? "text-orange-400" : "text-white"}`}>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-orange-500" : "text-zinc-500"
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
