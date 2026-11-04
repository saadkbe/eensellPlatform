"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CheckCircle2 } from "lucide-react";
import { ConstellationAnimation } from "@/components/auth/constellation-animation";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}

export function AuthSplitLayout({ children, mode }: AuthSplitLayoutProps) {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-12 bg-white text-slate-900 antialiased select-none">
      {/* ── Global Clerk Overrides to ensure 100% flat seamless canvas ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .cl-card,
            .cl-cardBox {
              background-color: transparent !important;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
            }
            .cl-header,
            .cl-headerTitle,
            .cl-headerSubtitle,
            .cl-logoBox,
            .cl-logoImage {
              display: none !important;
            }
            .cl-rootBox {
              width: 100% !important;
            }
            .cl-formFieldInput {
              border-radius: 0.75rem !important;
            }
          `,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          LEFT COLUMN: Clean Pure White Column (Auth Form)
         ══════════════════════════════════════════════════════════ */}
      <div className="md:col-span-5 lg:col-span-5 xl:col-span-5 px-6 sm:px-10 lg:px-14 xl:px-16 py-10 sm:py-14 flex flex-col justify-between bg-white relative z-10 min-h-screen border-r border-slate-100">
        <div className="w-full max-w-[390px] mx-auto my-auto flex flex-col items-center">
          {/* Official Brand Logo - Big, Crisp & Prominent */}
          <Link href="/" className="mb-7 transition-transform hover:scale-[1.03] flex items-center justify-center">
            <Image
              src="/logo2-cropped.png"
              alt="Eensell University"
              width={376}
              height={106}
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
          Visible on md: (768px+) and up
         ══════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex md:col-span-7 lg:col-span-7 xl:col-span-7 p-8 sm:p-10 lg:p-14 xl:p-16 bg-[#070A12] text-white flex-col justify-between relative overflow-hidden min-h-screen">
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

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.18] mb-3">
            Connect &bull; Automate &bull; Scale.
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            The complete Moroccan B2B AI operating system: from Google Maps scraping to Darija WhatsApp pitches and high-ticket client closing.
          </p>
        </div>

        {/* ── Central Constellation Network Visualization ── */}
        <div className="relative z-10 my-auto py-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeTab === 0 && (
              <motion.div
                key="tab-0"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full flex items-center justify-center"
              >
                <ConstellationAnimation />
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                key="tab-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-6 space-y-4 backdrop-blur-md"
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
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                  <p className="font-bold text-white text-sm">Cabinet Dentaire Dr. Alami Gauthier</p>
                  <p className="text-slate-400 text-xs">+212 5 22 20 14 55 &bull; 14 Rue Jean Jaurès</p>
                </div>
                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>WhatsApp Voice Note Sent</span>
                  </span>
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
                className="w-full max-w-md rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-6 space-y-4 backdrop-blur-md"
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
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5">
                  <p className="font-bold text-white text-sm">Omar B. (Marrakech Agency)</p>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    &ldquo;Just closed a 12,000 MAD contract for a dental clinic using the Darija WhatsApp pitch script!&rdquo;
                  </p>
                </div>
                <div className="text-xs font-medium text-slate-400 text-center">
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
