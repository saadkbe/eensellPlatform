"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children?: ReactNode;
  animation?: "fade" | "slide-up" | "slide-right" | "slide-left" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function ScrollReveal({
  children,
  animation = "slide-up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
  ...props
}: ScrollRevealProps) {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { delay, duration } },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { delay, duration, ease: "easeOut" } },
    },
    "slide-right": {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0, transition: { delay, duration, ease: "easeOut" } },
    },
    "slide-left": {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0, transition: { delay, duration, ease: "easeOut" } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { delay, duration, ease: "easeOut" } },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={variants[animation]}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
