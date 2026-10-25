import Image from "next/image";
import Link from "next/link";
import { CHALLENGE_OFFER, CHALLENGE_PRICE_LABEL } from "@/data/challenge-offer";
import { EnrollButton, Eyebrow } from "./primitives";

export function FinalCtaSection() {
  return (
    <section className="relative px-5 py-24 sm:px-6 sm:py-32 border-t border-white/[0.05] overflow-hidden">
      {/* Cinematic environmental glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#D6A15D]/[0.08] blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-[15%] w-[400px] h-[300px] bg-[#477CFF]/[0.08] blur-[150px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-4xl relative z-10 text-center">
        <Eyebrow tone="amber">Khtiyar dyalk lyoma</Eyebrow>

        <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#F7F8FA] sm:text-5xl lg:text-6xl">
          T9der tbqa ghir katfrrej f videos...{" "}
          <br className="hidden sm:inline" />
          aw <span className="text-[#D6A15D]">tbda tbni business 7a9i9i.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base text-[#A7AFBE] sm:text-lg leading-relaxed">
          F 60 youm li jayin, t9der tkoun 9additi awel service automatisé, w bdit tconnecta m3a clients.
          Kolchi wajed lik: l'manhaj, les workflows, w l'community.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <EnrollButton trackingId="final-cta">
            Bda Challenge dyalk daba b {CHALLENGE_PRICE_LABEL}
          </EnrollButton>
          <p className="text-xs sm:text-sm text-[#A7AFBE]">
            Khlas wahed dyal {CHALLENGE_PRICE_LABEL} · Bla abonnement chahri
          </p>
        </div>
      </div>
    </section>
  );
}

export function ChallengeFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#05080D] py-12 px-6">
      <div className="mx-auto max-w-6xl flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link href="/60dayschallenge" className="relative block h-8 w-28 overflow-hidden">
            <Image
              src="/logo2.png"
              alt="Eensell University"
              fill
              sizes="120px"
              className="scale-[3.2] object-contain"
            />
          </Link>
          <p className="text-xs text-[#A7AFBE]">
            &copy; {new Date().getFullYear()} Eensell University. Jami3 l'7oqoq ma7fouda.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#A7AFBE]">
          <Link href="/terms" className="hover:text-white transition-colors">
            Chourout l'khedma (Terms)
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Siyassat l'khosoussiya (Privacy)
          </Link>
          <Link href="/refund" className="hover:text-white transition-colors">
            Siyassat l'irja3 (Refund)
          </Link>
          <a
            href={CHALLENGE_OFFER.contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors text-[#D6A15D]"
          >
            Twasol f WhatsApp: {CHALLENGE_OFFER.contact.whatsappDisplay}
          </a>
        </div>
      </div>
    </footer>
  );
}
