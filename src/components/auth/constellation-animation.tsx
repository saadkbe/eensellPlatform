"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  MessageSquare,
  Sparkles,
  Layers,
  FileText,
  Video,
  Users,
  Key,
} from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  x: number;
  y: number;
  color: string;
  borderColor: string;
  bgColor: string;
  glowColor: string;
  floatDelay: number;
  floatDuration: number;
}

const NODES: NodeData[] = [
  {
    id: "maps",
    name: "Maps Radar",
    subtitle: "Lead Scraping",
    icon: MapPin,
    x: 220,
    y: 55,
    color: "#34D399", // emerald-400
    borderColor: "border-emerald-500/50 hover:border-emerald-400",
    bgColor: "bg-emerald-500/10",
    glowColor: "rgba(52, 211, 153, 0.4)",
    floatDelay: 0,
    floatDuration: 3.8,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Engine",
    subtitle: "Darija Pitches",
    icon: MessageSquare,
    x: 340,
    y: 95,
    color: "#25D366", // whatsapp green
    borderColor: "border-[#25D366]/50 hover:border-[#25D366]",
    bgColor: "bg-[#25D366]/10",
    glowColor: "rgba(37, 211, 102, 0.4)",
    floatDelay: 0.6,
    floatDuration: 4.2,
  },
  {
    id: "gpt4o",
    name: "GPT-4o AI",
    subtitle: "Auto Drafter",
    icon: Sparkles,
    x: 385,
    y: 200,
    color: "#C084FC", // purple-400
    borderColor: "border-purple-500/50 hover:border-purple-400",
    bgColor: "bg-purple-500/10",
    glowColor: "rgba(192, 132, 252, 0.4)",
    floatDelay: 1.2,
    floatDuration: 3.5,
  },
  {
    id: "crm",
    name: "Moroccan CRM",
    subtitle: "Pipeline OS",
    icon: Layers,
    x: 340,
    y: 305,
    color: "#60A5FA", // blue-400
    borderColor: "border-blue-500/50 hover:border-blue-400",
    bgColor: "bg-blue-500/10",
    glowColor: "rgba(96, 165, 250, 0.4)",
    floatDelay: 0.3,
    floatDuration: 4.5,
  },
  {
    id: "devis",
    name: "Devis & MAD",
    subtitle: "Client Invoicing",
    icon: FileText,
    x: 220,
    y: 345,
    color: "#FBBF24", // amber-400
    borderColor: "border-amber-500/50 hover:border-amber-400",
    bgColor: "bg-amber-500/10",
    glowColor: "rgba(251, 191, 36, 0.4)",
    floatDelay: 1.5,
    floatDuration: 3.9,
  },
  {
    id: "calls",
    name: "Live Rooms",
    subtitle: "Deal Closing",
    icon: Video,
    x: 100,
    y: 305,
    color: "#818CF8", // indigo-400
    borderColor: "border-indigo-500/50 hover:border-indigo-400",
    bgColor: "bg-indigo-500/10",
    glowColor: "rgba(129, 140, 248, 0.4)",
    floatDelay: 0.9,
    floatDuration: 4.1,
  },
  {
    id: "community",
    name: "350+ Founders",
    subtitle: "Mastermind",
    icon: Users,
    x: 55,
    y: 200,
    color: "#FB7185", // rose-400
    borderColor: "border-rose-500/50 hover:border-rose-400",
    bgColor: "bg-rose-500/10",
    glowColor: "rgba(251, 113, 133, 0.4)",
    floatDelay: 0.4,
    floatDuration: 3.7,
  },
  {
    id: "keys",
    name: "BYO API Keys",
    subtitle: "Zero Markup",
    icon: Key,
    x: 100,
    y: 95,
    color: "#FDE047", // yellow-300
    borderColor: "border-yellow-500/50 hover:border-yellow-400",
    bgColor: "bg-yellow-500/10",
    glowColor: "rgba(253, 224, 71, 0.4)",
    floatDelay: 1.1,
    floatDuration: 4.3,
  },
];

const CENTER_X = 220;
const CENTER_Y = 200;

export function ConstellationAnimation() {
  return (
    <div className="relative w-full max-w-[480px] h-[420px] flex items-center justify-center select-none">
      {/* ── Ambient Radial Glows behind constellation ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-72 h-72 rounded-full bg-gradient-to-tr from-indigo-500/30 via-emerald-500/20 to-cyan-500/30 blur-[80px]"
        />
      </div>

      {/* ── SVG Layer: Dynamic Pulsing Connector Lines & Particle Packets ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 440 400"
        fill="none"
      >
        <defs>
          <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbit Guideline Circle (Subtle tech aesthetic) */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={145}
          stroke="#1E293B"
          strokeWidth="1"
          strokeDasharray="6 8"
          className="opacity-60"
        />
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={95}
          stroke="#1E293B"
          strokeWidth="1"
          strokeDasharray="4 6"
          className="opacity-40"
        />

        {/* Radiating Connector Lines from Core to Satellite Nodes */}
        {NODES.map((node) => (
          <g key={`line-${node.id}`}>
            {/* Background dashed line */}
            <line
              x1={CENTER_X}
              y1={CENTER_Y}
              x2={node.x}
              y2={node.y}
              stroke="#334155"
              strokeWidth="1.5"
              strokeDasharray="4 5"
              strokeOpacity="0.75"
            />

            {/* Glowing animated pulse packet traveling along line */}
            <motion.circle
              r="2.5"
              fill={node.color}
              initial={{ cx: CENTER_X, cy: CENTER_Y, opacity: 0 }}
              animate={{
                cx: [CENTER_X, node.x, CENTER_X],
                cy: [CENTER_Y, node.y, CENTER_Y],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: node.floatDuration,
                repeat: Infinity,
                delay: node.floatDelay,
                ease: "easeInOut",
              }}
              style={{ filter: `drop-shadow(0 0 4px ${node.glowColor})` }}
            />
          </g>
        ))}
      </svg>

      {/* ── Central Core Hub: Eensell Official Logo ── */}
      <div
        className="absolute z-20 flex flex-col items-center"
        style={{
          left: `${CENTER_X}px`,
          top: `${CENTER_Y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Pulsing Core Rings */}
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute -inset-3 rounded-2xl border border-emerald-500/40 pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.7, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0.6,
            ease: "easeOut",
          }}
          className="absolute -inset-6 rounded-3xl border border-emerald-400/20 pointer-events-none"
        />

        {/* Central Hub Card */}
        <motion.div
          whileHover={{ scale: 1.08 }}
          className="relative w-18 h-18 rounded-2xl bg-[#0B0F19] border-2 border-emerald-500/80 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.35)] cursor-pointer backdrop-blur-xl group transition-colors"
        >
          <Image
            src="/logo2-cropped.png"
            alt="Eensell OS"
            width={376}
            height={106}
            priority
            className="h-6 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform"
          />
        </motion.div>

        {/* Label Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)] flex items-center gap-1.5 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Eensell OS Hub</span>
        </motion.div>
      </div>

      {/* ── 8 Floating Satellite Nodes ── */}
      {NODES.map((node) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.id}
            animate={{
              y: [0, -6, 0, 6, 0],
            }}
            transition={{
              duration: node.floatDuration,
              repeat: Infinity,
              delay: node.floatDelay,
              ease: "easeInOut",
            }}
            className="absolute z-10 flex flex-col items-center group cursor-pointer"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Satellite Icon Container */}
            <div
              className={`w-11 h-11 rounded-xl bg-[#0D1220]/90 border ${node.borderColor} shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-115 group-hover:shadow-[0_0_20px_${node.glowColor}] backdrop-blur-md`}
              style={{
                boxShadow: `0 8px 24px -4px rgba(0,0,0,0.6)`,
              }}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: node.color }} />
            </div>

            {/* Satellite Text Label */}
            <div className="mt-1.5 flex flex-col items-center pointer-events-none">
              <span className="text-[10px] font-bold text-slate-200 bg-[#0B0F19]/90 px-2 py-0.5 rounded-md border border-slate-800 shadow-sm whitespace-nowrap transition-colors group-hover:text-white group-hover:border-slate-700">
                {node.name}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
