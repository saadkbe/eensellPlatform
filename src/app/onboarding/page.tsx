"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowRight, CheckCircle2, User, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { completeOnboarding } from "@/actions/user.actions";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    goals: "",
  });

  const handleNext = () => {
    if (step === 2 && (!formData.firstName || !formData.lastName)) {
      toast.error("Please enter your name to continue");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleComplete = async () => {
    if (!formData.goals) {
      toast.error("Please select a goal");
      return;
    }
    
    setLoading(true);
    try {
      await completeOnboarding(formData);
      setStep(4);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const goals = [
    "Learn AI Automation & Engineering",
    "Scale my existing agency",
    "Start a new AI business from scratch",
    "Improve my career prospects",
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="Eensell University" className="h-24 w-auto object-contain scale-[1.5]" />
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                step >= i ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👋</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground">Welcome to the inside.</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                You're officially part of the most exclusive AI education platform. Let's set up your profile so we can personalize your experience.
              </p>
              <Button onClick={handleNext} className="w-full mt-4 gap-2" size="lg">
                Let's get started <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">What's your name?</h1>
                <p className="text-muted-foreground mt-2">
                  This is how you'll appear to other members and mentors.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">First Name</label>
                  <Input
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-12 bg-background border-border"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground ml-1">Last Name</label>
                  <Input
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-12 bg-background border-border"
                  />
                </div>
              </div>

              <Button 
                onClick={handleNext} 
                className="w-full gap-2 mt-4" 
                size="lg"
                disabled={!formData.firstName || !formData.lastName}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">What is your main goal?</h1>
                <p className="text-muted-foreground mt-2">
                  We'll tailor your dashboard to help you reach this objective faster.
                </p>
              </div>

              <div className="space-y-3">
                {goals.map((goal) => (
                  <Card
                    key={goal}
                    onClick={() => setFormData({ ...formData, goals: goal })}
                    className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                      formData.goals === goal
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30 hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">{goal}</span>
                      {formData.goals === goal && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                onClick={handleComplete}
                className="w-full gap-2 mt-4"
                size="lg"
                disabled={!formData.goals || loading}
              >
                {loading ? "Setting up..." : "Complete Setup"} 
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-12"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground">You're all set!</h1>
              <p className="text-muted-foreground">Preparing your personalized dashboard...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
