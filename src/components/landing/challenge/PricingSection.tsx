import { Check, ShieldAlert } from "lucide-react";
import { CHALLENGE_OFFER, CHALLENGE_PRICE_LABEL } from "@/data/challenge-offer";
import { EnrollButton, SectionHeading, cardSurface } from "./primitives";

export function PricingSection() {
  return (
    <section id="pricing" className="relative px-5 py-20 sm:px-6 sm:py-28 border-t border-white/[0.05]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-[#D6A15D]/[0.08] blur-[150px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-6xl relative z-10">
        <SectionHeading
          eyebrow="Taman d'inscri"
          title={
            <>
              Offre wahed wad7: <span className="text-[#D6A15D]">Dkhol l Challenge daba.</span>
            </>
          }
          intro="Khlas wahed f l'bdaya, bla abonnement chahri, bla chourout mkhbya."
        />

        <div className="mt-14 max-w-xl mx-auto">
          <div className={`${cardSurface} relative overflow-hidden border-[#D6A15D]/40 p-8 sm:p-10 shadow-[0_20px_80px_-20px_rgba(214,161,93,0.15)]`}>
            {/* Top decorative pill */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
              <div>
                <span className="rounded-full bg-[#D6A15D]/15 border border-[#D6A15D]/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#D6A15D]">
                  Accès Kamel
                </span>
                <h3 className="text-2xl font-bold text-[#F7F8FA] mt-2">
                  60-Day AI Business Challenge
                </h3>
              </div>
            </div>

            {/* Price display */}
            <div className="py-8 border-b border-white/[0.08]">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-extrabold text-[#F7F8FA] tracking-tight">
                  {CHALLENGE_OFFER.priceMad}
                </span>
                <span className="text-2xl font-bold text-[#D6A15D]">
                  {CHALLENGE_OFFER.currency}
                </span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-[#A7AFBE]">
                Khlas wa7ed l'merra l'we7da (Paiement unique) · Accès l l'programme kamel.
              </p>
            </div>

            {/* Inclusions checklist */}
            <div className="py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#A7AFBE] mb-4">
                Chno fih had l'prix:
              </p>
              <ul className="space-y-3.5 text-sm text-[#F7F8FA]">
                {[
                  "9 dyal les modules d'formation (vidéos over-the-shoulder)",
                  "Make.com workflows wajdin l'telechargement",
                  "Roadmap 60 youm m9ssma nhar b nhar",
                  "Replays dyal les sessions live",
                  "Systeme d'homeworks w leaderboard",
                  "Accès l Eensell University Community",
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D6A15D]/20 text-[#D6A15D]">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-4 flex flex-col gap-3">
              <EnrollButton trackingId="pricing-card" className="w-full">
                Bda Challenge dyalk daba b {CHALLENGE_PRICE_LABEL}
              </EnrollButton>
              <p className="text-center text-xs text-[#A7AFBE]">
                Tariqat l'khlas: CIH Bank, Wafacash, aw Cash Plus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
