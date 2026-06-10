"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 sm:px-12 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Eensell University"
              width={200}
              height={80}
              priority={true}
              className="h-16 sm:h-20 w-auto object-contain origin-right scale-[1.3]"
            />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl font-bold hidden sm:inline-flex"
            >
              تسجيل الدخول
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-brand hover:bg-brand-hover text-white rounded-xl shadow-lg font-bold px-6 relative overflow-hidden group">
              <span className="relative z-10">ابدأ الآن</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-hover to-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
