"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, User, CreditCard, Hash, Globe, FileCode2,
  Check, Copy, Sparkles, ShieldCheck, Zap, Video, ArrowRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className ?? ""}`}>
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.826 0 10.564 4.741 10.564 10.564 0 5.824-4.74 10.564-10.564 10.564z" />
    </svg>
  );
}

export function UpgradePaymentClient() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"cih" | "cash">("cih");

  const whatsappNumber = "212666065608";
  const whatsappMessage = encodeURIComponent(
    "Salam Saad! I am upgrading to Eensell University V2 for 499 MAD. Here is my bank transfer receipt to activate my account."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(value);
    toast.success(`Copied ${label}!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const cihDetails = [
    { label: "Bank", value: "CIH Bank", icon: Building2 },
    { label: "Account Holder (Bénéficiaire)", value: "MONSIEUR SAAD KAABOUCHE", icon: User },
    { label: "Account Number (Compte)", value: "3546303211005900", icon: CreditCard, highlight: true },
    { label: "RIB (24 Digits)", value: "230825354630321100590031", icon: Hash, highlight: true },
    { label: "IBAN", value: "MA64 2308 2535 4630 3211 0059 0031", icon: Globe },
    { label: "SWIFT Code", value: "CIHMMAMC", icon: FileCode2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs sm:text-sm font-semibold">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>V1 Alumni Loyalty Upgrade: Pay 499 MAD via CIH Bank & send receipt for instant V2 activation</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-slate-200 dark:border-border bg-white/80 dark:bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/upgrade" className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to V2 Overview</span>
          </Link>

          <img
            src="/logo2.png"
            alt="Eensell University"
            className="h-10 w-auto object-contain brightness-0 dark:invert"
          />

          <Badge variant="outline" className="border-primary/30 text-primary font-bold text-xs">
            V1 Alumni Status Active
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* ══════════════════════════════════════════════════════
            HORIZONTAL SPLIT SCREEN: LEFT DETAILS + RIGHT VIDEO
           ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ──────────────────────────────────────────────────
              LEFT SIDE (Cols 7): Big Headline, Price & Payment Details
             ────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/25">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>STEP 2 OF 2: OFFICIAL UPGRADE PAYMENT</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Complete Your Payment & Unlock Challenge V2
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-muted-foreground leading-relaxed">
                Transfer your one-time upgrade fee using the Moroccan bank details below. Send the receipt directly via WhatsApp to activate your account in under 5 minutes.
              </p>
            </div>

            {/* Price Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-card border-2 border-primary/30 shadow-lg shadow-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  V1 Alumni Upgrade Price
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Full Lifetime V2 Ecosystem Access
                </h3>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">
                  One-time payment • No recurring charges • All existing XP points preserved
                </p>
              </div>

              <div className="flex items-baseline gap-2 bg-slate-50 dark:bg-muted/40 px-5 py-3 rounded-xl border border-slate-200 dark:border-border self-start sm:self-center">
                <span className="text-xs text-slate-400 line-through mr-1 font-bold">999 MAD</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  499
                </span>
                <span className="text-base font-bold text-primary">MAD</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-200/60 dark:bg-muted/60 border border-slate-300/60 dark:border-border">
              <button
                type="button"
                onClick={() => setSelectedMethod("cih")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedMethod === "cih"
                    ? "bg-white dark:bg-card text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-border"
                    : "text-slate-600 dark:text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="w-4 h-4 text-primary" />
                <span>CIH Bank (Instant / Recommended)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod("cash")}
                className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedMethod === "cash"
                    ? "bg-white dark:bg-card text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-border"
                    : "text-slate-600 dark:text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Wafacash / Cash Plus</span>
              </button>
            </div>

            {/* Bank Details Content */}
            {selectedMethod === "cih" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-muted-foreground px-1">
                  <span>Official CIH Bank Coordinates</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Instant transfer from any Moroccan bank app
                  </span>
                </div>

                <div className="space-y-2.5">
                  {cihDetails.map((item, idx) => {
                    const Icon = item.icon;
                    const isCopied = copiedKey === item.value;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          item.highlight
                            ? "bg-white dark:bg-card border-primary/30 shadow-sm"
                            : "bg-white/80 dark:bg-card/70 border-slate-200 dark:border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            item.highlight ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-muted text-slate-500"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold text-slate-500 dark:text-muted-foreground leading-tight">
                              {item.label}
                            </p>
                            <p className={`text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wide break-all select-all ${
                              item.highlight ? "font-mono text-primary font-black text-base sm:text-lg" : ""
                            }`}>
                              {item.value}
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={() => handleCopy(item.value, item.label)}
                          size="sm"
                          variant="outline"
                          className={`h-9 px-3.5 text-xs font-bold shrink-0 transition-colors ${
                            isCopied
                              ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600"
                              : "border-slate-300 dark:border-border hover:bg-slate-100 dark:hover:bg-accent"
                          }`}
                        >
                          {isCopied ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied ✓</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    Cash Payment via Wafacash or Cash Plus
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                    If you prefer paying in cash at a nearby Wafacash or Cash Plus agency, message us on WhatsApp. We will send you the required recipient details (Name & CIN).
                  </p>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Salam Saad! I want to pay 499 MAD for the V2 Upgrade via Wafacash/Cash Plus. Please send the CIN details.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold"
                >
                  <span>Request Cash Plus / Wafacash Info on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* ═════ BIG WHATSAPP SUBMIT RECEIPT BUTTON ═════ */}
            <div className="pt-2 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  size="lg"
                  className="w-full h-16 sm:h-18 text-base sm:text-lg font-black bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-[#25D366]/25 rounded-2xl gap-3 transition-transform hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span>I Have Transferred 499 MAD — Send Receipt</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </Button>
              </a>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-muted-foreground px-1 gap-2 text-center sm:text-left">
                <span className="flex items-center justify-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Fast VIP Verification & Activation in 5 to 15 minutes</span>
                </span>
                <span>Direct WhatsApp Support with Saad & Team</span>
              </div>
            </div>

          </div>


          {/* ──────────────────────────────────────────────────
              RIGHT SIDE (Cols 5): Video Explainer & What Unlocks
             ────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Video Player Card */}
            <div className="bg-white dark:bg-card rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-border shadow-md overflow-hidden p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <span>Quick Activation Explainer</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold text-slate-500">
                  2 mins
                </Badge>
              </div>

              {/* The Video Embed */}
              <div className="aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 relative shadow-inner">
                <iframe
                  src="https://www.youtube.com/embed/4Wc5WVTVabM?autoplay=0"
                  title="Eensell University Activation Explainer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-muted-foreground px-1 leading-relaxed">
                Watch this 2-minute walkthrough showing how your payment receipt is verified and how the V2 roadmap and tools are enabled on your account.
              </p>
            </div>

            {/* What Unlocks Summary Card */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                What Unlocks Immediately Upon Confirmation:
              </h4>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {[
                  "Complete 60-Day Action Roadmap with daily missions & milestone unlocks",
                  "Eensell Workspace OS Suite (Lead Scraper + AI Voice Agent Console)",
                  "Make.com Production Automation Blueprints (.JSON downloads)",
                  "Weekly Live Coaching Sessions with Saad & Replay Archive",
                  "Private VIP V2 Student Community & Deal-Sharing Network",
                  "Done-For-You Agency Legal Contracts & Pitch Decks",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust & Guarantee Box */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-snug font-medium">
                100% Secure Transfer. All your existing 1,550+ XP points and previous watched lessons remain permanently saved.
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
