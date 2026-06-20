import dynamic from "next/dynamic";
import Image from "next/image";
import { HeroSection } from "@/components/landing/HeroSection";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";


// Dynamically import below-the-fold sections
const PricingSection = dynamic(() =>
  import("@/components/landing/PricingSection").then(mod => mod.PricingSection)
);
const FeaturesSection = dynamic(() =>
  import("@/components/landing/FeaturesSection").then(mod => mod.FeaturesSection)
);
const OpportunitySection = dynamic(() =>
  import("@/components/landing/OpportunitySection").then(mod => mod.OpportunitySection)
);
const TransformationSection = dynamic(() =>
  import("@/components/landing/TransformationSection").then(mod => mod.TransformationSection)
);
const SocialProofSection = dynamic(() =>
  import("@/components/landing/SocialProofSection").then(mod => mod.SocialProofSection)
);
const MotivationSection = dynamic(() =>
  import("@/components/landing/MotivationSection").then(mod => mod.MotivationSection)
);
const FaqSection = dynamic(() =>
  import("@/components/landing/FaqSection").then(mod => mod.FaqSection)
);
const FinalCtaSection = dynamic(() =>
  import("@/components/landing/FinalCtaSection").then(mod => mod.FinalCtaSection)
);

export default function HomePage() {
  return (

      <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 relative overflow-x-hidden rtl-content">
        <Navbar />

        <main>
          <HeroSection />
          <div id="pricing"><PricingSection /></div>
          <div id="features"><FeaturesSection /></div>
          <OpportunitySection />
          <div id="how-it-works"><TransformationSection /></div>
          <div id="testimonials"><SocialProofSection /></div>
          <MotivationSection />
          <div id="faq"><FaqSection /></div>
          <FinalCtaSection />
        </main>

        <Footer />
      </div>

  );
}
