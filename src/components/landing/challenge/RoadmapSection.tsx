"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Server, Brain, Send, DollarSign } from "lucide-react";
import { SectionHeading } from "./primitives";

const STEPS = [
  {
    number: "1",
    days: "Ayam 1 – 15",
    icon: Server,
    title: "Sass Technique: No-Code & Make.com",
    tagline: "T-connecter Make.com, OpenAI, w WhatsApp API bla ta ster d l'code.",
    points: [
      "Kifach t'connecti Make.com m3a n'importe quel application.",
      "T9ad WhatsApp API w t'automatisi les messages 24/7.",
      "T'intégrer OpenAI w tkhlih yjaweb f blast sekretira.",
    ],
  },
  {
    number: "2",
    days: "Ayam 16 – 30",
    icon: Brain,
    title: "L'Mokh dial l'IA: Prompts & Google Calendar",
    tagline: "Kifach l'IA katfhem chno bgha l'client w katkhod les RDVs.",
    points: [
      "Tkteb des prompts b Darija/Français li kayjibo résultats précis.",
      "L'IA kat9ra Google Calendar w katchouf les créneaux li khawyin.",
      "Gestion dial les objections w les questions s3ab bla ma tghlet.",
    ],
  },
  {
    number: "3",
    days: "Ayam 31 – 45",
    icon: Send,
    title: "L'Outreach: Scraping & Cold Contact",
    tagline: "Scraping dial data, w kifach tsifet cold messages li kayjibo les clients.",
    points: [
      "Scraping dial les numéros w emails d les cliniques w agences b Apify.",
      "Kifach tsifet messages bla ma tti7 f spam aw tban bhal robot.",
      "Scripts dial l'Outreach mjerbin li kayjibo les rendez-vous.",
    ],
  },
  {
    number: "4",
    days: "Ayam 46 – 60",
    icon: DollarSign,
    title: "L'Bi3: Closing & Retainers",
    tagline: "T-cloner l'système l'client, takhod 4,000 Dh f l'awal, w 400 Dh kol ch'her.",
    points: [
      "Kifach t'closi l'client f appel dial 15 minutes b demo khdama.",
      "L'offre Irrésistible: Kifach tbi3 b 0 Risk l'client bach ytiq.",
      "Pricing: Setup fee (4,000 Dh) + Retainer mensuel d maintenance (400 Dh).",
    ],
  },
];

export function RoadmapSection() {
  return (
    <section id="roadmap" className="relative px-5 py-20 sm:px-6 sm:py-28 border-t border-white/[0.05]">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-[#D6A15D]/[0.04] blur-[160px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-5xl relative z-10">
        <SectionHeading
          eyebrow="Khareetat tariq"
          title={
            <>
              Tri9ek men 0 Dh l&apos;awal client b{" "}
              <span className="text-[#D6A15D]">4,000 Dh.</span>
            </>
          }
          intro="Kifach ghatweli men hna l 60 yom. La méthode exacte li ghadi tbni w tbi3 biha les Systemes d'IA f l'Maghrib."
        />

        {/* Timeline with vertical track */}
        <div className="mt-16 relative">
          {/* Vertical gradient bar */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D6A15D] via-[#477CFF]/50 to-transparent md:-translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {STEPS.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = step.icon;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } pl-16 md:pl-0`}
                >
                  {/* Timeline Badge */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="absolute left-0 md:left-1/2 w-12 h-12 -translate-x-0 md:-translate-x-1/2 rounded-full bg-[#0A0D14] border-2 border-[#D6A15D] flex items-center justify-center shadow-[0_0_20px_rgba(214,161,93,0.3)] z-10"
                  >
                    <span className="text-[#D6A15D] font-extrabold text-base">
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Step Card Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className={`w-full md:w-[calc(50%-40px)] rounded-3xl bg-[#0A0D14] border border-white/[0.08] p-6 sm:p-7 shadow-xl hover:border-[#D6A15D]/40 transition-colors ${
                      isEven ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D6A15D]">
                        {step.days}
                      </span>
                      <Icon className="h-5 w-5 text-[#8AA8FF]" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-white mt-3">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A7AFBE] mt-1.5 leading-relaxed">
                      {step.tagline}
                    </p>

                    <ul className="mt-4 space-y-2 pt-3 border-t border-white/[0.06]">
                      {step.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D6A15D] mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
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
