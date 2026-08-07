"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepWelcomeProps {
  firstName: string;
  challengeStartDate: Date | null;
  challengeDuration?: number;
  onNext: () => void;
}

export function StepWelcome({
  firstName,
  challengeStartDate,
  challengeDuration = 60,
  onNext,
}: StepWelcomeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ["#FFD700", "#9333EA", "#06B6D4"]; // Gold, Purple, Cyan

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.05; // Gravity

        // Wobble
        p.x += Math.sin(p.rotation * 0.05);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.y > canvas.height - 100 ? Math.max(0, (canvas.height - p.y) / 100) : 1;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Reset particle if it falls off screen (loop slowly or just let it fall)
        if (p.y > canvas.height + 50) {
           p.y = -50;
           p.x = Math.random() * canvas.width;
           p.vy = Math.random() * 3 + 2;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Stop after a few seconds to prevent infinite distraction
    const timeoutId = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 8000);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  const welcomeWords = `Welcome, ${firstName}`.split(" ");
  const startDateFormatted = challengeStartDate
    ? `Started ${format(challengeStartDate, "MMMM d, yyyy")}`
    : "Starting today";

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-background onboarding-bg overflow-hidden text-foreground">
      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      <div className="relative z-20 flex flex-col items-center text-center max-w-3xl w-full">
        {/* Challenge Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative group rounded-full p-[1px] bg-gradient-to-r from-purple-500/50 via-cyan-500/50 to-purple-500/50">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
            <div className="relative px-6 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4] animate-pulse" />
              <span className="text-sm font-medium tracking-wide text-zinc-200">
                {challengeDuration}-Day Challenge
              </span>
            </div>
          </div>
        </motion.div>

        {/* Animated Greeting */}
        <div className="flex flex-wrap justify-center gap-x-4 mb-4">
          {welcomeWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.15,
                ease: [0.2, 0.65, 0.3, 0.9],
              }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            >
              {word}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="text-lg md:text-xl text-zinc-400 mb-12 max-w-xl font-light"
        >
          You&apos;ve just entered the most exclusive AI ecosystem.
        </motion.p>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="relative flex flex-col items-center justify-center mb-16"
        >
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-zinc-800"
              />
              {/* Animated Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDasharray: "289", strokeDashoffset: "289" }}
                animate={{ strokeDashoffset: "284" }} // Small progression for Day 1
                transition={{ duration: 1.5, delay: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-sm text-zinc-400 uppercase tracking-wider font-semibold">Day</span>
              <span className="text-3xl font-bold text-white">1</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-500 font-medium">{startDateFormatted}</p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="w-full sm:w-auto"
        >
          <Button
            onClick={onNext}
            size="lg"
            className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-medium group transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Begin Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
