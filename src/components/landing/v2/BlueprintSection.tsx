"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Étape 1: Sass Technique.",
    description: "T-connecter Make.com, OpenAI, w WhatsApp API bla code.",
    features: [
      "Kifach t'connecti Make.com m3a n'importe quel app.",
      "T9ad WhatsApp API w t'automatisi les messages.",
      "T'intégrer OpenAI w tkhlih yjaweb f blastk."
    ]
  },
  {
    number: "2",
    title: "Étape 2: L'Mokh dial l'IA.",
    description: "Prompt engineering, l'9raya dial Google Calendar, w kifach l'IA katfhem chno bgha l'client.",
    features: [
      "Tkteb prompts li kayjibo résultats précis.",
      "L'IA kat9ra Google Calendar w katchouf les dispos.",
      "Gestion dial les objections w les questions s3ab."
    ]
  },
  {
    number: "3",
    title: "Étape 3: L'Outreach.",
    description: "Scraping dial data, w kifach tsifet cold emails li kayejibo les clients.",
    features: [
      "Scraping dial les numéros w emails b outils b7al Apify.",
      "Kifach tsifet cold emails bla ma tti7 f spam.",
      "Scripts dial l'Outreach li kayejibo les RDVs automatiqument."
    ]
  },
  {
    number: "4",
    title: "Étape 4: L'Bi3.",
    description: "T-cloner l'système l'client, takhod 4,000 Dh f l'awal, w 400 Dh kol ch'her.",
    features: [
      "Kifach t'closi l'client f appel dial 15 minutes.",
      "L'offre Irrésistible: Kifach tbe3 b 0 Risk l'client.",
      "Pricing: Setup fee (4,000 Dh) + Retainer mensuel (400 Dh)."
    ]
  },
];

export function BlueprintSection() {
  return (
    <section id="programme" className="bg-[#0a0a0a] py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] max-w-[800px] aspect-square bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Tri9ek men 0Dh l&apos;awal client b <span className="text-[#f97316]">4,000 Dh</span>.
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Kifach ghatweli men hna l 60 yom. La méthode exact li ghadi tbni w tbi3 biha les Systemes d&apos;IA.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-orange-600/50 to-transparent md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } pl-16 md:pl-0`}
                >
                  {/* Timeline Node */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="absolute left-0 md:left-1/2 w-12 h-12 -translate-x-0 md:-translate-x-1/2 rounded-full bg-[#171717] border border-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)] z-10"
                  >
                    <span className="text-orange-500 font-bold text-lg">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Card Content */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: isEven ? -50 : 50,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.1 }}
                    className={`w-full md:w-[45%] ${
                      isEven ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div className="bg-[#171717] border border-[#262626] rounded-2xl p-8 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300 group relative overflow-hidden">
                      {/* Subtle hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <h3 className="text-2xl font-bold text-white mb-3 relative z-10">
                        {step.title}
                      </h3>
                      <p className="text-zinc-400 text-lg relative z-10 leading-relaxed mb-6">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-3 relative z-10">
                        {step.features?.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                            <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
