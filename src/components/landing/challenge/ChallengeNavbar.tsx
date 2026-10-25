"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { CHALLENGE_OFFER } from "@/data/challenge-offer";
import { EnrollButton, focusRing } from "./primitives";

const NAV_LINKS = [
  { label: "Roadmap", href: "#roadmap" },
  { label: "Chno kayn dakhel", href: "#platform" },
  { label: "Feedback", href: "#feedback" },
  { label: "Taman", href: "#pricing" },
  { label: "As2ila", href: "#faq" },
];

export function ChallengeNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-b border-white/[0.06] bg-[#05080D]/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Navigation l2asasiya" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link
          href="/60dayschallenge"
          aria-label="Eensell University — sf7a l2oula"
          className={`relative block h-9 w-32 overflow-hidden rounded-md ${focusRing}`}
        >
          <Image
            src="/logo2.png"
            alt=""
            fill
            sizes="128px"
            preload
            className="scale-[3.3] object-contain"
          />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`rounded text-sm text-[#A7AFBE] transition-colors hover:text-[#F7F8FA] ${focusRing}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            href={CHALLENGE_OFFER.signInHref}
            className={`rounded text-sm text-[#A7AFBE] transition-colors hover:text-[#F7F8FA] ${focusRing}`}
          >
            Dkhol l compte
          </Link>
          <EnrollButton trackingId="nav" size="md">
            Bda daba
          </EnrollButton>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="challenge-mobile-menu"
          aria-label={open ? "Sedd l menu" : "7ell l menu"}
          className={`-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#F7F8FA] md:hidden ${focusRing}`}
        >
          {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {open ? (
        <div id="challenge-mobile-menu" className="border-t border-white/[0.06] px-5 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded py-3 text-base text-[#F7F8FA]/90 ${focusRing}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <EnrollButton trackingId="nav-mobile" size="md" className="w-full">
              Bda Challenge dyalk daba
            </EnrollButton>
            <Link
              href={CHALLENGE_OFFER.signInHref}
              className={`rounded-full border border-white/10 py-2.5 text-center text-sm text-[#A7AFBE] ${focusRing}`}
            >
              3ndek compte? Dkhol hna
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
