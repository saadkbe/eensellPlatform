"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Sparkles,
  MapPin,
  MessageSquare,
  Mail,
  Kanban,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  Copy,
  Check,
  Building2,
  Calendar,
  Flame,
} from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";
import { toast } from "sonner";

interface WorkspaceProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RechargePlan = "1month" | "3months" | "1year";

export function WorkspaceProModal({ isOpen, onClose }: WorkspaceProModalProps) {
  const { language, dir } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan>("1month");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isAr = language === "ar";
  const isFr = language === "fr";

  // Official WhatsApp support number for Eensell & Saad Kaabouche
  const waNumber = "212666065608";

  const planDetails = {
    "1month": {
      price: 199,
      duration: isAr ? "شهر واحد" : isFr ? "1 Mois" : "1 Month",
      badge: isAr ? "الأكثر مرونة" : isFr ? "Le plus flexible" : "Most Flexible",
      waText: isAr
        ? "Salam Saad! أريد تجديد اشتراك Eensell Workspace OS لمدة شهر واحد (199 درهم)."
        : isFr
        ? "Salam Saad! Je souhaite recharger mon accès Eensell Workspace OS pour 1 Mois (199 MAD)."
        : "Salam Saad! I want to recharge my Eensell Workspace OS access for 1 Month (199 MAD).",
    },
    "3months": {
      price: 499,
      duration: isAr ? "3 أشهر" : isFr ? "3 Mois" : "3 Months",
      badge: isAr ? "الأكثر طلباً • وفر 100 درهم" : isFr ? "Le plus populaire • Économisez 100 MAD" : "Most Popular • Save 100 MAD",
      waText: isAr
        ? "Salam Saad! أريد تجديد اشتراك Eensell Workspace OS لمدة 3 أشهر (499 درهم) مع بونص Make.com Blueprints."
        : isFr
        ? "Salam Saad! Je souhaite recharger mon accès Eensell Workspace OS pour 3 Mois (499 MAD) avec le bonus Make.com Blueprints."
        : "Salam Saad! I want to recharge my Eensell Workspace OS access for 3 Months (499 MAD) with the Make.com Blueprints bonus.",
    },
    "1year": {
      price: 1499,
      duration: isAr ? "سنة كاملة (12 شهر)" : isFr ? "1 An (12 Mois)" : "1 Year (12 Months)",
      badge: isAr ? "وفر 900 درهم • جلسة خاصة" : isFr ? "Économisez 900 MAD • Session VIP" : "Save 900 MAD • VIP Session",
      waText: isAr
        ? "Salam Saad! أريد الحصول على باقة سنة كاملة لـ Eensell Workspace OS (1499 درهم) مع المراجعة الاستراتيجية الخاصة."
        : isFr
        ? "Salam Saad! Je souhaite recharger mon accès Eensell Workspace OS pour 1 An (1,499 MAD) avec l'audit stratégique privé."
        : "Salam Saad! I want to recharge my Eensell Workspace OS access for 1 Year (1,499 MAD) with the private strategic audit.",
    },
  };

  const activePlan = planDetails[selectedPlan];
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(activePlan.waText)}`;

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(value);
    toast.success(isAr ? `تم نسخ ${label} بنجاح!` : `Copié : ${label}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const perks = [
    {
      icon: MapPin,
      title: isAr ? "استخراج عملاء B2B من خرائط جوجل" : isFr ? "Scraper Google Maps B2B" : "Google Maps B2B Scraper",
      desc: isAr ? "استخرج الشركات المحلية وأرقام الواتساب المباشرة" : isFr ? "Prospectez des entreprises avec WhatsApp direct" : "Extract local qualified business leads with direct WhatsApp",
    },
    {
      icon: MessageSquare,
      title: isAr ? "استوديو واتساب بالدارجة والفرنسية" : isFr ? "Studio WhatsApp Darija & Français" : "Darija & French WhatsApp Studio",
      desc: isAr ? "نماذج ورسائل صوتية تحقق أعلى نسبة استجابة" : isFr ? "Scripts et vocaux IA à fort taux de réponse" : "AI outreach scripts and audio notes with top reply rates",
    },
    {
      icon: Mail,
      title: isAr ? "صياغة البريد البارد (GPT-4o)" : isFr ? "AI Cold Emailer (GPT-4o)" : "AI Cold Emailer (GPT-4o)",
      desc: isAr ? "إيميلات مخصصة ومزامنة الإرسال بـ Gmail" : isFr ? "Prospection personnalisée connectée à Gmail" : "Custom outreach synchronized with personal Gmail",
    },
    {
      icon: Kanban,
      title: isAr ? "نظام CRM وإدارة الفواتير والـ Devis" : isFr ? "CRM & Devis / Factures en MAD" : "Agency CRM & Invoices in MAD",
      desc: isAr ? "متابعة مراحل الصفقات والـ Retainers الشهرية" : isFr ? "Suivi des deals et retainers récurrents" : "Deal tracking and monthly agency retainers",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        dir={dir}
        className="w-full max-w-xl sm:max-w-2xl p-0 overflow-hidden bg-[#0A0B10] text-white border border-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.85)] rounded-3xl"
      >
        <DialogTitle className="sr-only">
          {isAr ? "تجديد اشتراك Eensell Workspace OS" : "Recharger l'accès Eensell Workspace OS"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {isAr
            ? "اختر باقة تجديد مساحة العمل لتفعيل استخراج العملاء ونظام الـ CRM"
            : "Choisissez votre pass de recharge Workspace OS"}
        </DialogDescription>

        {/* Ambient Top Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-orange-500/[0.04] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 p-6 sm:p-8 pb-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wider uppercase mb-3">
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{isAr ? "مساحة عمل الوكالة الذكية" : "Eensell Workspace OS"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            {isAr ? (
              <>تجديد باقة <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent font-mono">Workspace OS</span></>
            ) : isFr ? (
              <>Recharger votre pass <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent font-mono">Workspace OS</span></>
            ) : (
              <>Recharge Your <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent font-mono">Workspace OS</span> Pass</>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            {isAr
              ? "استمر في استخراج بيانات العملاء، إرسال حملات الواتساب، وإدارة صفقات وكالتك بدون انقطاع."
              : isFr
              ? "Continuez à extraire des leads Maps qualifiés, envoyer vos campagnes et gérer votre CRM sans interruption."
              : "Keep extracting verified leads, launching client outreach campaigns, and managing your agency CRM seamlessly."}
          </p>

          {/* ── Interactive 3 Plan Selector ── */}
          <div className="mt-5 grid grid-cols-3 gap-2.5 max-w-lg mx-auto">
            {/* 1 Month */}
            <button
              type="button"
              onClick={() => setSelectedPlan("1month")}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                selectedPlan === "1month"
                  ? "bg-amber-500/15 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]"
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isAr ? "شهر واحد" : isFr ? "1 Mois" : "1 Month"}
              </div>
              <div className="text-lg sm:text-xl font-black font-mono text-white">
                199 <span className="text-xs font-bold text-amber-400">MAD</span>
              </div>
              <div className="text-[9px] text-slate-500 font-medium mt-0.5">
                {isAr ? "اشتراك شهري" : isFr ? "Mensuel" : "Monthly"}
              </div>
            </button>

            {/* 3 Months (Recommended) */}
            <button
              type="button"
              onClick={() => setSelectedPlan("3months")}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                selectedPlan === "3months"
                  ? "bg-amber-500/20 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50"
                  : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]"
              }`}
            >
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                {isAr ? "الأفضل قيمة" : isFr ? "Le plus populaire" : "Best Value"}
              </div>
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                {isAr ? "3 أشهر" : isFr ? "3 Mois" : "3 Months"}
              </div>
              <div className="text-lg sm:text-xl font-black font-mono text-white">
                499 <span className="text-xs font-bold text-amber-400">MAD</span>
              </div>
              <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">
                {isAr ? "وفر 100 درهم" : isFr ? "Éco. 100 MAD" : "Save 100 MAD"}
              </div>
            </button>

            {/* 1 Year */}
            <button
              type="button"
              onClick={() => setSelectedPlan("1year")}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                selectedPlan === "1year"
                  ? "bg-amber-500/15 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]"
              }`}
            >
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isAr ? "سنة كاملة" : isFr ? "1 An" : "1 Year"}
              </div>
              <div className="text-lg sm:text-xl font-black font-mono text-white">
                1,499 <span className="text-xs font-bold text-amber-400">MAD</span>
              </div>
              <div className="text-[9px] text-emerald-400 font-semibold mt-0.5">
                {isAr ? "وفر 900 درهم" : isFr ? "Éco. 900 MAD" : "Save 900 MAD"}
              </div>
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="relative z-10 px-6 sm:px-8 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {perks.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl border bg-white/[0.02] border-white/[0.06]"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-400 leading-snug line-clamp-1">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CIH Bank Quick Transfer Details ── */}
        <div className="relative z-10 px-6 sm:px-8 pt-2">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-medium">CIH Bank • RIB (24 Chiffres)</span>
                <span className="font-mono text-xs font-bold text-white tracking-wide truncate block">
                  230825354630321100590031
                </span>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleCopy("230825354630321100590031", "RIB CIH")}
              className="h-8 px-2.5 text-xs rounded-xl border-white/10 hover:bg-white/10 text-white shrink-0 cursor-pointer"
            >
              {copiedKey === "230825354630321100590031" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="ml-1.5">{copiedKey === "230825354630321100590031" ? "Copié" : "Copier"}</span>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 p-6 sm:p-8 pt-4 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1"
          >
            <Button
              size="lg"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] border-0 gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>
                {isAr
                  ? `تأكيد باقة ${activePlan.duration} (${activePlan.price} درهم عبر واتساب)`
                  : isFr
                  ? `Confirmer le pass ${activePlan.duration} (${activePlan.price} MAD via WhatsApp)`
                  : `Confirm ${activePlan.duration} Pass (${activePlan.price} MAD on WhatsApp)`}
              </span>
            </Button>
          </a>
        </div>

        {/* Minimal Assurance Footer */}
        <div className="relative z-10 bg-white/[0.02] px-6 py-2.5 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {isAr
              ? "تفعيل فوري لـ Workspace OS بمجرد إرسال الوصل على واتساب • بياناتك وعملائك محفوظة دائماً"
              : isFr
              ? "Activation immédiate dès envoi du reçu • Vos leads et données CRM restent toujours sauvegardés"
              : "Instant activation upon WhatsApp confirmation • Your leads and CRM data are always preserved"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
