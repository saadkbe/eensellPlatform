"use client";

import { CHALLENGE_TESTIMONIALS } from "@/data/challenge-testimonials";
import { SectionHeading, cardSurface } from "./primitives";
import { Play } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="feedback" className="relative px-5 py-20 sm:px-6 sm:py-28 border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Tajarib dyal drari m3ana"
          title={
            <>
              Sme3 chno galo <span className="text-[#D6A15D]">talamid dyal Eensell University.</span>
            </>
          }
          intro="Mu7adathat 1-on-1 bla zwaq m3a drari li bdaw l'programme w dkhlo l'tatbiq l'3amali."
        />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {CHALLENGE_TESTIMONIALS.map((t, idx) => (
            <div
              key={t.id}
              className={`${cardSurface} overflow-hidden p-3 sm:p-4 flex flex-col group transition-all duration-300 hover:border-[#D6A15D]/40`}
            >
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                <video
                  src={t.video}
                  controls
                  preload="metadata"
                  playsInline
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4 flex items-center justify-between text-xs text-[#A7AFBE]">
                <span className="font-semibold text-[#F7F8FA]">
                  Feedback Talib #{idx + 1}
                </span>
                <span>Modda: ~{t.durationSeconds}s</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-[#A7AFBE]">
            * Hado vidéos 7a9i9iya mn talamid m3ana f l'groupe. Makayn ta chi chiffre aw téchniya mzewra.
          </p>
        </div>
      </div>
    </section>
  );
}
