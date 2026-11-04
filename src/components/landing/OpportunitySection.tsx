"use client";

import { Sparkles, TrendingUp, Zap, Target, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function OpportunitySection() {
  const { dir } = useLanguage();

  const stats = [
    {
      value: "420,000+",
      label: "Registered Moroccan SMEs",
      sub: "Less than 2% have an AI customer service or WhatsApp bot.",
    },
    {
      value: "15,000 MAD",
      label: "Average Retainer Size",
      sub: "What clinics and real estate agencies happily pay for lead automation.",
    },
    {
      value: "84.6%",
      label: "Outreach Conversion",
      sub: "Response rate using localized Darija audio & personalized emails.",
    },
    {
      value: "30 Days",
      label: "To First Client",
      sub: "The average timeline for members following the step-by-step roadmap.",
    },
  ];

  return (
    <section
      dir={dir}
      className="relative py-20 sm:py-32 bg-white text-slate-900 overflow-hidden"
    >
      {/* Background subtle light ambient aura */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-100/40 via-indigo-50/30 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-2xs text-xs font-bold text-slate-700 tracking-wide uppercase"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#FF6B4A]" />
              <span>Morocco 2026 AI Goldrush</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]"
            >
              A Monthly Salary Won&apos;t Make You Free.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
                The Local Moroccan Market Will.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed"
            >
              While most people struggle competing with millions of global freelancers on Upwork for 5-dollar tasks, a quiet group of young Moroccan entrepreneurs is closing 10,000 to 30,000 MAD contracts right in Casablanca, Rabat, Marrakech, and Tangier using automated AI tools.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Zero Competition in French & Darija Automation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Local clinics and agencies lose 60% of their inquiries because they answer WhatsApp hours late. By giving them an instant autonomous booking bot, you fix their biggest revenue leak.
              </p>
            </motion.div>
          </div>

          {/* Right Stats Bento Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">
                      {stat.value}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {stat.label}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {stat.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
