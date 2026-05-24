import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/HeroSection";
import { OpportunitySection } from "@/components/landing/OpportunitySection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TransformationSection } from "@/components/landing/TransformationSection";
import { MotivationSection } from "@/components/landing/MotivationSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";

export default function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-background font-arabic relative overflow-x-hidden selection:bg-brand/30 selection:text-brand-light text-right">
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center">
          <img src="/logo.png" alt="Eensell University" className="h-20 w-auto object-contain origin-right scale-[1.5]" />
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl font-bold">
              تسجيل الدخول
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-brand hover:bg-brand-hover text-white rounded-xl shadow-lg font-bold">
              ابدأ الآن
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        <HeroSection />
        <OpportunitySection />
        <FeaturesSection />
        <TransformationSection />
        <MotivationSection />
        <SocialProofSection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      
      {/* Footer */}
      <footer className="py-8 bg-foreground text-center border-t border-white/10">
        <p className="text-background/50 text-sm font-medium">
          © {new Date().getFullYear()} Eensell University. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}
