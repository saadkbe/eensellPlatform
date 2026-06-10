import dynamic from "next/dynamic";
import Image from "next/image";
import { HeroSection } from "@/components/landing/HeroSection";
import { Navbar } from "@/components/landing/Navbar";

// Dynamically import below-the-fold sections
const PricingSection = dynamic(() => import("@/components/landing/PricingSection").then(mod => mod.PricingSection));
const FeaturesSection = dynamic(() => import("@/components/landing/FeaturesSection").then(mod => mod.FeaturesSection));
const OpportunitySection = dynamic(() => import("@/components/landing/OpportunitySection").then(mod => mod.OpportunitySection));
const TransformationSection = dynamic(() => import("@/components/landing/TransformationSection").then(mod => mod.TransformationSection));
const SocialProofSection = dynamic(() => import("@/components/landing/SocialProofSection").then(mod => mod.SocialProofSection));
const MotivationSection = dynamic(() => import("@/components/landing/MotivationSection").then(mod => mod.MotivationSection));
const FaqSection = dynamic(() => import("@/components/landing/FaqSection").then(mod => mod.FaqSection));
const FinalCtaSection = dynamic(() => import("@/components/landing/FinalCtaSection").then(mod => mod.FinalCtaSection));

export default function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic relative overflow-x-hidden selection:bg-brand/30 selection:text-brand-light text-right">
      {/* Sticky Glassmorphic Navbar */}
      <Navbar />

      <main>
        {/* 1. Hero — Hook them */}
        <HeroSection />
        {/* 2. Pricing — Convert immediately */}
        <PricingSection />
        {/* 3. Features — Show value */}
        <FeaturesSection />
        {/* 4. Opportunity — Paint the picture */}
        <OpportunitySection />
        {/* 5. Transformation — Before/After */}
        <TransformationSection />
        {/* 6. Social Proof — Validate */}
        <SocialProofSection />
        {/* 7. Motivation — Inspire action */}
        <MotivationSection />
        {/* 8. FAQ — Answer objections */}
        <FaqSection />
        {/* 9. Final CTA — Close the deal */}
        <FinalCtaSection />
      </main>
      
      {/* Premium Footer */}
      <footer className="relative py-12 bg-foreground text-center overflow-hidden">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
        
        <div className="container max-w-5xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            <Image 
              src="/logo.png" 
              alt="Eensell University" 
              width={160}
              height={48}
              className="h-12 w-auto object-contain opacity-60 invert" 
            />
            <p className="text-background/40 text-sm font-medium">
              © {new Date().getFullYear()} Eensell University. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
