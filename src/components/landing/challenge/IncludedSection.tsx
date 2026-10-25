import { Check, ShieldCheck, XCircle } from "lucide-react";
import { SectionHeading, cardSurface } from "./primitives";

const INCLUDED = [
  "Accès kamel l 9 dyal les modules d'formation (dourous video step-by-step)",
  "Workflows Make.com téléchargeables w wajdin direct l'tatbiq",
  "Feuille de route dyal 60 youm m9ssma nhar b nhar",
  "Accès l les sessions d'Live replays msejlin f platforme",
  "Systeme dyal suivi, homeworks w classement (Leaderboard)",
  "Accès l l'community d'Eensell University l tawasol",
];

const NOT_INCLUDED = [
  "Makaynch garanti dyal rab7 aw clients bla khedma w tatbiq mn jehtek",
  "Abonnements d'outils payants (bhal OpenAI aw Make.com pro) katkhleshon direct l charikat dyalhom",
  "Mentoring 1-on-1 fardi bla nhaya (kayn support f l'groupe w les lives)",
];

export function IncludedSection() {
  return (
    <section id="included" className="relative px-5 py-20 sm:px-6 sm:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Chno dakhel f l'offre"
          title={
            <>
              Kolchi wad7: <span className="text-[#D6A15D]">Chno ghadi takhod</span> w chno ma dakhelch.
            </>
          }
          intro="Bghina kolchi ykoun chffaf 100%. Bla w3oud khawya aw fkhakh mkhbyin."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Included */}
          <div className={`${cardSurface} p-8 border-emerald-500/20`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-[#F7F8FA]">
                Chno dakhel 100%:
              </h3>
            </div>

            <ul className="mt-6 space-y-4 text-sm text-[#A7AFBE]">
              {INCLUDED.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="text-[#F7F8FA]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not Included */}
          <div className={`${cardSurface} p-8 border-rose-500/20`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <XCircle className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-[#F7F8FA]">
                Chno ma dakhelch (bach tkoun 3aref):
              </h3>
            </div>

            <ul className="mt-6 space-y-4 text-sm text-[#A7AFBE]">
              {NOT_INCLUDED.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="h-2 w-2 rounded-full bg-rose-400 shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl bg-white/[0.03] p-4 text-xs text-[#A7AFBE]">
              💡 <strong className="text-white">Tozi7:</strong> Bzaf dial les outils bhal Make aw ChatGPT 3ndhom versions gratuites li kafyin f l'bdaya bach t'testi w tbni service dyalk bla ma tkhelles 7ta derhem zayda.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
