"use client";

import { XCircle, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function TransformationSection() {
  const { dir } = useLanguage();

  const beforeItems = [
    "Wasting 4+ hours every day manually copy-pasting numbers from Google search into messy spreadsheets.",
    "Sending generic, boring cold messages that Moroccan business owners immediately ignore or mark as spam.",
    "Zero confidence when pitching: not knowing what AI service to offer or how much to charge in MAD.",
    "Struggling to write legal Moroccan devis, chasing clients for payment, and having zero contracts in place.",
    "Isolated and overwhelmed with no experienced mentor to review pitches or troubleshoot client objections.",
  ];

  const afterItems = [
    "Scraping 200+ qualified clinics, firms & agencies with verified decision-maker WhatsApp numbers in 3 minutes.",
    "Deploying proven Darija voice notes & French AI emails that achieve an exceptional 84%+ response rate.",
    "Offering high-margin, plug-and-play AI bots (WhatsApp booking, voice agents, CRM reactivations) for 10K–30K MAD.",
    "Generating professional Moroccan devis with 50% upfront deposit terms and legally compliant invoices in 1 click.",
    "Attending 2 live weekly Zoom sessions with Saad to refine proposals, review live deals, and scale with a community.",
  ];

  return (
    <section
      id="how-it-works"
      dir={dir}
      className="relative py-20 sm:py-32 bg-[#FAFBFE] text-slate-900 overflow-hidden border-t border-slate-200/70"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-indigo-100/30 to-purple-50/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs mb-4 text-xs font-bold text-slate-700 tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span>The Reality Check</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-5"
          >
            Stop The Manual Churn.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
              Switch to Predictable Growth.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Here is what separates struggling freelancers from automated Moroccan agency founders generating 20,000 to 50,000 MAD every single month.
          </motion.p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ── BEFORE CARD ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[2.5rem] bg-white border border-rose-200/80 p-8 sm:p-10 shadow-[0_4px_25px_rgba(244,63,94,0.04)] flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-black text-xs uppercase tracking-wider mb-8">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>The Traditional Freelance Nightmare</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-6 tracking-tight">
                Scattered, Manual & Unpredictable
              </h3>

              <ul className="space-y-5">
                {beforeItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5 text-rose-600">
                      <XCircle className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-xs font-semibold text-rose-600 flex items-center gap-2">
              <span>Result: Exhaustion, low retainers, constant feast or famine cycle.</span>
            </div>
          </motion.div>

          {/* ── AFTER CARD (Eensell System) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-[2.5rem] bg-white border-2 border-emerald-500/30 p-8 sm:p-10 shadow-[0_12px_45px_rgba(16,185,129,0.08)] flex flex-col justify-between overflow-hidden"
          >
            {/* Top decorative accent gradient line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-xs uppercase tracking-wider mb-8 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>The Eensell Autonomous Engine</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-950 mb-6 tracking-tight">
                Streamlined, Automated & Lucrative
              </h3>

              <ul className="space-y-5">
                {afterItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-xs font-bold text-emerald-700 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>Result: 20K–50K MAD monthly revenue, high-status clients, automated workflow.</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
