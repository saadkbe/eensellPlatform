"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
  Phone,
  User,
  Mail,
  Target,
  Briefcase,
  Zap,
  Lock,
  Loader2,
  Building2,
  Bot,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { completeThreeStepOnboarding } from "@/actions/onboarding.actions";
import { cn } from "@/lib/utils";

interface OnboardingUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  onboardingStep: number;
  phone: string | null;
  goal: string | null;
  experienceLevel: string | null;
  weeklyHours: string | null;
  incomeGoal: string | null;
  [key: string]: any;
}

interface OnboardingClientProps {
  user: OnboardingUser;
  config?: any;
  milestones?: any;
  firstLesson?: any;
}

const GOAL_OPTIONS = [
  {
    id: "agency",
    title: "AI Automation Agency (AAA)",
    desc: "Sign local & global clients with custom automations",
    icon: Building2,
  },
  {
    id: "freelancer",
    title: "Freelance Consultant",
    desc: "Offer Make.com, CRM & AI workflows on Upwork & direct",
    icon: Briefcase,
  },
  {
    id: "automations",
    title: "AI Voice & Chat Systems",
    desc: "Build AI phone callers, scrapers & WhatsApp agents",
    icon: Bot,
  },
  {
    id: "exploring",
    title: "Explore AI Opportunities",
    desc: "Master hands-on tools and launch a tech venture",
    icon: Lightbulb,
  },
];

const INCOME_TARGETS = [
  "$1,000 – $3,000 / mo",
  "$3,000 – $5,000 / mo",
  "$5,000 – $10,000 / mo",
  "$10,000+ / mo",
];

export function OnboardingClient({ user }: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [goal, setGoal] = useState(user.goal || "agency");
  const [incomeGoal, setIncomeGoal] = useState(user.incomeGoal || "$3,000 – $5,000 / mo");

  // Step 1 Validation & Proceed
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("Please enter your first name.");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter your last name.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      toast.error("Please enter a valid WhatsApp number so we can reach you.");
      return;
    }
    setStep(2);
  };

  // Step 2 Proceed
  const handleNextStep2 = () => {
    setStep(3);
  };

  // Step 3 Final Submission
  const handleComplete = () => {
    startTransition(async () => {
      try {
        await completeThreeStepOnboarding({
          firstName,
          lastName,
          phone,
          goal,
          incomeGoal,
        });

        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#111111", "#444444", "#888888", "#F59E0B"],
        });

        toast.success("Welcome aboard! Directing to your dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } catch (err: any) {
        console.error("Onboarding error:", err);
        toast.error("Failed to complete onboarding. Please try again.");
      }
    });
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#FAFAFA] text-zinc-900 select-none flex flex-col justify-between p-4 sm:p-6 lg:p-8 antialiased selection:bg-black selection:text-white">
      {/* ── TOP BAR: BRAND + 3-STEP PROGRESS HUD ── */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs shadow-xs">
            E
          </div>
          <span className="font-bold text-sm tracking-tight text-black">
            Eensell University
          </span>
        </div>

        {/* Step Counter Text */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Step {step} of 3
          </span>
          <span className="text-[11px] font-semibold text-zinc-400">•</span>
          <span className="text-[11px] font-semibold text-zinc-900">
            {step === 1 ? "Identity & WhatsApp" : step === 2 ? "Agency Blueprint" : "Activation"}
          </span>
        </div>
      </header>

      {/* ── PROGRESS LOADING BARS ── */}
      <div className="max-w-2xl w-full mx-auto shrink-0 mt-3 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="h-1.5 rounded-full bg-zinc-200 overflow-hidden relative">
              <motion.div
                initial={false}
                animate={{
                  width: step >= s ? "100%" : "0%",
                }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="h-full bg-black rounded-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── CENTER CARD: NO-SCROLL COMPACT CONTAINER ── */}
      <main className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-center min-h-0">
        <div className="bg-white border border-zinc-200/80 rounded-2xl sm:rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* ══════════════════════════════════════════════
                STEP 1: IDENTITY, EMAIL & WHATSAPP
               ══════════════════════════════════════════════ */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    Confirm your student identity
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Your contact details are used for 1-on-1 WhatsApp mentoring, live call invitations, and graduation credentials.
                  </p>
                </div>

                <form onSubmit={handleNextStep1} className="space-y-4">
                  {/* First & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Saad"
                        className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-black placeholder:text-zinc-400 focus:bg-white focus:outline-hidden focus:border-black transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Kaabouche"
                        className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-black placeholder:text-zinc-400 focus:bg-white focus:outline-hidden focus:border-black transition-all"
                      />
                    </div>
                  </div>

                  {/* Email (Readonly) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        Account Email
                      </label>
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    </div>
                    <div className="w-full h-11 px-3.5 rounded-xl bg-zinc-100/70 border border-zinc-200/60 flex items-center justify-between text-sm font-medium text-zinc-600">
                      <span className="truncate">{user.email}</span>
                      <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    </div>
                  </div>

                  {/* WhatsApp Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Phone Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+212 6 00 00 00 00 (or 06...)"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-zinc-50 border border-zinc-200 text-sm font-semibold text-black placeholder:text-zinc-400 focus:bg-white focus:outline-hidden focus:border-black transition-all font-mono"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 flex items-center gap-1 pointer-events-none">
                        <span>WA</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Saad and the coaching team connect with you via WhatsApp for review updates.
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-black hover:bg-zinc-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Continue to Agency Goals</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════
                STEP 2: AGENCY BLUEPRINT & TARGET INCOME
               ══════════════════════════════════════════════ */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    Set your agency trajectory
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Select your core focus so we personalize your 60-day curriculum and resource vault.
                  </p>
                </div>

                {/* Primary Track Options */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-zinc-400" />
                    Primary Model
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {GOAL_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const selected = goal === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setGoal(opt.id)}
                          className={cn(
                            "p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer",
                            selected
                              ? "bg-black text-white border-black shadow-xs"
                              : "bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200 text-zinc-900"
                          )}
                        >
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                              selected ? "bg-white/15 text-white" : "bg-white border border-zinc-200 text-zinc-700"
                            )}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className={cn("text-xs font-bold leading-tight truncate", selected ? "text-white" : "text-black")}>
                              {opt.title}
                            </p>
                            <p className={cn("text-[11px] leading-snug mt-0.5 line-clamp-1", selected ? "text-zinc-300" : "text-zinc-500")}>
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Income Target */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-zinc-400" />
                    Target Monthly Revenue (60-Day Milestone)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {INCOME_TARGETS.map((tgt) => {
                      const selected = incomeGoal === tgt;
                      return (
                        <button
                          key={tgt}
                          type="button"
                          onClick={() => setIncomeGoal(tgt)}
                          className={cn(
                            "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer",
                            selected
                              ? "bg-black text-white border-black shadow-xs"
                              : "bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200 text-zinc-700"
                          )}
                        >
                          {tgt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-12 px-4 rounded-xl border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-100 font-bold text-xs gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNextStep2}
                    className="flex-1 h-12 bg-black hover:bg-zinc-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Confirm Blueprint</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ══════════════════════════════════════════════
                STEP 3: ACTIVATION & PROTOCOL LAUNCH
               ══════════════════════════════════════════════ */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold border border-emerald-500/20 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Ready for Deployment
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                    Welcome to Eensell, {firstName}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Your profile has been synchronized. All course modules, roadmap days, and community access are ready.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                  <div className="grid grid-cols-2 gap-3 pb-3 border-b border-zinc-200/70 text-xs">
                    <div>
                      <p className="text-[11px] font-semibold text-zinc-400">Student Name</p>
                      <p className="font-bold text-black">{firstName} {lastName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-zinc-400">WhatsApp Contact</p>
                      <p className="font-bold font-mono text-black">{phone}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-zinc-700">
                      <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                        ✓
                      </div>
                      <span><strong>60-Day Interactive Roadmap</strong> — Day 1 challenge unlocked</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-700">
                      <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                        ✓
                      </div>
                      <span><strong>Make.com & AI Automation Blueprints</strong> — Ready to deploy</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-700">
                      <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                        ✓
                      </div>
                      <span><strong>Direct WhatsApp Mentorship</strong> — Synced with Saad Kaabouche</span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={isPending}
                    className="h-12 px-4 rounded-xl border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-100 font-bold text-xs gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={handleComplete}
                    disabled={isPending}
                    className="flex-1 h-12 bg-black hover:bg-zinc-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Activating Your Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Eensell Academy</span>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── FOOTER: TRUST & SUPPORT ── */}
      <footer className="max-w-2xl w-full mx-auto flex items-center justify-between text-xs text-zinc-400 shrink-0 pt-3">
        <span>100% Secure • Official Eensell University Onboarding</span>
        <span>Need help? WhatsApp: +212 666 065608</span>
      </footer>
    </div>
  );
}
