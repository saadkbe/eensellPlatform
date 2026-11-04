"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  MessageSquare,
  Mail,
  FileText,
  Users,
  Video,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function FeaturesSection() {
  const { dir } = useLanguage();

  const steps = [
    {
      num: "01",
      badge: "DATA EXTRACTION",
      title: "Google Maps Intelligence Scraper",
      desc: "Extract hundreds of qualified local businesses in Casablanca, Rabat, Tangier, and Marrakech. Get decision-maker WhatsApp numbers, ratings, and physical addresses without API limits.",
      highlight: "Over 14,000 Moroccan businesses indexed",
      icon: MapPin,
      color: "emerald",
      bgGradient: "from-emerald-500/10 to-teal-500/5",
      borderColor: "group-hover:border-emerald-300",
    },
    {
      num: "02",
      badge: "LEAD MANAGEMENT",
      title: "Smart Moroccan CRM Pipeline",
      desc: "Automatically categorize leads into Hot Prospects, In Discussion, Closed, and Invoiced. Track conversation history, follow-up reminders, and deal values in MAD.",
      highlight: "Kanban drag-and-drop workflow",
      icon: Layers,
      color: "blue",
      bgGradient: "from-blue-500/10 to-indigo-500/5",
      borderColor: "group-hover:border-blue-300",
    },
    {
      num: "03",
      badge: "CONVERSION ENGINE",
      title: "WhatsApp Studio with Voice Notes",
      desc: "Test proven Darija & French scripts inside an interactive iPhone simulator. Generate natural voice note pitches that eliminate sales resistance and get answered within minutes.",
      highlight: "84.6% Moroccan response rate",
      icon: MessageSquare,
      color: "emerald",
      bgGradient: "from-emerald-500/10 to-green-500/5",
      borderColor: "group-hover:border-emerald-300",
    },
    {
      num: "04",
      badge: "AI COPYWRITER",
      title: "Cold Email AI Drafter & Gmail Sync",
      desc: "GPT-4o fine-tuned for high-converting B2B outreach. Features built-in deliverability checks, personalized hooks, and 1-click sync to your personal Gmail inbox.",
      highlight: "Zero spam filter triggers",
      icon: Mail,
      color: "purple",
      bgGradient: "from-purple-500/10 to-violet-500/5",
      borderColor: "group-hover:border-purple-300",
    },
    {
      num: "05",
      badge: "LEGAL & CLOSING",
      title: "Moroccan Invoicing & Devis Studio",
      desc: "Generate professional Moroccan devis (quotes) and factures (invoices) with MAD totals, deposit requirements (acompte), and instant print-ready PDF export.",
      highlight: "Legally compliant templates",
      icon: FileText,
      color: "amber",
      bgGradient: "from-amber-500/10 to-orange-500/5",
      borderColor: "group-hover:border-amber-300",
    },
    {
      num: "06",
      badge: "LIVE MENTORSHIP",
      title: "Weekly Deal Rooms & Private Network",
      desc: "2 live weekly strategy sessions with Saad. Review live proposals before sending to clients, practice pitch calls, and collaborate with 350+ ambitious agency founders.",
      highlight: "Live Zoom calls every Tuesday & Saturday",
      icon: Video,
      color: "indigo",
      bgGradient: "from-indigo-500/10 to-blue-500/5",
      borderColor: "group-hover:border-indigo-300",
    },
  ];

  return (
    <section
      id="features"
      dir={dir}
      className="relative py-20 sm:py-32 bg-white text-slate-900 overflow-hidden"
    >
      {/* Background soft ambient accents */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-slate-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-2xs mb-4 text-xs font-bold text-slate-700 tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>The 6-Step Autonomous Machine</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-5"
          >
            Everything You Need to Run an AI Agency{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
              Inside a Single Screen.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            No complicated tool stacks, no 50 open Chrome tabs. A streamlined, unified pipeline engineered specifically for the Moroccan business ecosystem.
          </motion.p>
        </div>

        {/* 6-Step Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`group relative rounded-3xl bg-white border border-slate-200/90 p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${step.borderColor}`}
              >
                <div>
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 font-mono group-hover:text-slate-900 transition-colors">
                      {step.num}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {step.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-900 mb-5 shadow-2xs group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-slate-900" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 mb-3 tracking-tight leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Highlight pill */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{step.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-black text-slate-950">
              Ready to automate your B2B client acquisition?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Join 350+ founders already closing deals across Casablanca, Rabat, Marrakech, and Tangier.
            </p>
          </div>

          <Link href="/sign-up" className="shrink-0">
            <Button
              size="lg"
              className="h-11 px-6 rounded-xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <span>Explore The Workspace</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
