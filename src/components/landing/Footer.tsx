import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative py-14 sm:py-20 bg-white border-t border-slate-200/80 text-slate-600">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-100">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo2.png"
                alt="Eensell University"
                width={200}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm text-center md:text-left leading-relaxed">
              The premier autonomous AI agency workspace & ecosystem for Moroccan entrepreneurs and agency founders.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm font-semibold text-slate-700">
            <a href="#vsl" className="hover:text-slate-950 transition-colors">12-Min VSL</a>
            <a href="#features" className="hover:text-slate-950 transition-colors">Workspace Tools</a>
            <a href="#how-it-works" className="hover:text-slate-950 transition-colors">Process</a>
            <a href="#pricing" className="hover:text-slate-950 transition-colors">Pricing</a>
            <Link href="/terms" className="hover:text-slate-950 transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="hover:text-slate-950 transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-slate-950 transition-colors">Contact</Link>
          </div>
        </div>

        {/* Bottom copyright & contact */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Eensell University. All rights reserved. Casablanca, Morocco.</p>

          <div className="flex items-center gap-4">
            <span>Direct support: <a href="mailto:contact@eensell.com" className="font-semibold text-slate-700 hover:text-slate-950 transition-colors">contact@eensell.com</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
