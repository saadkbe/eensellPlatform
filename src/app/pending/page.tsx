"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Copy, Check, Building2, User, CreditCard, Hash, Globe,
  FileCode2, CheckCircle2, Sparkles, Video, ShieldCheck, Zap,
  AlertCircle, ChevronDown, Lock, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { Language } from "@/lib/translations";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { checkUserStatus } from "@/actions/user.actions";

const languages: { code: Language; label: string; flagUrl: string }[] = [
  { code: "ar", label: "العربية", flagUrl: "https://flagcdn.com/sa.svg" },
  { code: "fr", label: "Français", flagUrl: "https://flagcdn.com/fr.svg" },
  { code: "en", label: "English", flagUrl: "https://flagcdn.com/us.svg" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`shrink-0 ${className ?? ""}`}>
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-5.824 4.74-10.563 10.564-10.563 5.826 0 10.564 4.741 10.564 10.564 0 5.824-4.74 10.564-10.564 10.564z" />
    </svg>
  );
}

function PendingContent() {
  const router = useRouter();
  const { t, language, setLanguage, dir, isRTL } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"cih" | "cash">("cih");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);

  /** Tri-lingual text helper */
  const tx = (ar: string, fr: string, en: string) =>
    language === "ar" ? ar : language === "fr" ? fr : en;

  /* ── Auto-Refresh Polling for Admin Activation ── */
  useEffect(() => {
    // If admin is previewing the page via ?preview=true, skip polling redirect
    if (typeof window !== "undefined" && window.location.search.includes("preview=true")) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const status = await checkUserStatus();
        if (status === "ACTIVE") {
          clearInterval(interval);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          toast.success(tx("تمت الموافقة وتفعيل حسابك! جاري التحويل...", "Compte activé ! Redirection...", "Account activated! Redirecting..."));
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } catch (e) {
        console.error("Polling status error:", e);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [router, tx]);

  /* ── WhatsApp Message Setup ── */
  const whatsappNumber = "212666065608";
  const whatsappText = encodeURIComponent(
    "Salam Saad! I have transferred the 499 MAD payment for Eensell University. Here is my receipt to activate my account."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  /* ── Copy handler ── */
  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(value);
    toast.success(language === "ar" ? `تم نسخ ${label} بنجاح!` : `Copied ${label}!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const cihDetails = [
    { label: tx("البنك", "Banque", "Bank"), value: "CIH Bank", icon: Building2 },
    { label: tx("الاسم الكامل للمستفيد", "Bénéficiaire (Nom)", "Account Holder"), value: "MONSIEUR SAAD KAABOUCHE", icon: User },
    { label: tx("رقم الحساب (Compte)", "Numéro de Compte", "Account Number"), value: "3546303211005900", icon: CreditCard, highlight: true },
    { label: tx("رمز البنك (RIB - 24 Chiffres)", "RIB (24 Chiffres)", "RIB (24 Digits)"), value: "230825354630321100590031", icon: Hash, highlight: true },
    { label: tx("رقم الحساب الدولي (IBAN)", "IBAN", "IBAN"), value: "MA64 2308 2535 4630 3211 0059 0031", icon: Globe },
    { label: tx("رمز السويفت (SWIFT)", "Code SWIFT", "SWIFT Code"), value: "CIHMMAMC", icon: FileCode2 },
  ];

  return (
    <div dir={dir} className={`min-h-screen bg-slate-50/70 dark:bg-background text-foreground antialiased selection:bg-primary/20 ${isRTL ? "font-arabic" : ""}`}>
      {/* ── Top Notice Information Banner (Full Width, Never Covered) ── */}
      <div className="w-full bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
          <span>
            {tx(
              "خطوة أخيرة: أكمل التحويل البنكي ثم أرسل صورة الوصل عبر واتساب لتفعيل حسابك فوراً",
              "Dernière étape : effectuez le virement puis envoyez le reçu sur WhatsApp pour activation immédiate",
              "Final step: complete your bank transfer and send your receipt via WhatsApp for instant activation"
            )}
          </span>
        </div>
      </div>

      {/* ── Clean, Compact, Docked Header (Proper size, zero overlap) ── */}
      <header className="border-b border-slate-200 dark:border-border bg-white/95 dark:bg-card/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo2.png"
              alt="Eensell University"
              className="h-8 sm:h-9 w-auto object-contain brightness-0 dark:invert"
            />
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-border text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-accent transition-colors"
              >
                <img
                  src={languages.find((l) => l.code === language)?.flagUrl}
                  alt={language}
                  className="w-4 h-auto rounded-xs shadow-xs"
                />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              {isLangOpen && (
                <div className="absolute top-full mt-1.5 right-0 rtl:right-auto rtl:left-0 w-36 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-xl py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left rtl:text-right ${
                        language === lang.code
                          ? "bg-primary/10 font-bold text-primary"
                          : "font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-accent"
                      }`}
                    >
                      <img src={lang.flagUrl} alt={lang.code} className="w-4 h-auto rounded-xs" />
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <SignOutButton>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-bold text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-accent gap-1.5 h-8 px-2.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t("pending_logout")}</span>
              </Button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        {/* ══════════════════════════════════════════════════════
            HORIZONTAL SPLIT SCREEN: LEFT DETAILS + RIGHT VIDEO
           ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ──────────────────────────────────────────────────
              LEFT SIDE (Cols 7): Big Headline, Price & Payment Details
             ────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Badge & Title */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/25">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {tx("تفعيل العضوية الرسمية", "Activation Officielle", "Official Membership Activation")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                {tx("إتمام الدفع وتفعيل الحساب", "Finaliser le Paiement", "Complete Your Payment")}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-muted-foreground leading-relaxed">
                {tx(
                  "قم بتحويل المبلغ عبر الحساب البنكي أدناه، ثم التقط صورة للوصل واضغط على زر الواتساب لإرسالها. سيتم التحقق وتفعيل حسابك في دقائق معدودة.",
                  "Transférez le montant via les coordonnées bancaires ci-dessous, puis prenez une photo du reçu et cliquez sur WhatsApp pour l'envoyer. Activation en quelques minutes.",
                  "Transfer the amount using the bank details below, then take a photo of your receipt and click WhatsApp to send it. Your account will be activated in minutes."
                )}
              </p>
            </div>

            {/* Price Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-card border-2 border-primary/30 shadow-lg shadow-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {tx("المبلغ المطلوب للتحويل", "Montant à Régler", "Amount to Transfer")}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {tx("الوصول الشامل لجامعة إنسل V2", "Accès Complet Eensell University V2", "Full Eensell University V2 Access")}
                </h3>
                <p className="text-xs text-slate-500 dark:text-muted-foreground">
                  {tx("دفعة واحدة لمرة واحدة • وصول مدى الحياة", "Paiement unique • Accès à vie", "One-time payment • Lifetime access")}
                </p>
              </div>

              <div className="flex items-baseline gap-2 bg-slate-50 dark:bg-muted/40 px-5 py-3 rounded-xl border border-slate-200 dark:border-border self-start sm:self-center">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  499
                </span>
                <span className="text-base font-bold text-primary">MAD</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
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
                <span>CIH Bank (Recommandé / فوري)</span>
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
                  <span>{tx("معلومات التحويل البنكي (CIH)", "Coordonnées Bancaires CIH", "CIH Bank Details")}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ {tx("تحويل بنكي فوري من أي بنك مغربي", "Virement instantané depuis toute banque", "Instant transfer from any Moroccan bank")}
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
                              <span>{tx("تم النسخ ✓", "Copié ✓", "Copied ✓")}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Copy className="w-3.5 h-3.5" />
                              <span>{tx("نسخ", "Copier", "Copy")}</span>
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border space-y-4 text-center sm:text-left">
                <div className="space-y-2">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {tx("الدفع عبر وكالات Wafacash أو Cash Plus", "Paiement via agences Wafacash ou Cash Plus", "Payment via Wafacash or Cash Plus branches")}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                    {tx(
                      "إذا كنت تفضل الدفع نقداً عبر أقرب وكالة Cash Plus أو Wafacash، تواصل معنا مباشرة عبر الواتساب لتزويدك باسم المستفيد ورقم البطاقة الوطنية (CIN).",
                      "Si vous préférez payer en espèces dans une agence Cash Plus ou Wafacash, contactez-nous directement sur WhatsApp pour obtenir le nom et le numéro CIN du bénéficiaire.",
                      "If you prefer to pay in cash at a Cash Plus or Wafacash agency, contact us directly on WhatsApp to get the beneficiary name and CIN card details."
                    )}
                  </p>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Salam Saad! I want to pay 499 MAD via Wafacash/Cash Plus. Please provide the CIN details.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold"
                >
                  <span>{tx("طلب معلومات Cash Plus عبر واتساب", "Demander les infos Cash Plus sur WhatsApp", "Request Cash Plus details on WhatsApp")}</span>
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
                  <span>
                    {tx("لقد أتممت التحويل — أرسل الوصل للتفعيل", "J'ai effectué le paiement — Envoyer le reçu", "I Have Transferred — Send Receipt on WhatsApp")}
                  </span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </Button>
              </a>

              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-muted-foreground px-1 gap-2 text-center sm:text-left">
                <span className="flex items-center justify-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{tx("تفعيل تلقائي / فوري في غضون 5 إلى 15 دقيقة", "Activation en 5 à 15 minutes", "Verified & activated in 5 to 15 minutes")}</span>
                </span>
                <span>{tx("دعم مستمر عبر واتساب 24/7", "Support WhatsApp 24/7", "24/7 WhatsApp Support")}</span>
              </div>
            </div>

            {/* Sign Out Option */}
            <div className="pt-4 text-center sm:text-left">
              <SignOutButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  <span>{t("pending_logout")}</span>
                </Button>
              </SignOutButton>
            </div>

          </div>


          {/* ──────────────────────────────────────────────────
              RIGHT SIDE (Cols 5): Video Explainer & What Unlocks
             ────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            
            {/* Video Player Card */}
            <div className="bg-white dark:bg-card rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-border shadow-md overflow-hidden p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Video className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    {tx("فيديو توضيحي لطريقة التفعيل", "Vidéo explicative d'activation", "Activation Explainer Video")}
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px] font-semibold text-slate-500">
                  {tx("2 دقائق", "2 min", "2 mins")}
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
                {tx(
                  "شاهد هذا الفيديو لمعرفة كيف تتم عملية مراجعة الوصل وتفعيل صلاحياتك الكاملة داخل المنصة.",
                  "Regardez cette vidéo pour comprendre comment vos accès sont validés et débloqués.",
                  "Watch this quick video to see how your payment receipt is verified and your full dashboard unlocked."
                )}
              </p>
            </div>

            {/* What Unlocks Summary Card */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-card border border-slate-200 dark:border-border shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {tx("ما الذي ستفتحه فور تأكيد الدفع:", "Ce qui sera débloqué immédiatement :", "What unlocks immediately upon confirmation:")}
              </h4>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {[
                  tx("خارطة الطريق التفاعلية لـ 60 يوم (من اليوم الأول للعميل الأول)", "Roadmap interactive 60 jours pas à pas", "Interactive 60-Day Action Roadmap & daily missions"),
                  tx("بيئة عمل Eensell Workspace OS (استخراج العملاء + مكالمات الذكاء الاصطناعي)", "Eensell Workspace OS (Scraper + Voice AI)", "Eensell Workspace OS (Lead Scraper + Voice Caller)"),
                  tx("مخططات أتمتة Make.com الجاهزة للتنزيل والتشغيل (.JSON)", "Blueprints Make.com prêts à déployer (.JSON)", "Production Make.com & AI Blueprints (.JSON downloads)"),
                  tx("المكالمات التدريبية المباشرة كل أسبوع مع سعد + أرشيف التسجيلات", "Sessions de coaching live chaque semaine + Replays", "Weekly Live Coaching Calls with Saad & Replay Vault"),
                  tx("مجتمع الطلاب الخاص وشبكة مشاركة الصفقات", "Communauté privée VIP des fondateurs", "Private VIP Student Community & deal sharing"),
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
                {tx(
                  "دفع آمن 100% ومضمون. حسابك وتقدمك وسجل نقاطك محفوظ بالكامل.",
                  "Paiement 100% sécurisé et garanti. Vos points et votre progression sont intégralement conservés.",
                  "100% secure payment. Your points, profile, and progress are fully preserved."
                )}
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

export default function PendingPage() {
  return <PendingContent />;
}
