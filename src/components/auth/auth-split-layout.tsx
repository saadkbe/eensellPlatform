"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  MessageSquare,
  Sparkles,
  Users,
  Video,
  FileText,
  Key,
  Layers,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Share2,
  Plus,
  Lock,
  RotateCw,
  LayoutGrid,
} from "lucide-react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}

export function AuthSplitLayout({ children, mode }: AuthSplitLayoutProps) {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  return (
    <div className="min-h-screen w-full bg-[#E5E7EB]/70 sm:p-6 md:p-8 lg:p-10 flex items-center justify-center antialiased select-none">
      {/* ── macOS / Browser Window Shell Frame ── */}
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl border border-slate-300/80 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col">
        {/* Top Browser Chrome Bar */}
        <div className="px-4 py-2.5 bg-[#F9FAFB] border-b border-slate-200/80 flex items-center justify-between gap-4 text-slate-500 select-none">
          {/* Left: Window Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>

            <div className="hidden sm:flex items-center gap-1 ml-2 text-slate-400">
              <button type="button" className="p-1 hover:text-slate-700 transition-colors">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button type="button" className="p-1 hover:text-slate-700 transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center: Address Bar Pill */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-white border border-slate-200/90 rounded-lg text-xs font-mono text-slate-600 shadow-2xs">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>eensell.agency/auth</span>
              <RotateCw className="w-2.5 h-2.5 text-slate-300 ml-1 cursor-pointer hover:text-slate-600 transition-colors" />
            </div>
          </div>

          {/* Right: Browser Tools */}
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <button type="button" className="p-1 hover:text-slate-700 transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="p-1 hover:text-slate-700 transition-colors">
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="p-1 hover:text-slate-700 transition-colors">
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Main Two-Column Split Body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          {/* ══════════════════════════════════════════════
              LEFT COLUMN: Authentication Form
             ══════════════════════════════════════════════ */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white relative">
            <div className="w-full max-w-[340px] mx-auto flex flex-col items-center">
              {/* App Icon Mark */}
              <Link href="/" className="mb-5 group">
                <div className="w-11 h-11 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="font-black text-lg tracking-tighter">E</span>
                </div>
              </Link>

              {/* Title & Subtitle */}
              <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mb-1.5">
                  {mode === "sign-in" ? "Welcome to Eensell" : "Create your account"}
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {mode === "sign-in"
                    ? "Please sign in to access your workspace & community."
                    : "Join 350+ Moroccan founders scaling AI agencies."}
                </p>
              </div>

              {/* Clerk Auth Box */}
              <div className="w-full select-text">{children}</div>
            </div>

            {/* Bottom Legal Disclaimer */}
            <div className="mt-8 pt-4 text-center">
              <p className="text-[11px] text-slate-400">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-slate-600 hover:text-slate-950 font-semibold underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-slate-600 hover:text-slate-950 font-semibold underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT COLUMN: Community & Eensell Workspace
             ══════════════════════════════════════════════ */}
          <div className="hidden lg:flex lg:col-span-6 p-8 lg:p-12 bg-[#FAFBFD] border-l border-slate-200/80 flex-col justify-between relative overflow-hidden">
            {/* Subtle Dot Grid Background */}
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#94A3B8 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Ambient light glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-tr from-indigo-200/30 via-cyan-100/30 to-emerald-100/30 rounded-full blur-[90px] pointer-events-none" />

            {/* Header copy */}
            <div className="relative z-10 text-center max-w-sm mx-auto pt-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-snug mb-1.5">
                Connect &amp; Automate &amp; Scale.
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Autonomous Moroccan B2B AI agency workspace &amp; founder mastermind.
              </p>
            </div>

            {/* Interactive Network Constellation or Tabs */}
            <div className="relative z-10 my-auto py-6 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="tab-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-[340px] h-[300px] flex items-center justify-center"
                  >
                    {/* SVG Connecting Lines with Dashed Animation */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 340 300">
                      {/* Lines from center (170, 150) to 8 satellite positions */}
                      {/* Top (170, 40) */}
                      <line x1="170" y1="150" x2="170" y2="45" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Top-Right (280, 75) */}
                      <line x1="170" y1="150" x2="275" y2="80" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Right (290, 150) */}
                      <line x1="170" y1="150" x2="285" y2="150" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Bottom-Right (275, 225) */}
                      <line x1="170" y1="150" x2="275" y2="220" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Bottom (170, 255) */}
                      <line x1="170" y1="150" x2="170" y2="250" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Bottom-Left (65, 225) */}
                      <line x1="170" y1="150" x2="65" y2="220" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Left (50, 150) */}
                      <line x1="170" y1="150" x2="55" y2="150" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      {/* Top-Left (65, 75) */}
                      <line x1="170" y1="150" x2="65" y2="80" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                    </svg>

                    {/* Central Core Hub (Eensell Workspace) */}
                    <div className="relative z-20 flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-xl border-2 border-white">
                        <span className="font-black text-xl tracking-tighter">E</span>
                      </div>
                      <span className="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-2xs">
                        Eensell OS
                      </span>
                    </div>

                    {/* ── 8 Satellite Nodes ── */}

                    {/* Top: Google Maps Scraper */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-emerald-600 hover:scale-110 transition-transform">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                        Maps Radar
                      </span>
                    </div>

                    {/* Top-Right: WhatsApp Outreach */}
                    <div className="absolute top-10 right-4 z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-[#25D366] hover:scale-110 transition-transform">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                        WhatsApp
                      </span>
                    </div>

                    {/* Right: GPT-4o Copywriter */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-1 z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-purple-600 hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                        GPT-4o
                      </span>
                    </div>

                    {/* Bottom-Right: Moroccan CRM */}
                    <div className="absolute bottom-9 right-4 z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-blue-600 hover:scale-110 transition-transform">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                        B2B CRM
                      </span>
                    </div>

                    {/* Bottom: Invoicing & Devis */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-amber-600 hover:scale-110 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                        Devis &amp; MAD
                      </span>
                    </div>

                    {/* Bottom-Left: Live Deal Rooms */}
                    <div className="absolute bottom-9 left-4 z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-indigo-600 hover:scale-110 transition-transform">
                        <Video className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                        Live Calls
                      </span>
                    </div>

                    {/* Left: Founder Community */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-1 z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-rose-600 hover:scale-110 transition-transform">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                        Community
                      </span>
                    </div>

                    {/* Top-Left: BYO API Keys */}
                    <div className="absolute top-10 left-4 z-10 flex flex-col items-center group">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-amber-500 hover:scale-110 transition-transform">
                        <Key className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs border border-slate-100">
                        BYO Keys
                      </span>
                    </div>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="tab-1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-lg p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-slate-900">Workspace Radar</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">Casablanca &bull; Live</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <p className="font-bold text-slate-900">Dr. Alami Aesthetic Clinic</p>
                      <p className="text-slate-500 text-[11px]">+212 5 22 20 14 55 &bull; Gauthier, Casablanca</p>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold pt-1">
                      <span className="text-emerald-600">✓✓ Audio Pitch Ready</span>
                      <span className="text-slate-400 text-[11px]">Auto CRM Synced</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="tab-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-lg p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-900">Founder Mastermind</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        350+ Active
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <p className="font-bold text-slate-900">Omar B. (Marrakech Agency)</p>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        &ldquo;Just closed a 12,000 MAD contract for a dental clinic using the Darija WhatsApp pitch script!&rdquo;
                      </p>
                    </div>
                    <div className="text-[10px] font-medium text-slate-400 text-center">
                      Live Zoom Room every Tuesday &amp; Saturday with Saad
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Carousel Indicator Dots */}
            <div className="relative z-10 flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab(0)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeTab === 0 ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label="Ecosystem View"
              />
              <button
                type="button"
                onClick={() => setActiveTab(1)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeTab === 1 ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label="Workspace View"
              />
              <button
                type="button"
                onClick={() => setActiveTab(2)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeTab === 2 ? "w-6 bg-slate-900" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label="Community View"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
