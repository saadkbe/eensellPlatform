import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { CHALLENGE_OFFER } from "@/data/challenge-offer";

/* Shared visual primitives for the /60dayschallenge sales page.
   Palette: bg #05080D · panel #0A0D14 · text #F7F8FA · muted #A7AFBE
   amber #D6A15D · blue #477CFF */

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6A15D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05080D]";

type CtaProps = {
  /** Identifier for funnel analytics (data-cta attribute). */
  trackingId: string;
  children: ReactNode;
  size?: "md" | "lg";
  className?: string;
};

/** The single dominant CTA. Always routes into the verified enrollment flow. */
export function EnrollButton({ trackingId, children, size = "lg", className = "" }: CtaProps) {
  const sizing = size === "lg" ? "h-14 px-8 text-base sm:text-[17px]" : "h-11 px-5 text-sm";
  return (
    <Link
      href={CHALLENGE_OFFER.enrollHref}
      data-cta={trackingId}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-[#F7F8FA] font-semibold text-[#05080D] shadow-[0_10px_40px_-10px_rgba(214,161,93,0.55)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-white hover:shadow-[0_14px_50px_-10px_rgba(214,161,93,0.75)] motion-safe:active:scale-[0.98] ${sizing} ${focusRing} ${className}`}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export function Eyebrow({ children, tone = "amber" }: { children: ReactNode; tone?: "amber" | "blue" }) {
  const color = tone === "amber" ? "text-[#D6A15D]" : "text-[#8AA8FF]";
  return (
    <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.22em] ${color}`}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  id,
  tone,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  id?: string;
  tone?: "amber" | "blue";
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-[#F7F8FA] sm:text-[42px]"
      >
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 text-pretty text-base leading-relaxed text-[#A7AFBE] sm:text-lg">{intro}</p>
      ) : null}
    </div>
  );
}

/** Low-contrast bordered surface used for cards. */
export const cardSurface =
  "rounded-3xl border border-white/[0.07] bg-[#0A0D14] shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]";
