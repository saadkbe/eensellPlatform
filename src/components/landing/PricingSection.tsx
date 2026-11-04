"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  CreditCard,
  MessageCircle,
  HelpCircle,
  Clock,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/landing/LanguageProvider";

export function PricingSection() {
  const { dir } = useLanguage();

  const features = [
    "Full Access to the Eensell Workspace (Maps Scraper, CRM, WhatsApp Studio, AI Drafter, Devis Generator)",
    "2 Live Weekly Zoom Strategy Rooms with Saad & Top Earners (every Tuesday & Saturday)",
    "Private Discord & WhatsApp Inner Circle of 350+ Moroccan Agency Founders",
    "Pre-built Darija & French Voice Pitch Scripts & Cold Email Templates (84%+ Open Rate)",
    "Plug-and-Play AI Bot Blueprints (WhatsApp Qualification, Voice Booking & CRM Sync)",
    "Commercial Contract & Legal Moroccan Devis Templates (MAD Compliant)",
    "Direct Priority VIP Support & 1-on-1 Guidance on Your First 3 Client Proposals",
    "Continuous AI Tool Updates & New Moroccan Lead Data Extractor Modules",
  ];

  return (
    <section
      id="pricing"
      dir={dir}
      className="relative py-20 sm:py-32 bg-white text-slate-900 overflow-hidden border-t border-slate-200/70"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-indigo-100/40 via-violet-50/30 to-emerald-50/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 shadow-2xs mb-4 text-xs font-bold text-slate-700 tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Transparent Investment</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight mb-5"
          >
            Invest Once In Your Agency.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-indigo-900 to-[#FF6B4A]">
              Get Clients For A Lifetime.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            One single closed client pays for this membership 50 times over. Everything is included with zero hidden monthly surprises.
          </motion.p>
        </div>

        {/* ── Radiant Web3 Light Pricing Bento Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto rounded-[2.5rem] bg-white border border-slate-200/90 shadow-[0_20px_70px_-15px_rgba(15,23,42,0.12)] overflow-hidden"
        >
          {/* Top Banner Stripe */}
          <div className="px-6 sm:px-8 py-3 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>FOUNDING COHORT ENROLLMENT OPEN</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Limited to next 25 Moroccan founders</span>
            </div>
          </div>

          <div className="p-8 sm:p-12 flex flex-col lg:flex-row gap-10 items-stretch">
            {/* Left Column: Price & Action */}
            <div className="lg:w-5/12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 lg:pr-10 pb-8 lg:pb-0">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-4">
                  Full 2-Month Access &bull; All Included
                </span>

                <h3 className="text-2xl font-black text-slate-950 tracking-tight mb-2">
                  Eensell Founder Pass
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                  Complete access to the autonomous Workspace, weekly live deal rooms, and the private founder network.
                </p>

                {/* Price Display */}
                <div className="mb-6 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-slate-950 font-mono tracking-tight">
                      200
                    </span>
                    <span className="text-xl font-bold text-slate-700">
                      MAD
                    </span>
                    <span className="text-xs font-semibold text-slate-400 line-through ml-2">
                      500 MAD
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Full 2-Month Membership &bull; Pay Once
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Link href="/sign-up" className="block w-full">
                  <Button
                    size="lg"
                    className="w-full h-13 rounded-2xl text-sm font-bold bg-slate-950 hover:bg-slate-900 text-white shadow-xl cursor-pointer transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <span>Join Eensell University Now</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Button>
                </Link>

                <a
                  href="https://wa.me/212666065608?text=Bonjour%20Saad,%20je%20souhaite%20rejoindre%20Eensell%20University%20via%20virement%20bancaire%20(CIH)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-12 rounded-2xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Pay via CIH Bank / WhatsApp Concierge</span>
                  </Button>
                </a>

                <div className="pt-3 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure 256-bit SSL
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Instant Activation
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Complete Feature Breakdown */}
            <div className="lg:w-7/12 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Everything Included In Your Membership:</span>
                </h4>

                <ul className="space-y-3.5">
                  {features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3 Step Guarantee Note */}
              <div className="mt-8 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 leading-relaxed font-medium">
                  <strong className="font-bold">Our 100% Practical Guarantee:</strong> If you follow the step-by-step roadmap, use the Maps scraper, and attend the weekly deal rooms, you will have all the assets to close your first client. No theory, pure Moroccan execution.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
