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
  X,
} from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageProvider";

interface WorkspaceProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceProModal({ isOpen, onClose }: WorkspaceProModalProps) {
  const { language, dir } = useLanguage();

  const isAr = language === "ar";
  const isFr = language === "fr";

  const waMessage = encodeURIComponent(
    isAr
      ? "مرحباً فريق Eensell، أريد ترقية حسابي إلى باقة PRO بسعر 499 درهم لفتح Eensell Workspace OS."
      : isFr
      ? "Bonjour l'équipe Eensell, je souhaite mettre à niveau mon compte vers PRO à 499 MAD pour débloquer Eensell Workspace OS."
      : "Hello Eensell Team, I would like to upgrade my account to PRO at 499 MAD to unlock Eensell Workspace OS."
  );

  const waLink = `https://wa.me/212620700085?text=${waMessage}`;

  const perks = [
    {
      icon: MapPin,
      title: isAr ? "استخراج بيانات B2B من خرائط جوجل" : isFr ? "Scraper Google Maps B2B" : "Google Maps B2B Scraper",
      desc: isAr ? "استخرج عملاء محليين بأرقام هواتفهم وإيميلاتهم بنقرة واحدة" : isFr ? "Extrayez des leads qualifiés avec téléphones et emails en 1 clic" : "Extract qualified business leads with phone & email in 1 click",
    },
    {
      icon: MessageSquare,
      title: isAr ? "استوديو واتساب وأتمتة المواعيد" : isFr ? "Studio Outreach WhatsApp" : "WhatsApp Outreach Studio",
      desc: isAr ? "حملات مراسلة ذكية وسيناريوهات حجز المواعيد الآلية" : isFr ? "Campagnes automatisées et scripts de prise de rendez-vous IA" : "Automated appointment booking flows and AI outreach templates",
    },
    {
      icon: Mail,
      title: isAr ? "صياغة البريد الإلكتروني البارد بالذكاء الاصطناعي" : isFr ? "Rédacteur AI Cold Email" : "AI Cold Email Drafter",
      desc: isAr ? "إيميلات مخصصة تقنع العملاء وتحقق أعلى نسبة ردود" : isFr ? "Emails de prospection ultra-personnalisés à fort taux de réponse" : "Hyper-personalized outreach copy with high reply rates",
    },
    {
      icon: Kanban,
      title: isAr ? "نظام CRM وتتبع مسار الصفقات" : isFr ? "CRM Agence & Pipeline de Deals" : "Agency Pipeline & Deal CRM",
      desc: isAr ? "إدارة مراحل العملاء، العقود الشهرية والاشتراكات" : isFr ? "Gérez vos prospects, clôtures et contrats récurrents facilement" : "Manage deal stages, client retainers, and communications",
    },
    {
      icon: Crown,
      title: isAr ? "شارة PRO الرسمية على ملفك الشخصي" : isFr ? "Badge PRO Officiel sur votre profil" : "Official PRO Badge on Profile",
      desc: isAr ? "شارة مميزة تظهر بجانب صورتك وحسابك كعضو PRO معتمد" : isFr ? "Badge exclusif affiché sur votre avatar et statut membre vérifié" : "Distinctive PRO badge displayed on your avatar & account",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        dir={dir}
        className="max-w-2xl p-0 overflow-hidden bg-slate-950 text-white border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.25)] rounded-3xl"
      >
        <DialogTitle className="sr-only">
          {isAr ? "ترقية الخطة إلى PRO بسعر 499 درهم" : "Upgrade Plan to PRO at 499 MAD"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {isAr
            ? "افتح نظام Eensell Workspace OS وجميع أدوات الوكالة الحصرية"
            : "Unlock Eensell Workspace OS and agency operational tools"}
        </DialogDescription>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-amber-500/20 via-primary/10 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-inner mb-4">
            <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Eensell Workspace OS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {isAr ? (
              <>ترقية الخطة إلى <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">PRO بـ 499 درهم</span></>
            ) : isFr ? (
              <>Passez au Plan <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">PRO à 499 MAD</span></>
            ) : (
              <>Upgrade Plan to <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">PRO at 499 MAD</span></>
            )}
          </h2>

          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            {isAr
              ? "افتح نظام التشغيل الكامل للوكالات الذكية (Eensell OS) لاستخراج العملاء، إرسال العروض، وتتبع الإيرادات الشهرية."
              : isFr
              ? "Débloquez le système opérationnel complet d'agence (Eensell OS) pour prospecter, automatiser et piloter votre MRR."
              : "Unlock the full AI Agency Operating System (Eensell OS) to scrape leads, automate outreach, and manage recurring retainers."}
          </p>

          {/* Pricing Highlight Pill */}
          <div className="mt-5 inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-orange-500/10 border border-amber-500/30">
            <span className="text-xs text-slate-400 line-through">1,200 MAD</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">499 MAD</span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {isAr ? "دفع لمرة واحدة" : isFr ? "Accès à vie" : "Lifetime Access"}
            </span>
          </div>
        </div>

        {/* Feature List */}
        <div className="relative px-6 sm:px-8 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            {perks.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-colors ${
                    idx === perks.length - 1 ? "sm:col-span-2 bg-gradient-to-r from-amber-950/30 to-slate-950/80 border-amber-500/30" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white truncate">{p.title}</p>
                      {idx === perks.length - 1 && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="relative p-6 sm:p-8 pt-4 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1"
          >
            <Button
              size="lg"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 border border-amber-300/40 gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>
                {isAr
                  ? "ترقية الحساب إلى PRO بـ 499 درهم (عبر واتساب)"
                  : isFr
                  ? "Passer à PRO à 499 MAD (via WhatsApp)"
                  : "Upgrade to PRO at 499 MAD (via WhatsApp)"}
              </span>
            </Button>
          </a>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto h-12 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl px-5 text-sm font-semibold"
          >
            {isAr ? "إغلاق" : isFr ? "Fermer" : "Maybe Later"}
          </Button>
        </div>

        {/* Guarantee Banner */}
        <div className="bg-slate-900/90 px-6 py-2.5 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isAr
              ? "تفعيل فوري لجميع أدوات Eensell OS وشارة PRO بمجرد تأكيد الإدارة"
              : isFr
              ? "Activation immédiate d'Eensell OS et du badge PRO après confirmation"
              : "Instant activation of Eensell OS & PRO badge upon admin confirmation"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
