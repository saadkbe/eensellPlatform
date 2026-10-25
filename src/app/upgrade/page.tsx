import Link from "next/link";
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CHALLENGE_OFFER } from "@/data/challenge-offer";

export const metadata = {
  title: "Upgrade to Eensell University V2 | 499 MAD",
  description: "Unlock the 60-Day Roadmap, Make.com Blueprints, and Weekly Live Calls.",
};

export default function UpgradePage() {
  const whatsappUrl = `${CHALLENGE_OFFER.contact.whatsappHref}?text=${encodeURIComponent(
    "Salam! I want to upgrade my account to Eensell University V2 for 499 MAD."
  )}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>Official University Upgrade</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Unlock Eensell University <span className="text-primary">V2</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Take your AI agency from beginner to first paying client with our full structured ecosystem.
          </p>
        </div>

        {/* Pricing Card */}
        <Card className="bg-card/70 border-primary/30 shadow-2xl relative overflow-hidden backdrop-blur-xl text-left">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  One-Time Upgrade
                </span>
                <h2 className="text-2xl font-bold text-foreground mt-1">
                  Full Lifetime V2 Access
                </h2>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-muted-foreground line-through mr-2">999 MAD</span>
                <span className="text-4xl font-black text-foreground">499</span>
                <span className="text-sm font-semibold text-muted-foreground ml-1">MAD</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                What&apos;s Included in V2:
              </p>
              <ul className="space-y-3 text-sm text-foreground/90">
                {[
                  "Complete 60-Day Action Roadmap with daily missions",
                  "Make.com & n8n production automation blueprints (JSON downloads)",
                  "Weekly live coaching calls with direct Q&A & replay vault",
                  "VIP Student Community access & deal sharing channels",
                  "Client acquisition SOPs, proposals & contract templates",
                  "Priority support and referral commission booster",
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 space-y-3">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                <Button size="lg" className="w-full text-base font-bold shadow-lg shadow-primary/25 gap-2">
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Upgrade via WhatsApp Support (499 MAD)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Instant manual activation after payment confirmation (CIH, Attijari, Wafacash, Cash Plus)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-2">
          <Link href="/dashboard/modules" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
            Return to AI Library
          </Link>
        </div>
      </div>
    </div>
  );
}
