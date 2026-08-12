import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/landing/v2/HeroSection";
import { Navbar } from "@/components/landing/v2/Navbar";
import { UgcSection } from "@/components/landing/v2/UgcSection";

import { ProofSection } from "@/components/landing/v2/ProofSection";
import { ProblemSection } from "@/components/landing/v2/ProblemSection";
import { DemandSection } from "@/components/landing/v2/DemandSection";
import { CommunitySection } from "@/components/landing/v2/CommunitySection";
import { BlueprintSection } from "@/components/landing/v2/BlueprintSection";
import { ArsenalSection } from "@/components/landing/v2/ArsenalSection";
import { TestimonialsSection } from "@/components/landing/v2/TestimonialsSection";
import { UrgencySection } from "@/components/landing/v2/UrgencySection";
import { FaqSection } from "@/components/landing/v2/FaqSection";

export const metadata: Metadata = {
  title: "60-Day AI Automation Challenge | Eensell University",
  description:
    "Copy the exact automation blueprint to build AI receptionists and charge local businesses 4,000 MAD per setup. Join the 60-Day Challenge for 200 MAD.",
  openGraph: {
    title: "60-Day AI Automation Challenge | Eensell University",
    description:
      "Stop consuming tutorials. Build AI automation systems and get paid. 60-day blueprint, live calls, plug-and-play workflows.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "60-Day AI Automation Challenge | Eensell University",
    description:
      "Stop consuming tutorials. Build AI automation systems and get paid.",
  },
};

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden max-w-full">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <ArsenalSection />
        <DemandSection />
        <BlueprintSection />
        <UgcSection />
        <CommunitySection />
        <ProofSection />
        <TestimonialsSection />
        <FaqSection />
        <UrgencySection />
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-[#262626] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="relative w-80 h-24 overflow-hidden flex items-center justify-center -ml-6 -my-4">
              <Image 
                src="/logo2.png" 
                alt="Eensell Logo" 
                fill 
                className="object-contain scale-[3]" 
              />
            </Link>
            <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} Eensell University. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="/terms" className="hover:text-zinc-300 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="/refund" className="hover:text-zinc-300 transition-colors">Refund</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
