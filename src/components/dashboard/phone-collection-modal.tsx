"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, ShieldCheck, Sparkles, ArrowRight, Phone, CheckCircle2 } from "lucide-react";
import { updateUserPhone } from "@/actions/user.actions";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface PhoneCollectionModalProps {
  isOpen: boolean;
  onSuccess?: (phone: string) => void;
}

export function PhoneCollectionModal({ isOpen, onSuccess }: PhoneCollectionModalProps) {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenState, setIsOpenState] = useState(isOpen);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      toast.error("Veuillez saisir votre numéro WhatsApp valide.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await updateUserPhone(phone);
      if (res.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        toast.success("Numéro WhatsApp enregistré avec succès !");
        setIsOpenState(false);
        if (onSuccess && res.phone) {
          onSuccess(res.phone);
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement du numéro.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpenState} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-md p-0 overflow-hidden bg-[#0D0E15] text-white border border-white/[0.08] shadow-[0_25px_70px_rgba(0,0,0,0.9)] rounded-3xl"
      >
        <DialogTitle className="sr-only">Numéro WhatsApp Requis</DialogTitle>
        <DialogDescription className="sr-only">
          Veuillez renseigner votre numéro WhatsApp pour activer vos alertes et le support direct.
        </DialogDescription>

        {/* Ambient Top Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-teal-500/[0.04] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-[70px] pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8">
          {/* Top Badge */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Étape Obligatoire • Membres Actifs</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto mb-4 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <MessageSquare className="w-7 h-7" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              Ajoutez votre WhatsApp
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
              Pour vous envoyer vos accès <strong className="text-emerald-400">Workspace OS</strong>, les opportunités clients et le support direct de Saad.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                Numéro WhatsApp (Maroc ou International)
              </label>

              <div className="relative flex items-center rounded-2xl bg-white/[0.04] border border-white/10 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all p-1">
                {/* Prefix Pill */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.05] rounded-xl text-xs font-bold text-slate-300 shrink-0 border border-white/[0.06]">
                  <span className="text-base leading-none">🇲🇦</span>
                  <span>+212</span>
                </div>

                <Input
                  type="tel"
                  required
                  placeholder="06 12 34 56 78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border-0 bg-transparent text-white font-mono text-sm placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 h-10"
                  autoFocus
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Exemple : <code className="text-slate-300 font-mono">0666065608</code> ou <code className="text-slate-300 font-mono">07XXXXXXXX</code>
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !phone.trim()}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? "Enregistrement..." : "Confirmer et Accéder au Dashboard"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>
          </form>

          {/* Guarantee */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Vos coordonnées restent 100% privées et sécurisées</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
