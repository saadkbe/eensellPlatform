"use client";

import { SignOutButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Clock, LogOut, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 bg-primary" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-lg w-full text-center"
      >
        {/* Shield icon with glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto mb-8 relative"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-card border border-border flex items-center justify-center glow-blue">
            <Shield className="w-9 h-9 text-primary" />
          </div>
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 m-auto w-20 h-20 rounded-2xl border border-primary/30"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight"
        >
          Account Under Verification
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed"
        >
          Your account is currently under verification. You will receive an
          email once approved.
        </motion.p>

        {/* Status card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-card/60 border border-border rounded-xl p-6 mb-8 backdrop-blur-sm"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Review in Progress
                </p>
                <p className="text-xs text-muted-foreground">
                  Our team is reviewing your application
                </p>
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Email Notification
                </p>
                <p className="text-xs text-muted-foreground">
                  You&apos;ll be notified once your account is approved
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign out button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <SignOutButton>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </SignOutButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
