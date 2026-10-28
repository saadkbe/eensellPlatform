import Link from "next/link";
import { 
  Check, X, Sparkles, ArrowRight, ShieldCheck, Zap, 
  Trophy, Rocket, Bot, Users, Video, FileText, CheckCircle2, 
  Star, Flame, Lock, ChevronRight, HelpCircle, Layers, Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CHALLENGE_OFFER } from "@/data/challenge-offer";

export const metadata = {
  title: "Upgrade to Eensell University V2 | Exclusive V1 Alumni Offer",
  description: "Upgrade from 60-Day Challenge V1 to V2. Unlock the Interactive Daily Roadmap, Make.com Blueprints, Eensell Workspace OS, and Weekly Live Calls.",
};

const COMPARISON_ROWS = [
  {
    feature: "60-Day Daily Action Roadmap",
    desc: "Interactive daily missions, XP tracking, milestone unlocks from Day 1 to 1st paying client.",
    v1: "Static video checklist",
    v2: "Interactive Guided System",
    v1Included: false,
    v2Included: true,
  },
  {
    feature: "Eensell Workspace OS Access",
    desc: "Built-in Google Maps business scraper, AI Voice Agent console, client outreach dispatcher & CRM.",
    v1: "Not Available",
    v2: "Full Workspace Included",
    v1Included: false,
    v2Included: true,
  },
  {
    feature: "Make.com & AI Blueprints Vault",
    desc: "1-Click importable .JSON automation blueprints (AI lead caller, qualification bot, WhatsApp CRM sync).",
    v1: "Generic explanations",
    v2: "Direct .JSON Blueprints",
    v1Included: false,
    v2Included: true,
  },
  {
    feature: "Weekly Live Coaching & Strategy Calls",
    desc: "Live strategy sessions with Saad every week, pipeline reviews, closing roleplay & direct Q&A.",
    v1: "Pre-recorded only",
    v2: "Weekly Live + Replay Vault",
    v1Included: false,
    v2Included: true,
  },
  {
    feature: "Contract, Proposal & Pitch Templates",
    desc: "Production-ready Moroccan & international agency client contracts, invoices, and audit pitch decks.",
    v1: "Basic PDFs",
    v2: "Production Legal Suite",
    v1Included: false,
    v2Included: true,
  },
  {
    feature: "Private V2 Community & Wins Channel",
    desc: "Private network with active founders closing 3,000 to 20,000 MAD monthly retainer clients.",
    v1: "Read-only channel",
    v2: "Private VIP Hub",
    v1Included: false,
    v2Included: true,
  },
  {
    feature: "Lifetime AI Course Library Access",
    desc: "All core courses, video tutorials, and technical walkthroughs.",
    v1: "Included",
    v2: "Included + All New Courses",
    v1Included: true,
    v2Included: true,
  },
];

const VALUE_STACK = [
  { title: "Interactive 60-Day Action Roadmap & Tracker", value: "800 MAD" },
  { title: "Eensell Workspace OS (Voice AI & Lead Scraper)", value: "1,200 MAD" },
  { title: "Make.com Production Blueprints Vault (.JSON)", value: "600 MAD" },
  { title: "Weekly Live Coaching Calls & Replay Vault", value: "900 MAD" },
  { title: "Agency Legal Contracts, Proposals & Outreach Scripts", value: "500 MAD" },
  { title: "VIP V2 Founder Community & Deal Matching", value: "400 MAD" },
];

export default function UpgradePage() {
  const whatsappUrl = `${CHALLENGE_OFFER.contact.whatsappHref}?text=${encodeURIComponent(
    "Salam Saad! I am a 60-Day Challenge V1 member and I want to upgrade to Eensell University V2 for 499 MAD."
  )}`;

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Notice Bar */}
      <div className="bg-primary text-primary-foreground py-2.5 px-4 text-center text-xs sm:text-sm font-semibold tracking-wide">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0 animate-spin" style={{ animationDuration: "3s" }} />
          <span>Special Loyalty Offer: Exclusive 50% discount for existing 60-Day Challenge V1 Members</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/25">
            <Flame className="w-3.5 h-3.5" />
            <span>EXCLUSIVELY FOR 60-DAY CHALLENGE V1 STUDENTS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            You experienced V1. <br />
            Now build your agency in <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">Challenge V2</span>.
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-muted-foreground leading-relaxed">
            V1 gave you the foundations. <strong className="text-slate-900 dark:text-white font-semibold">Eensell University V2</strong> gives you the complete execution machine: daily guided missions, weekly live coaching with Saad, production Make.com blueprints, and our autonomous <strong className="text-slate-900 dark:text-white font-semibold">Workspace OS</strong>.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#comparison" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold bg-white dark:bg-card border-slate-200 dark:border-border text-slate-800 dark:text-foreground hover:bg-slate-100 dark:hover:bg-accent">
                See What&apos;s New in V2 ↓
              </Button>
            </a>
            <Link href="/upgrade/payment" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2 px-8">
                <span>Claim V1 Alumni Seat (499 MAD)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-muted-foreground">
            ⚡ One-time payment • Lifetime access to V2 • All your existing XP points and progress stay intact.
          </p>
        </div>

        {/* Feature Cards Grid: The 4 Big Pillars of V2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-card/70 border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-primary flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Interactive 60-Day Daily Roadmap
              </h3>
              <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                No more guessing what to do next. Follow Day 1 to Day 60 step-by-step missions designed to land your first 5,000+ MAD client.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card/70 border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Eensell Workspace OS Suite
              </h3>
              <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                Autonomous client outreach CRM: Google Maps business scraper, live AI Voice Caller console & automated cold dispatch.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card/70 border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Workflow className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Make.com Blueprints Vault
              </h3>
              <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                Direct 1-click importable JSON automation architectures ready to deploy and resell to local businesses immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card/70 border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Weekly Live Coaching & Hotseats
              </h3>
              <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                Hop on live calls with Saad every single week. Get your outreach reviewed, live objections answered, and access the replay archive.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Side-by-Side Comparison: V1 vs V2 */}
        <div id="comparison" className="space-y-8 scroll-mt-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Clear Comparison
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              What Changed from V1 to V2?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-muted-foreground">
              See why upgrading transforms your student experience into a high-converting agency business.
            </p>
          </div>

          <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-border bg-slate-50/50 dark:bg-muted/30">
                    <th className="p-5 sm:p-6 text-sm font-bold text-slate-900 dark:text-white w-2/5">
                      Feature & Capability
                    </th>
                    <th className="p-5 sm:p-6 text-sm font-semibold text-slate-500 dark:text-muted-foreground w-[30%]">
                      <div className="flex items-center gap-2">
                        <span>Challenge V1</span>
                        <Badge variant="outline" className="text-[10px] font-normal border-slate-300 dark:border-border">
                          Your Current Tier
                        </Badge>
                      </div>
                    </th>
                    <th className="p-5 sm:p-6 text-sm font-bold text-primary w-[30%] bg-primary/5">
                      <div className="flex items-center gap-2">
                        <span>Challenge V2</span>
                        <Badge className="text-[10px] font-bold bg-primary text-primary-foreground border-none">
                          Upgrade
                        </Badge>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-border text-sm">
                  {COMPARISON_ROWS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-muted/20 transition-colors">
                      <td className="p-5 sm:p-6">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {row.feature}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5 leading-relaxed">
                          {row.desc}
                        </div>
                      </td>
                      <td className="p-5 sm:p-6 align-top">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-muted-foreground">
                          {row.v1Included ? (
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm font-medium">{row.v1}</span>
                        </div>
                      </td>
                      <td className="p-5 sm:p-6 align-top bg-primary/[0.02]">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-xs sm:text-sm text-primary font-bold">{row.v2}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* The Offer & Value Stack (No Brainer Pricing) */}
        <div id="offer" className="max-w-4xl mx-auto space-y-8 scroll-mt-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Exclusive Loyalty Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
              The V1 Alumni Upgrade Offer
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-muted-foreground max-w-lg mx-auto">
              New students pay 999 MAD to enter V2. Because you trusted us from Challenge V1, your upgrade is locked at just 499 MAD.
            </p>
          </div>

          <div className="bg-white dark:bg-card border-2 border-primary/40 rounded-3xl shadow-xl shadow-primary/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
              50% V1 Alumni Discount
            </div>

            <div className="p-6 sm:p-10 space-y-8">
              {/* Price Row */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-border">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span>LIFETIME V2 ECOSYSTEM ACCESS</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    Upgrade to Eensell University V2
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-muted-foreground">
                    One-time payment • No recurring subscriptions • Instant activation
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-sm text-slate-400 line-through font-semibold">
                    Public Price: 999 MAD
                  </div>
                  <div className="flex items-baseline sm:justify-end gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">499</span>
                    <span className="text-base font-bold text-primary">MAD</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    You save 500 MAD as a V1 member
                  </span>
                </div>
              </div>

              {/* Stack Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Everything Unlocked with Your V2 Upgrade:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {VALUE_STACK.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-muted/40 border border-slate-200/80 dark:border-border/60">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-400 line-through shrink-0 ml-2">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Value Anchor */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="font-semibold text-amber-900 dark:text-amber-200">
                  Total Real Deliverables Value: <strong className="font-black text-amber-800 dark:text-amber-100">4,400 MAD+</strong>
                </span>
                <span className="font-bold text-primary">
                  Your V1 Alumni Upgrade: 499 MAD
                </span>
              </div>

              {/* Primary Call to Action */}
              <div className="space-y-4 pt-2">
                <Link href="/upgrade/payment" className="block w-full">
                  <Button size="lg" className="w-full text-base sm:text-lg font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/30 py-7 gap-3">
                    <Zap className="w-5 h-5 fill-current" />
                    <span>Proceed to Payment Details (499 MAD)</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500 dark:text-muted-foreground pt-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Accepted: CIH Bank, Attijariwafa, Wafacash, Cash Plus</span>
                  </div>
                  <div className="hidden sm:block">•</div>
                  <div>Direct Activation via WhatsApp with Saad & Team</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-muted-foreground">
              Everything you need to know about transitioning from V1 to V2.
            </p>
          </div>

          <div className="space-y-4">
            <Card className="bg-white dark:bg-card border-slate-200 dark:border-border">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Do I lose my XP points, completed lessons, or original V1 access?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                  No! Absolutely not. All your XP points, profile rank, completed lessons, and video watch history are permanently preserved. Upgrading to V2 immediately adds the new roadmap and tools on top of your existing profile.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-slate-200 dark:border-border">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Is the 499 MAD price a monthly recurring fee?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                  No. It is a single one-time upgrade payment with lifetime access to all V2 features, weekly live coaching calls, future automation templates, and platform updates.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-slate-200 dark:border-border">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  How does activation work after payment?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                  Once you send your payment receipt via WhatsApp, your account tier will be elevated to <strong className="text-slate-900 dark:text-white">UNIVERSITY_V2</strong> within minutes. When you refresh your dashboard, all V2 tabs and the Workspace OS will immediately unlock.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Back Link */}
        <div className="text-center pt-4 pb-8">
          <Link href="/dashboard/modules" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-white transition-colors">
            <span>← Return to AI Library (V1)</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
