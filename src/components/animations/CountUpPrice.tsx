"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "framer-motion";

interface CountUpPriceProps {
  target: number;
  duration?: number;
  className?: string;
}

export function CountUpPrice({ target, duration = 1.5, className = "" }: CountUpPriceProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const startedRef = useRef(false);

  const animate = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (isInView) animate();
  }, [isInView, animate]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
