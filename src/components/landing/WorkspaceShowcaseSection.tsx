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
  Zap,
  Flame,
  Radio,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function WorkspaceShowcaseSection() {
  const { dir, t } = useLanguage();

  // 6 Core Tools ordered to match the banner's sequential agency execution roadmap
  const workspaceTools = [
    {
      icon: MapPin,
      name: t("ws_tool1_name"),
      tag: t("ws_tool1_step"),
      desc: t("ws_tool1_desc"),
      stepNum: "01",
      accent: "from-emerald-500/10 to-transparent",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      icon: MessageSquare,
      name: t("ws_tool3_name"),
      tag: t("ws_tool3_step"),
      desc: t("ws_tool3_desc"),
      stepNum: "02",
      accent: "from-green-500/10 to-transparent",
      badgeColor: "bg-green-50 text-green-700 border-green-200",
    },
    {
      icon: Mail,
      name: t("ws_tool4_name"),
      tag: t("ws_tool4_step"),
      desc: t("ws_tool4_desc"),
      stepNum: "03",
      accent: "from-purple-500/10 to-transparent",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      icon: Layers,
      name: t("ws_tool2_name"),
      tag: t("ws_tool2_step"),
      desc: t("ws_tool2_desc"),
      stepNum: "04",
      accent: "from-blue-500/10 to-transparent",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      icon: FileText,
      name: t("ws_tool5_name"),
      tag: t("ws_tool5_step"),
      desc: t("ws_tool5_desc"),
      stepNum: "05",
      accent: "from-amber-500/10 to-transparent",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      icon: BookmarkCheck,
      name: t("ws_tool6_name"),
      tag: t("ws_tool6_step"),
      desc: t("ws_tool6_desc"),
      stepNum: "06",
      accent: "from-orange-500/10 to-transparent",
      badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    },
  ];

  return (
    <section
      id="workspace"
      dir={dir}
      className="relative py-24 sm:py-36 bg-[#0a0a0a] text-white overflow-hidden border-t border-zinc-800/80"
    >
      {/* Background Ambient Glowing Lights & Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-orange-600/15 via-amber-500/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)] mb-5 text-xs font-extrabold tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span>{t("ws_badge")}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-5"
          >
            {t("ws_title_1")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
              {t("ws_title_2")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base md:text-lg text-zinc-400 font-normal max-w-2xl mx-auto leading-relaxed mb-8"
          >
            {t("ws_sub")}
          </motion.p>

          {/* BYO Keys Callout Banner with Sleek Dark Glass Styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs font-medium text-zinc-300 shadow-xl backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <Key className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">{t("ws_byo_title")}:</span>
            <span className="text-zinc-400">{t("ws_byo_desc")}</span>
          </motion.div>
        </div>

        {/* ── HIGH-CONVERTING CINEMATIC WORKSPACE BANNER HERO ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative max-w-5xl mx-auto mb-20 group"
        >
          {/* Intense Outer Neon Rim Lighting */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-500/40 via-amber-500/30 to-orange-600/40 rounded-[2.2rem] sm:rounded-[3rem] blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Glassmorphism Frame Container */}
          <div className="relative rounded-[2rem] sm:rounded-[2.7rem] p-2 sm:p-3 bg-zinc-950/90 border border-orange-500/40 shadow-[0_0_80px_rgba(249,115,22,0.2)] backdrop-blur-xl">
            {/* Top Command Status Bar */}
            <div className="px-5 py-3 bg-zinc-900/90 rounded-t-[1.5rem] sm:rounded-t-[2.2rem] border-b border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-zinc-400 hidden sm:inline tracking-wider">
                  app.eensell.com/workspace
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[11px] font-bold text-orange-400 tracking-wide">
                  Autonomous Agency Execution Suite
                </span>
              </div>
            </div>

            {/* The Cinematic Workspace Banner Display */}
            <div className="relative overflow-hidden rounded-b-[1.5rem] sm:rounded-b-[2.2rem] bg-black">
              <Image
                src="/WORKSPACE BANNER.png"
                alt="Eensell Workspace - Your AI Agency Command Center"
                width={1672}
                height={941}
                className="w-full h-auto object-cover rounded-b-[1.5rem] sm:rounded-b-[2.2rem] transform group-hover:scale-[1.005] transition-transform duration-700"
                priority
              />
            </div>

            {/* ── 4 Floating Futuristic Graphic Badges ── */}
            {/* Top-Left Floating Badge */}
            <div className="hidden lg:flex absolute -top-5 -left-5 items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-xs">
                <Zap className="w-4 h-4 fill-orange-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-white tracking-wide">Autonomous Engine</p>
                <p className="text-[10px] text-zinc-400 font-medium">B2B Scraper & Cold Outreach</p>
              </div>
            </div>

            {/* Top-Right Floating Badge */}
            <div className="hidden lg:flex absolute -top-5 -right-5 items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xs">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-white tracking-wide">4,000 MAD / Client</p>
                <p className="text-[10px] text-emerald-400 font-bold">+ Monthly Retainers</p>
              </div>
            </div>

            {/* Bottom-Left Floating Badge */}
            <div className="hidden lg:flex absolute -bottom-5 -left-5 items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-white tracking-wide">Morocco & Global Leads</p>
                <p className="text-[10px] text-zinc-400 font-medium">Casablanca, Rabat, Marrakech</p>
              </div>
            </div>

            {/* Bottom-Right Floating Badge */}
            <div className="hidden lg:flex absolute -bottom-5 -right-5 items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/95 border border-zinc-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 shadow-xs">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-white tracking-wide">WhatsApp AI Voicebot</p>
                <p className="text-[10px] text-emerald-400 font-bold">✓ Darija & French Booking</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 6 TOOLS BENTO CARDS (SEQUENTIAL ROADMAP) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaceTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="relative rounded-3xl p-7 bg-zinc-900/70 border border-zinc-800/90 hover:border-orange-500/50 hover:bg-zinc-900/90 shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(249,115,22,0.1)] transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                {/* Subtle Hover Gradient Accent */}
                <div
                  className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-br ${tool.accent} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-white group-hover:scale-110 group-hover:border-orange-500/50 group-hover:text-orange-400 transition-all duration-300 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-zinc-500">
                        {tool.stepNum}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30 font-mono">
                        {tool.tag}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2.5 leading-snug group-hover:text-orange-400 transition-colors">
                    {tool.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs font-semibold text-zinc-300 relative z-10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Integrated with Eensell Workspace OS</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── High-Converting CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center space-y-4"
        >
          <Link href="/sign-up" className="inline-block">
            <Button
              size="lg"
              className="h-13 px-9 rounded-2xl text-sm sm:text-base font-black bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 shadow-[0_0_40px_rgba(249,115,22,0.35)] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span>{t("ws_cta_btn")}</span>
              <ArrowRight className="w-5 h-5 ml-2 stroke-[2.5]" />
            </Button>
          </Link>
          <p className="text-xs text-zinc-500 font-medium">
            ⚡ Included with Eensell University • Lifetime Workspace Access • Instant BYOK Setup
          </p>
        </motion.div>
      </div>
    </section>
  );
}
