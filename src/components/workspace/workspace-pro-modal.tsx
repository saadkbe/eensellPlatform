"use client";

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
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/landing/LanguageProvider";

interface WorkspaceProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceProModal({ isOpen, onClose }: WorkspaceProModalProps) {
  const { language, dir } = useLanguage();

  const isAr = language === "ar";
  const isFr = language === "fr";

  // Official WhatsApp support number for Eensell & Saad Kaabouche
  const waNumber = "212666065608";
  const waMessage = encodeURIComponent(
    isAr
      ? "Salam Saad! أريد ترقية حسابي إلى Eensell PRO بسعر 499 درهم لفتح نظام Workspace OS."
      : isFr
      ? "Salam Saad! Je souhaite mettre à niveau mon compte vers Eensell PRO à 499 MAD pour débloquer Workspace OS."
      : "Salam Saad! I want to upgrade my account to Eensell PRO at 499 MAD to unlock Workspace OS."
  );

  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  const perks = [
    {
      icon: MapPin,
      title: isAr ? "استخراج عملاء B2B من خرائط جوجل" : isFr ? "Scraper Google Maps B2B" : "Google Maps B2B Scraper",
      desc: isAr ? "استخرج بيانات الشركات المحلية مع الهواتف والإيميلات بنقرة واحدة" : isFr ? "Extrayez des leads qualifiés avec téléphones et emails en 1 clic" : "Extract local qualified business leads with verified phone & email",
    },
    {
      icon: MessageSquare,
      title: isAr ? "استوديو واتساب وأتمتة المواعيد" : isFr ? "Studio Outreach WhatsApp" : "WhatsApp Outreach Studio",
      desc: isAr ? "حملات مراسلة ذكية وسيناريوهات إغلاق الصفقات الآلية" : isFr ? "Campagnes automatisées et scripts de prise de rendez-vous IA" : "Automated booking sequences and AI client acquisition templates",
    },
    {
      icon: Mail,
      title: isAr ? "صياغة البريد البارد بالذكاء الاصطناعي" : isFr ? "Rédacteur AI Cold Email" : "AI Cold Email Drafter",
      desc: isAr ? "إيميلات مخصصة تقنع العملاء وتحقق أعلى نسبة ردود" : isFr ? "Emails de prospection ultra-personnalisés à fort taux de réponse" : "Hyper-personalized outreach copy with proven high reply rates",
    },
    {
      icon: Kanban,
      title: isAr ? "نظام CRM ومتابعة العقود الشهرية" : isFr ? "CRM Agence & Pipeline de Deals" : "Agency CRM & Retainers",
      desc: isAr ? "إدارة مراحل العملاء، الفواتير، والعقود المتكررة بسهولة" : isFr ? "Gérez vos prospects, clôtures et contrats récurrents facilement" : "Manage client pipelines, recurring monthly retainers & billing",
    },
    {
      icon: Crown,
      title: isAr ? "شارة PRO الرسمية على ملفك" : isFr ? "Badge PRO Officiel sur votre profil" : "Official PRO Badge on Profile",
      desc: isAr ? "شارة ذهبية موثقة تظهر على حسابك ومجتمع الطلاب" : isFr ? "Badge exclusif affiché sur votre avatar et profil vérifié" : "Distinctive gold badge displayed across your community profile",
      highlight: true,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        dir={dir}
        className="w-full max-w-xl sm:max-w-2xl p-0 overflow-hidden bg-[#0A0B10] text-white border border-white/[0.08] shadow-[0_24px_70px_rgba(0,0,0,0.85)] rounded-3xl"
      >
        <DialogTitle className="sr-only">
          {isAr ? "ترقية الخطة إلى PRO بسعر 499 درهم" : "Upgrade Plan to PRO at 499 MAD"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {isAr
            ? "افتح نظام Eensell Workspace OS وجميع أدوات الوكالة الحصرية"
            : "Unlock Eensell Workspace OS and agency operational tools"}
        </DialogDescription>

        {/* Ambient Top Glow & Minimal Grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.07] via-transparent to-orange-500/[0.04] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Modal Header */}
        <div className="relative z-10 p-6 sm:p-8 pb-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wider uppercase mb-3">
            <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Eensell Workspace OS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            {isAr ? (
              <>ترقية الخطة إلى <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent font-mono">PRO</span></>
            ) : isFr ? (
              <>Passez au Plan <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent font-mono">PRO</span></>
            ) : (
              <>Upgrade License to <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent font-mono">PRO OS</span></>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            {isAr
              ? "نظام التشغيل المتكامل لأصحاب الوكالات الذكية: استخراج العملاء، مراسلة الشركات، وإدارة العقود الشهرية بسهولة."
              : isFr
              ? "Le système opérationnel complet pour fondateurs d'agence IA : prospection B2B, outreach automatisé et gestion de retainers."
              : "The complete agency operating system: scrape high-ticket leads, run automated WhatsApp outreach, and scale recurring client retainers."}
          </p>

          {/* Pricing Highlight Pill */}
          <div className="mt-4 inline-flex items-center gap-3 px-4 sm:px-5 py-2 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            <span className="text-xs text-slate-500 line-through">1,200 MAD</span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">499 MAD</span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {isAr ? "وصول مدى الحياة" : isFr ? "Accès à vie" : "Lifetime Access"}
            </span>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="relative z-10 px-6 sm:px-8 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {perks.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                    p.highlight
                      ? "sm:col-span-2 bg-gradient-to-r from-amber-500/[0.08] to-transparent border-amber-500/30"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{p.title}</p>
                      {p.highlight && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">{p.desc}</p>
                  </div>
                </div>
              );
            })}
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
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>
                {isAr
                  ? "ترقية إلى PRO بـ 499 درهم (عبر واتساب)"
                  : isFr
                  ? "Passer à PRO à 499 MAD (via WhatsApp)"
                  : "Upgrade to PRO at 499 MAD (WhatsApp)"}
              </span>
            </Button>
          </a>

          <Link href="/upgrade/payment" onClick={onClose} className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto h-12 rounded-xl border-white/10 hover:bg-white/[0.06] text-white font-bold text-xs px-4 gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>{isAr ? "تحويل بنكي (CIH)" : isFr ? "Virement Bancaire (CIH)" : "Bank Transfer (CIH)"}</span>
            </Button>
          </Link>
        </div>

        {/* Minimal Assurance Footer */}
        <div className="relative z-10 bg-white/[0.02] px-6 py-2.5 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {isAr
              ? "تفعيل فوري لكافة أدوات Workspace OS بمجرد تأكيد الوصل عبر واتساب أو التحويل البنكي"
              : isFr
              ? "Activation immédiate d'Eensell OS dès confirmation du reçu sur WhatsApp ou virement bancaire"
              : "Instant activation of Eensell Workspace OS upon payment receipt confirmation"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
