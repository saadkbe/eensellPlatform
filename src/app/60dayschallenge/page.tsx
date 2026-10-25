import type { Metadata } from "next";
import { ChallengeNavbar } from "@/components/landing/challenge/ChallengeNavbar";
import { ChallengeHero } from "@/components/landing/challenge/ChallengeHero";
import { ProblemSection } from "@/components/landing/challenge/ProblemSection";
import { OpportunitySection } from "@/components/landing/challenge/OpportunitySection";
import { EarningsProofWidget } from "@/components/landing/challenge/EarningsProofWidget";
import { RoadmapSection } from "@/components/landing/challenge/RoadmapSection";
import { PlatformSection } from "@/components/landing/challenge/PlatformSection";
import { TestimonialsSection } from "@/components/landing/challenge/TestimonialsSection";
import { IncludedSection } from "@/components/landing/challenge/IncludedSection";
import { PricingSection } from "@/components/landing/challenge/PricingSection";
import { FaqSection } from "@/components/landing/challenge/FaqSection";
import { FinalCtaSection, ChallengeFooter } from "@/components/landing/challenge/FinalCtaSection";
import { CHALLENGE_PRICE_LABEL } from "@/data/challenge-offer";

export const metadata: Metadata = {
  title: "Challenge 60 Youm — Bni Business dyalk b AI | Eensell University",
  description:
    "Roadmap 3amali dyal 60 youm bach tbni awel service dyalk b AI, t3ref kifach tbi3o, w tkhdem 3la awel client dyalk f l'Maghrib. Dkhol daba b " +
    CHALLENGE_PRICE_LABEL +
    ".",
  openGraph: {
    title: "Challenge 60 Youm — Bni Business dyalk b AI | Eensell University",
    description:
      "Baraka mn l'ferja f tutorials. Bda tbni service d'AI 7a9i9i w jib awel client dyalk f 60 youm.",
    type: "website",
    locale: "ar_MA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Challenge 60 Youm — Bni Business dyalk b AI | Eensell University",
    description:
      "Roadmap 3amali dyal 60 youm bach tbni awel service dyalk b AI w tkhdem 3la awel client dyalk.",
  },
};

export default function SixtyDaysChallengePage() {
  return (
    <div className="min-h-screen bg-[#05080D] text-[#F7F8FA] selection:bg-[#D6A15D]/20 selection:text-white font-sans antialiased overflow-x-hidden">
      <ChallengeNavbar />
      <main>
        {/* Section A — Hero */}
        <ChallengeHero />

        {/* Section B — Problem & Positioning */}
        <ProblemSection />

        {/* Section C — The Business Opportunity */}
        <OpportunitySection />

        {/* High-Converting Widget: Real Earnings & Setup Fee vs Retainer model */}
        <div className="px-5 sm:px-6">
          <EarningsProofWidget />
        </div>

        {/* Section D — The 60-Day Roadmap */}
        <RoadmapSection />

        {/* Section E — Inside Eensell University & Live Community Widget */}
        <PlatformSection />

        {/* Section F — Existing Authentic Testimonials */}
        <TestimonialsSection />

        {/* Section G — What's Included */}
        <IncludedSection />

        {/* Section H — Pricing */}
        <PricingSection />

        {/* Section I — FAQ */}
        <FaqSection />

        {/* Section J — Final CTA */}
        <FinalCtaSection />
      </main>

      <ChallengeFooter />
    </div>
  );
}
