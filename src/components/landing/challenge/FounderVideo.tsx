"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Sparkles } from "lucide-react";
import { CHALLENGE_OFFER } from "@/data/challenge-offer";
import { focusRing } from "./primitives";
import { OpenAILogo, ClaudeLogo } from "./AiIcons";

const { bunnyEmbedUrl } = CHALLENGE_OFFER.founderVideo;

/**
 * Premium Studio-style YouTube VSL Thumbnail Facade:
 * - Real high-res studio portrait of the founder
 * - Large cinematic typography embedded in the background (AI BIZ // 60 DAYS)
 * - Floating glassmorphic Claude, OpenAI, and Make.com badges
 * - High-contrast amber/blue studio rim lighting and lens glows
 * - Click-to-play Bunny.net video embed
 */
export function FounderVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[22px] bg-[#05080D] ring-1 ring-white/10 sm:rounded-[28px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)]">
      {playing ? (
        <iframe
          src={bunnyEmbedUrl}
          title="Video dyal Saad 3la Challenge dyal 60 youm"
          loading="lazy"
          style={{ border: 0 }}
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          data-cta="hero-video-play"
          aria-label="Chghel l video: Saad kayfesser lik Challenge dyal 60 youm"
          className={`group absolute inset-0 h-full w-full cursor-pointer overflow-hidden ${focusRing} focus-visible:ring-inset focus-visible:ring-offset-0`}
        >
          {/* Base Background: Deep studio atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#05080D] via-[#090D17] to-[#0D1527]" />

          {/* Environmental Glows in Thumbnail */}
          <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-[#D6A15D]/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 -right-10 h-72 w-72 rounded-full bg-[#477CFF]/25 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 h-52 w-80 rounded-full bg-[#D6A15D]/15 blur-3xl pointer-events-none" />

          {/* Real Founder Studio Image with lighting integration */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/confident_thumbnail.jpg"
              alt="Saad Kaabouche — Eensell University Founder"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover object-center transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
            />
          </div>

          {/* LARGE 3D STUDIO TEXT IN THE BACKGROUND (Overlay on photo) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 select-none pointer-events-none overflow-hidden z-10"
          >
            <div className="flex justify-between items-start">
              <span className="font-black text-6xl sm:text-8xl md:text-9xl uppercase tracking-tighter text-white/[0.08] drop-shadow-2xl leading-none">
                AI BIZ
              </span>
              <span className="font-mono text-xs sm:text-sm tracking-widest text-[#D6A15D]/70 uppercase font-extrabold bg-black/40 px-3 py-1 rounded-full border border-[#D6A15D]/30 backdrop-blur-sm">
                EENSELL // 2026
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-black text-5xl sm:text-7xl md:text-8xl uppercase tracking-tighter text-white/[0.08] drop-shadow-2xl leading-none">
                60 DAYS
              </span>
              <span className="font-black text-2xl sm:text-4xl md:text-5xl text-emerald-400/20 tracking-tight">
                4,000 DH
              </span>
            </div>
          </div>

          {/* Floating Badge: OpenAI */}
          <div className="absolute top-[22%] left-[6%] z-20 hidden sm:flex items-center gap-2 rounded-2xl bg-black/70 border border-white/20 px-3.5 py-2 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-transform duration-500 motion-safe:group-hover:-translate-y-1.5">
            <div className="h-7 w-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <OpenAILogo className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">OpenAI</span>
          </div>

          {/* Floating Badge: Claude */}
          <div className="absolute top-[28%] right-[6%] z-20 hidden sm:flex items-center gap-2 rounded-2xl bg-black/70 border border-white/20 px-3.5 py-2 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-transform duration-500 motion-safe:group-hover:-translate-y-1.5">
            <div className="h-7 w-7 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <ClaudeLogo className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide">Claude 3.5</span>
          </div>

          {/* Floating Badge: Make.com / Automation */}
          <div className="absolute bottom-[24%] left-[6%] z-20 hidden sm:flex items-center gap-2 rounded-2xl bg-black/70 border border-white/20 px-3.5 py-2 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-transform duration-500 motion-safe:group-hover:translate-y-1.5">
            <div className="h-7 w-7 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-black text-xs">
              M
            </div>
            <span className="text-xs font-bold text-white tracking-wide">Make.com</span>
          </div>

          {/* Studio lighting gradient overlays (blend portrait with floating graphics) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05080D] via-transparent to-[#05080D]/40 z-10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,8,13,0.7)_100%)] z-10"
          />

          {/* Bold YouTube-Style Thumbnail Text Pill */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-xl bg-black/75 border border-white/20 px-3 py-1.5 backdrop-blur-md shadow-lg">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              MASTERCLASS 60 YOUM
            </span>
          </div>

          {/* Value Badge: 4,000 DH Client Blueprint */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-xl bg-[#D6A15D]/20 border border-[#D6A15D]/40 px-3 py-1.5 backdrop-blur-md shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-[#D6A15D]" />
            <span className="text-xs font-black text-[#D6A15D] tracking-wide">
              DE 0DH A 4,000DH
            </span>
          </div>

          {/* Prominent Center Play Button with ambient pulse */}
          <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            {/* Ambient outer glow */}
            <span
              aria-hidden="true"
              className="absolute h-28 w-28 rounded-full bg-[#D6A15D]/30 blur-2xl transition-all duration-300 motion-safe:group-hover:scale-125"
            />
            {/* Inner button */}
            <span className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-white/40 bg-black/60 shadow-[0_10px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 motion-safe:group-hover:scale-110 motion-safe:group-hover:bg-[#D6A15D] motion-safe:group-hover:border-[#D6A15D]">
              <Play
                aria-hidden="true"
                className="ml-1 h-7 w-7 sm:h-8 sm:w-8 fill-white text-white transition-colors duration-300 motion-safe:group-hover:fill-black motion-safe:group-hover:text-black"
              />
            </span>
          </div>

          {/* Bottom video caption bar */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-3 text-left sm:bottom-6 sm:left-6 sm:right-6">
            <div className="bg-black/75 backdrop-blur-md rounded-2xl border border-white/10 px-4 py-2.5 shadow-lg">
              <span className="block text-xs sm:text-sm font-bold text-white">
                Chouf l&apos;Vidéos 9bel ma tbda
              </span>
              <span className="block text-[11px] sm:text-xs text-[#D6A15D] font-medium">
                Saad kaychra7 lik l&apos;plan kamil bach tjib awel client
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/80 bg-black/75 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              HD 1080p
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
