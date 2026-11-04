"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  CheckCircle2,
  Lock,
} from "lucide-react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}

export function AuthSplitLayout({ children, mode }: AuthSplitLayoutProps) {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white text-slate-900 antialiased select-none">
      {/* ══════════════════════════════════════════════════════════
          LEFT COLUMN: Clean Pure White Column (Auth Form)
         ══════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-5 xl:col-span-5 px-6 sm:px-10 lg:px-14 xl:px-16 py-10 sm:py-14 flex flex-col justify-between bg-white relative z-10 min-h-screen border-r border-slate-100">
        <div className="w-full max-w-[380px] mx-auto my-auto flex flex-col items-center">
          {/* Official Sidebar Logo */}
          <Link href="/" className="mb-7 transition-transform hover:scale-[1.02] flex items-center justify-center">
            <Image
              src="/logo2.png"
              alt="Eensell University"
              width={260}
              height={60}
              priority
              className="h-10 sm:h-12 w-auto object-contain brightness-0 dark:invert"
            />
          </Link>

          {/* Form Header Title & Subtitle */}
          <div className="text-center mb-6 w-full">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {mode === "sign-in"
                ? "Please sign in to access your workspace & community."
                : "Join 350+ Moroccan founders scaling AI agencies."}
            </p>
          </div>

          {/* Seamless Clerk Auth Component Container */}
          <div className="w-full select-text">{children}</div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-8 text-center border-t border-slate-100 mt-6">
          <p className="text-[11px] text-slate-400 font-medium">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-slate-700 hover:text-slate-950 font-semibold underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-slate-700 hover:text-slate-950 font-semibold underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT COLUMN: High-Contrast Dark Tech Column (Community & Workspace)
         ══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 p-10 lg:p-14 xl:p-16 bg-[#070A12] text-white flex-col justify-between relative overflow-hidden min-h-screen">
        {/* Subtle Dark Dot Grid Background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#334155 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient Radiant Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-emerald-500/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-[110px] pointer-events-none" />

        {/* Top Header Badge & Copy */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-emerald-400 text-xs font-bold tracking-wide uppercase mb-4 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Autonomous Agency OS &bull; Founder Network</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.18] mb-3">
            Connect &bull; Automate &bull; Scale.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            The complete Moroccan B2B AI operating system: from Google Maps scraping to Darija WhatsApp pitches and high-ticket client closing.
          </p>
        </div>

        {/* ── Central Constellation Network Visualization ── */}
        <div className="relative z-10 my-auto py-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="tab-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-[400px] h-[340px] flex items-center justify-center"
              >
                {/* SVG Connecting Lines with Glowing Dashed Stroke */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 340">
                  {/* Lines radiating from center (200, 170) to 8 satellite positions */}
                  <line x1="200" y1="170" x2="200" y2="45" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="170" x2="325" y2="85" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="170" x2="340" y2="170" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="170" x2="325" y2="255" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="170" x2="200" y2="295" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="170" x2="75" y2="255" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="170" x2="60" y2="170" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="200" y1="170" x2="75" y2="85" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>

                {/* Central Core Hub (Eensell Official Brand Mark) */}
                <div className="relative z-20 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.3)]">
                    <Image
                      src="/logo2.png"
                      alt="Eensell OS"
                      width={120}
                      height={40}
                      className="h-7 w-auto object-contain brightness-0 invert"
                    />
                  </div>
                  <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                    Eensell OS Hub
                  </span>
                </div>

                {/* ── 8 Satellite Nodes ── */}

                {/* Node 1: Maps Radar */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-500 transition-all backdrop-blur-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-2xs">
                    Maps Radar
                  </span>
                </div>

                {/* Node 2: WhatsApp Outreach */}
                <div className="absolute top-11 right-6 z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center text-[#25D366] group-hover:scale-110 group-hover:border-[#25D366] transition-all backdrop-blur-md">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-2xs">
                    WhatsApp
                  </span>
                </div>

                {/* Node 3: GPT-4o Drafter */}
                <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:border-purple-400 transition-all backdrop-blur-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-2xs">
                    GPT-4o
                  </span>
                </div>

                {/* Node 4: Moroccan B2B CRM */}
                <div className="absolute bottom-11 right-6 z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:border-blue-400 transition-all backdrop-blur-md">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-2xs">
                    B2B CRM
                  </span>
                </div>

                {/* Node 5: Invoicing & Devis */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400 transition-all backdrop-blur-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-2xs">
                    Devis &amp; MAD
                  </span>
                </div>

                {/* Node 6: Live Deal Rooms */}
                <div className="absolute bottom-11 left-6 z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-400 transition-all backdrop-blur-md">
                    <Video className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-2xs">
                    Live Calls
                  </span>
                </div>

                {/* Node 7: 350+ Founder Community */}
                <div className="absolute top-1/2 -translate-y-1/2 left-2 z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:border-rose-400 transition-all backdrop-blur-md">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-2xs">
                    Community
                  </span>
                </div>

                {/* Node 8: BYO API Keys */}
                <div className="absolute top-11 left-6 z-10 flex flex-col items-center group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-lg flex items-center justify-center text-yellow-400 group-hover:scale-110 group-hover:border-yellow-400 transition-all backdrop-blur-md">
                    <Key className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow-2xs">
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
                className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-6 space-y-3.5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-white">Live Maps Radar</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Casablanca &bull; Active
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                  <p className="font-bold text-white">Cabinet Dentaire Dr. Alami Gauthier</p>
                  <p className="text-slate-400 text-[11px]">+212 5 22 20 14 55 &bull; 14 Rue Jean Jaurès</p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <span className="text-emerald-400">✓✓ WhatsApp Voice Note Sent</span>
                  <span className="text-slate-400 text-[11px]">Kanban: Meeting Set</span>
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
                className="w-full max-w-sm rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-6 space-y-3.5 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Founder Mastermind</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    350+ Active
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1">
                  <p className="font-bold text-white">Omar B. (Marrakech Agency)</p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    &ldquo;Just closed a 12,000 MAD contract for a dental clinic using the Darija WhatsApp pitch script!&rdquo;
                  </p>
                </div>
                <div className="text-[11px] font-medium text-slate-400 text-center">
                  Live Zoom Room every Tuesday &amp; Saturday with Saad
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Carousel Navigation Dots & Active Network Footer */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab(0)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeTab === 0 ? "w-7 bg-white" : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
              aria-label="Ecosystem View"
            />
            <button
              type="button"
              onClick={() => setActiveTab(1)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeTab === 1 ? "w-7 bg-white" : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
              aria-label="Workspace View"
            />
            <button
              type="button"
              onClick={() => setActiveTab(2)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeTab === 2 ? "w-7 bg-white" : "w-2 bg-slate-700 hover:bg-slate-500"
              }`}
              aria-label="Community View"
            />
          </div>

          <p className="text-xs text-slate-400 font-medium text-center">
            🇲🇦 Active founders in Casablanca, Rabat, Marrakech, Tangier &amp; Fès.
          </p>
        </div>
      </div>
    </div>
  );
}
