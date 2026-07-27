"use client";

import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AcceleratorTeaser() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0b10] shadow-2xl flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 gap-8">
      {/* Background Meshes */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/[0.03] to-indigo-500/[0.05]" />
      <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
          <Lock className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Unlocks after 60 Days</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          AI Agency Accelerator
        </h2>
        <p className="text-white/60 text-base max-w-xl leading-relaxed">
          The ultimate program to scale your new AI skills into a full-fledged agency. 
          Get hands-on mentorship, client acquisition funnels, and advanced automation frameworks.
        </p>
      </div>

      <div className="relative z-10 shrink-0 w-full md:w-auto">
        <Button className="w-full sm:w-auto h-14 px-8 bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] rounded-xl font-bold text-base shadow-none transition-all group">
          <span className="flex items-center gap-3">
            Join Early Access Waitlist
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </div>
    </div>
  );
}
