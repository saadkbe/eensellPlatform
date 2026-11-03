import React from "react";

export function TargetRadarSticker({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="24" cy="24" r="14" className="stroke-slate-300 dark:stroke-white/20" strokeWidth="2" />
      <circle cx="24" cy="24" r="8" className="stroke-emerald-500/40 fill-emerald-500/10" strokeWidth="2" />
      <circle cx="24" cy="24" r="3" className="fill-emerald-500" />
      <line x1="24" y1="4" x2="24" y2="44" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1.5" />
      <line x1="4" y1="24" x2="44" y2="24" className="stroke-slate-200 dark:stroke-white/10" strokeWidth="1.5" />
    </svg>
  );
}

export function GlowingPulseSticker({ className = "w-5 h-5", color = "#10B981" }: { className?: string; color?: string }) {
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2 shadow-xs"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

export function VerifiedCheckBadge({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L14.7 4.1L18 3.8L19.2 6.9L22.2 8.5L21.7 11.9L23.2 14.9L21.1 17.5L20.9 20.8L17.6 21.3L15.3 23.7L12 22.8L8.7 23.7L6.4 21.3L3.1 20.8L2.9 17.5L0.8 14.9L2.3 11.9L1.8 8.5L4.8 6.9L6 3.8L9.3 4.1L12 2Z"
        className="fill-slate-900 dark:fill-white"
      />
      <path
        d="M8.5 12.2L10.8 14.5L15.8 9.5"
        className="stroke-white dark:stroke-slate-950"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkleGeometricSticker({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
        className="fill-slate-900 dark:fill-white"
      />
      <circle cx="19" cy="4" r="1.5" className="fill-emerald-500" />
      <circle cx="5" cy="19" r="1.5" className="fill-blue-500" />
    </svg>
  );
}

export function RocketLaunchSticker({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 3C16 3 23 8 23 18L16 23L9 18C9 8 16 3 16 3Z"
        className="fill-slate-900 dark:fill-white"
      />
      <circle cx="16" cy="12" r="2.5" className="fill-white dark:fill-slate-950" />
      <path
        d="M9 18L5 21V25L10 23L9 18Z"
        className="fill-slate-400 dark:fill-slate-500"
      />
      <path
        d="M23 18L27 21V25L22 23L23 18Z"
        className="fill-slate-400 dark:fill-slate-500"
      />
      <path
        d="M13 23L16 29L19 23H13Z"
        className="fill-emerald-500"
      />
    </svg>
  );
}

export function LightningZapSticker({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        className="fill-amber-500 dark:fill-amber-400"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldSecureSticker({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L4 5V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5L12 2Z"
        className="fill-slate-900/10 dark:fill-white/10 stroke-slate-900 dark:stroke-white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        className="stroke-emerald-500"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChatBubbleSticker({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
        className="fill-emerald-500/15 stroke-emerald-600 dark:stroke-emerald-400"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="11.5" r="1" className="fill-emerald-600 dark:fill-emerald-400" />
      <circle cx="12" cy="11.5" r="1" className="fill-emerald-600 dark:fill-emerald-400" />
      <circle cx="15.5" cy="11.5" r="1" className="fill-emerald-600 dark:fill-emerald-400" />
    </svg>
  );
}
