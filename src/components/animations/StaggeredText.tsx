"use client";

import { motion } from "framer-motion";

interface StaggeredTextProps {
  words: { text: string; line: number }[];
  className?: string;
}

export function StaggeredText({ words, className = "" }: StaggeredTextProps) {
  return (
    <h1 className={className}>
      {[1, 2, 3].map((lineNum) => (
        <span key={lineNum} className="block">
          {words
            .filter((w) => w.line === lineNum)
            .map((word, idx) => (
              <motion.span
                key={`${lineNum}-${idx}`}
                initial={{ opacity: 0, y: 25, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + words.findIndex((w) => w === word) * 0.08,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
                className={`inline-block ${lineNum === 2 ? "text-brand" : ""}`}
              >
                {word.text}
                {idx < words.filter((w) => w.line === lineNum).length - 1 && "\u00A0"}
              </motion.span>
            ))}
        </span>
      ))}
    </h1>
  );
}
