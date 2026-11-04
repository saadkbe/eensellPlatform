"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  MessageSquare,
  Mail,
  FileText,
  Layers,
  Key,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  BookmarkCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function WorkspaceShowcaseSection() {
  const { dir } = useLanguage();

  const workspaceTools = [
    {
      icon: MapPin,
      name: "Maps Intelligence Scraper",
      tag: "STEP 1",
      desc: "Extract hundreds of local Casablanca, Rabat & Marrakech businesses with direct WhatsApp phone numbers, ratings, and physical addresses.",
      color: "emerald",
    },
    {
      icon: Layers,
      name: "Smart Moroccan CRM",
      tag: "STEP 2",
      desc: "Organize leads across Hot, Discussion, Closed, and Invoiced stages. Calculate estimated pipeline MAD value in real-time.",
      color: "blue",
    },
    {
      icon: MessageSquare,
      name: "WhatsApp Outreach Studio",
      tag: "STEP 3",
      desc: "Simulate Darija & French voice notes inside a live iPhone frame. Deploy angles tested to trigger 84%+ response rates.",
      color: "green",
    },
    {
      icon: Mail,
      name: "Cold Email AI Drafter",
      tag: "STEP 4",
      desc: "GPT-4o fine-tuned for local corporate outreach with deliverability spam checks and 1-click sync to your personal Gmail.",
      color: "purple",
    },
    {
      icon: FileText,
      name: "Devis & Invoicing Studio",
      tag: "STEP 5",
      desc: "Generate professional Moroccan devis (quotes) and factures (invoices) with MAD totals, deposit clauses, and PDF export.",
      color: "amber",
    },
    {
      icon: BookmarkCheck,
      name: "Notes & Strategy Scratchpad",
      tag: "STEP 6",
      desc: "Keep client objection notes, pitch scripts, and pinned follow-ups organized in persistent auto-saving workspaces.",
      color: "indigo",
    },
  ];

  return (
    <section
      id="workspace"
      dir={dir}
      className="relative py-20 sm:py-32 bg-[#FAFBFE] text-slate-900 overflow-hidden border-t border-slate-200/70"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-cyan-100/40 via-indigo-100/30 to-emerald-100/30 rounded-full blur-[150px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs mb-4 text-xs font-bold text-slate-800 tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Autonomous Agency Operating System</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-4"
          >
            Eensell Workspace OS:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
              Your Entire Agency In One Screen.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed mb-6"
          >
            Replace 5 messy SaaS subscriptions. Scrape qualified clinics, launch Darija WhatsApp pitches, draft cold emails, and invoice 15,000 MAD contracts inside a unified, distraction-free environment.
          </motion.p>

          {/* BYO Keys Callout Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs text-xs font-semibold text-slate-700"
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-950">Bring Your Own Keys (BYOK):</span>
            <span className="text-slate-500">
              Users connect their own OpenAI, Gemini, or Groq API keys with zero platform markups and 100% data privacy.
            </span>
          </motion.div>
        </div>

        {/* ── EXCEPTIONAL WORKSPACE DASHBOARD SHOWCASE ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-5xl mx-auto mb-16"
        >
          {/* Subtle gradient glow behind frame */}
          <div className="absolute -inset-3 bg-gradient-to-r from-indigo-200/50 via-cyan-100/40 to-emerald-100/50 rounded-[3rem] blur-2xl opacity-70 pointer-events-none" />

          <div className="relative rounded-[2rem] sm:rounded-[2.5rem] p-2.5 sm:p-3.5 bg-white border border-slate-200/90 shadow-[0_25px_80px_-20px_rgba(15,23,42,0.14)]">
            {/* macOS Browser Header */}
            <div className="px-4 py-3 bg-slate-50/95 border-b border-slate-200/70 rounded-t-[1.6rem] sm:rounded-t-[2.1rem] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 text-[11px] font-mono text-slate-600 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>workspace.eensell.agency/overview</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">
                  Live Cloud Instance
                </span>
              </div>
            </div>

            {/* Dashboard Real Picture */}
            <div className="relative overflow-hidden rounded-b-[1.5rem] sm:rounded-b-[2rem] bg-slate-900 border border-slate-200/60 shadow-inner">
              <Image
                src="/images/Eensell Workspace.png"
                alt="Eensell Workspace Full Dashboard"
                width={1800}
                height={1100}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Floating Live Badge Top Left */}
            <div className="hidden md:flex absolute -top-5 -left-4 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-slate-900">Casablanca Scraper</p>
                <p className="text-[10px] text-slate-500 font-medium">+184 Dental Clinics Qualified</p>
              </div>
            </div>

            {/* Floating Live Badge Bottom Right */}
            <div className="hidden md:flex absolute -bottom-5 -right-4 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-slate-900">WhatsApp Darija Pitch</p>
                <p className="text-[10px] text-emerald-600 font-bold">✓✓ Client Meeting Booked</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 6 TOOLS BENTO CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workspaceTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-slate-900" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                      {tool.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-950 mb-2 leading-snug">
                    {tool.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Integrated with Eensell OS</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <Link href="/sign-up">
            <Button
              size="lg"
              className="h-11 px-7 rounded-xl text-xs sm:text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <span>Get Immediate Access to Eensell Workspace</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
