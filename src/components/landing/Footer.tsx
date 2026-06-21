import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative py-12 md:py-16 bg-black text-center flex flex-col items-center">
      <div className="container max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center gap-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Eensell University"
              width={360}
              height={80}
              className="h-20 w-auto object-contain brightness-0 invert"
            />
          </Link>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold text-zinc-400">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
          
          <div className="text-zinc-500 text-sm font-medium mt-2">
            Contact us: <a href="mailto:contact@eensell.com" className="hover:text-white transition-colors">contact@eensell.com</a>
          </div>
          
          <p className="text-zinc-600 text-sm font-medium mt-4">
            © {new Date().getFullYear()} Eensell University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
