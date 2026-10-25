"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { CHALLENGE_OFFER } from "@/data/challenge-offer";
import { SectionHeading, cardSurface } from "./primitives";

const FAQS = [
  {
    q: "Wach hadchi khdam lia ila ma 3mri 9rit code aw programmation?",
    a: "Ah tab3an! Had l'challenge m9ad b dhabt l nass li ma 3mrehom ketbo ster dial code. Kan-khdmo b des outils No-Code b7al Make.com w interfaces m9adin, w kolchi machrou7 etape par etape. L'objectif howa tbni systeme kheddam, machi tweli dev.",
  },
  {
    q: "Ch7al dial l'we9t khasni nkhses l hadchi f nhar?",
    a: "Khassek 1-2 sa3at f nhar. Ila knti kheddam aw ka t9ra, t9der tkhdem f lil aw f l'weekend. L'mohim howa t'appliqui chno ka tchouf f l'videos b stmrar.",
  },
  {
    q: "Wach kayn chi garantisat blli ghadi njib clients?",
    a: "Makayen ta chi garanti fl business. L'garanti lwe7id howa anaka ghat3lem skills matloubin bzaf f sou9, w anana ghan3tiwk les scripts w strategies exacts li kheddamin lina. Ila tbe9ti l'khdma w b9iti mwe9ef 3la l'outreach, les resultats ghadi yjiw.",
  },
  {
    q: "Wach kayn des frais okhrin mn ghir taman d l'challenge?",
    a: "Taman d l'challenge fih l'formation w l'acces l l'platforme. Walakin, bzaf dial les outils li ghan-khdmo bihom (b7al Make.com w OpenAI) 3ndhom versions gratuits li kafyin f l'awal, w apres t9der t7taj tchri abonnements sghar 3la 7sab ch7al dl clients dkhlti (ex: Make.com b 9$/mois).",
  },
  {
    q: "Ila 7selt f chi 7aja, chkoun ghay3awenni?",
    a: "Ghatl9a l'support f l'community VIP dialna 24/7. T9der tswel ay sou'al w drari wla ana ghanjawbok. Zid 3liha, kayn 2 appels live kol simana fin kan-diro Live Troubleshooting w kan7ello les problemes en direct.",
  },
  {
    q: "Kifach kaytm verification dyal l'khalas w tfa3il l'compte?",
    a: "Fach katsali l'inscription, katl9a les coordonnees bancaires (CIH, Wafacash, Cash Plus). Kaddir virement, katsift l'recu f WhatsApp, w l'compte dyalk kaytfa33el f d9ayeq m3a l'acces l l'platforme.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-5 py-20 sm:px-6 sm:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Questions li kaytswlo bzaf"
          title={
            <>
              Kolchi li khassek t3rf <span className="text-[#D6A15D]">9bel ma tbda.</span>
            </>
          }
          intro="Kolchi li khassek t3rf 9bel ma tbda l'challenge dial 60 yom."
        />

        <div className="mt-14 space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`${cardSurface} overflow-hidden transition-colors ${
                  isOpen ? "border-[#D6A15D]/40 bg-[#0F131D]" : "hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className={`text-base sm:text-lg font-bold pr-4 ${isOpen ? "text-[#D6A15D]" : "text-white"}`}>
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#A7AFBE] transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#D6A15D]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base leading-relaxed text-[#A7AFBE] border-t border-white/[0.04] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
