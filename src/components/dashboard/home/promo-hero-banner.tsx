"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, X, Server, Zap, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoHeroBanner() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  if (isCollapsed) {
    return (
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0F1117] border border-white/[0.06] shadow-sm text-xs text-muted-foreground transition-all">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-emerald-400">PARTNER DEAL:</span>
          <span className="text-foreground/90 truncate">Deploy Client Systems on High-Performance Cloud VPS (Up to 75% Off)</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://www.hostinger.com/web-hosting?REFERRALCODE=EENSELL"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Claim Deal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand banner"
            className="p-1 hover:text-foreground text-muted-foreground transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A0D14] via-[#101722] to-[#0B1319] border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.35)] transition-all">
      {/* Ambient background glow highlights */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-emerald-500/[0.07] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-0 w-80 h-40 bg-teal-500/[0.05] rounded-full blur-2xl pointer-events-none" />

      {/* Dismiss / Minimize button */}
      <button
        onClick={() => setIsCollapsed(true)}
        aria-label="Collapse banner"
        className="absolute top-3 right-3 z-20 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.18)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
              Exclusive Partner Deal
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white tracking-tight leading-snug">
            Deploy Your Client Systems on High-Performance Cloud VPS
          </h2>

          {/* Copy */}
          <p className="text-sm text-slate-300/80 leading-relaxed max-w-xl">
            Get up to 75% off Hostinger Business & Cloud plans + a free domain and SSL for your client automations.
          </p>

          {/* CTA & Trust badges */}
          <div className="pt-1 flex flex-wrap items-center gap-4">
            <a
              href="https://www.hostinger.com/web-hosting?REFERRALCODE=EENSELL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="sm"
                className="h-10 px-6 rounded-full font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all hover:-translate-y-0.5 gap-2 border-0"
              >
                <span>Claim Exclusive Deal</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Free SSL & Domain
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> 99.9% Uptime SLA
              </span>
            </div>
          </div>
        </div>

        {/* Right 3D-styled Graphic / Server Architecture illustration */}
        <div className="hidden lg:flex items-center justify-center shrink-0 pr-6">
          <div className="relative w-52 h-36 rounded-2xl bg-gradient-to-br from-[#161C26] to-[#0C1017] border border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-4 flex flex-col justify-between overflow-hidden group">
            {/* Server Rack Visualization */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono font-bold text-white/90">CLOUD_NODE_01</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  ONLINE
                </span>
              </div>
              {/* Rack Slots */}
              {[1, 2, 3].map((slot) => (
                <div key={slot} className="flex items-center justify-between py-1 px-2 rounded-lg bg-black/40 border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-mono">SSD-NVMe // 2.5 Gbps</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">128 GB</span>
                </div>
              ))}
            </div>

            {/* Bottom floating badge */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-white/[0.04]">
              <span>Latency: 12ms</span>
              <span className="text-emerald-400 font-semibold">Tier-4 DC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
