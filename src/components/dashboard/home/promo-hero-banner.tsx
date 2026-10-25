"use client";

import { useState } from "react";
import { ArrowRight, X, ChevronDown, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoHeroBanner() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  if (isCollapsed) {
    return (
      <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-card/60 border border-border backdrop-blur-md shadow-sm text-xs text-muted-foreground transition-all">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-emerald-500 dark:text-emerald-400">PARTNER DEAL:</span>
          <span className="text-foreground truncate">Deploy Client Systems on High-Performance Cloud VPS (Up to 75% Off)</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://www.hostinger.com/web-hosting?REFERRALCODE=EENSELL"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors"
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
    <div className="relative w-full overflow-hidden rounded-3xl border border-border/80 bg-[#090b10] shadow-xl transition-all">
      {/* Background Graphic & Dark Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/cloud_vps_banner.jpg"
          alt="Cloud VPS Infrastructure"
          className="w-full h-full object-cover object-right opacity-30 md:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090b10] via-[#090b10]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-transparent" />
      </div>

      {/* Dismiss / Minimize button */}
      <button
        onClick={() => setIsCollapsed(true)}
        aria-label="Collapse banner"
        className="absolute top-4 right-4 z-20 p-1.5 rounded-xl text-slate-400 hover:text-white bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
              Exclusive Partner Deal
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Deploy Your Client Systems on High-Performance Cloud VPS
          </h2>

          <p className="text-sm text-slate-300/90 leading-relaxed max-w-xl">
            Get up to 75% off Hostinger Business & Cloud plans + a free domain and SSL for your client automations.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="https://www.hostinger.com/web-hosting?REFERRALCODE=EENSELL"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                size="default"
                className="h-11 px-7 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all hover:scale-105 gap-2 border-0"
              >
                <span>Claim Exclusive Deal</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free SSL & Domain
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" /> 99.9% Uptime Guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Right Thumbnail preview on larger screens */}
        <div className="hidden lg:block shrink-0 pr-4">
          <div className="w-56 h-36 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
            <img
              src="/images/cloud_vps_banner.jpg"
              alt="Cloud VPS"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-black/60 px-2 py-0.5 rounded border border-emerald-500/30 backdrop-blur-md">
                CLOUD NODE // LIVE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
