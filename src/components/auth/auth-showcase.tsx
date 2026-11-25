"use client";

import Image from "next/image";
import {
  MapPin,
  MessageSquare,
  Users,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Star,
} from "lucide-react";

export function AuthShowcase() {
  return (
    <div className="w-full h-full flex flex-col justify-between py-2 sm:py-4 relative z-10">
      {/* ── 1. Top Section: Header & Value Proposition ── */}
      <div className="space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Morocco&apos;s #1 AI Agency Community &amp; Workspace</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-[1.15]">
          Scale Your AI Agency with Confidence.
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
          Access the complete Moroccan B2B operating system: from Google Maps lead generation to Darija WhatsApp scripts and weekly live deal coaching.
        </p>
      </div>

      {/* ── 2. Middle Showcase: Sleek Framed Workspace Preview ── */}
      <div className="my-6 w-full">
        <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden transition-all hover:border-slate-600">
          {/* Mock Browser/Window Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <span className="text-emerald-400">🔒</span>
              <span>eensell.com/workspace</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Active</span>
            </div>
          </div>

          {/* Banner Graphic Showcase */}
          <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden group">
            <Image
              src="/WORKSPACE BANNER.png"
              alt="Eensell University Workspace Showcase"
              fill
              priority
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Soft Ambient Inner Shadow */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>

          {/* Quick Pillars Underneath Showcase */}
          <div className="grid grid-cols-3 divide-x divide-slate-800 border-t border-slate-800 bg-slate-950/50 py-3 px-2 text-center">
            <div className="px-2 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Maps Radar</span>
              </div>
              <p className="text-[10px] text-slate-400">B2B Lead Scraper</p>
            </div>

            <div className="px-2 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-indigo-400 text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Darija Pitches</span>
              </div>
              <p className="text-[10px] text-slate-400">WhatsApp Scripts</p>
            </div>

            <div className="px-2 space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>Mastermind</span>
              </div>
              <p className="text-[10px] text-slate-400">Live Deal Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Bottom Showcase: Testimonial & Social Proof Bar ── */}
      <div className="space-y-4">
        {/* Testimonial Quote */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Founder
            </span>
          </div>

          <p className="text-slate-200 text-xs leading-relaxed italic">
            &ldquo;Closed my first 12,000 MAD retainer in 3 weeks using the automated Darija WhatsApp outreach playbook. The workspace pays for itself.&rdquo;
          </p>

          <p className="text-[11px] text-slate-400 font-medium">
            — <strong className="text-white">Omar B.</strong>, Digital Agency Founder (Marrakech)
          </p>
        </div>

        {/* City Network Badges */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-1 border-t border-slate-800/80">
          <span className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span>350+ Active Moroccan Founders</span>
          </span>
          <span className="hidden sm:inline-block text-slate-500">
            Casablanca &bull; Rabat &bull; Marrakech &bull; Tangier
          </span>
        </div>
      </div>
    </div>
  );
}
