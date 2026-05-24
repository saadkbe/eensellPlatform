"use client";

import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden p-4">
      {/* Dark Image Background */}
      <div className="absolute inset-0 w-full h-full -z-10 bg-black">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-50 blur-md scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80 pointer-events-none" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10 flex flex-col items-center"
      >
        {/* Logo */}
        <Link href="/" className="mb-8">
          <img src="/logo.png" alt="Eensell University" className="h-16 w-auto object-contain scale-[1.5] brightness-0 invert" />
        </Link>

        {/* Motivational Slogan */}
        <div className="text-center mb-8 px-2">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create an Account</h1>
          <p className="text-white/60 text-sm italic">
            "Your future is created by what you do today, not tomorrow."
          </p>
        </div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <SignUp
            fallbackRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: "#0A0A0A",
                colorText: "#0A0A0A",
                colorTextSecondary: "#6B7280",
                colorBackground: "#FFFFFF",
                colorInputBackground: "#FFFFFF",
                colorInputText: "#0A0A0A",
                borderRadius: "1rem",
              },
              elements: {
                rootBox: "w-full",
                card: "w-full bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/20 rounded-2xl p-6 sm:p-8",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                logoBox: "hidden",
                footer: "bg-transparent",
                footerAction: "flex items-center justify-center mt-6 text-sm",
                formFieldInput: "bg-white border border-black/10 shadow-sm rounded-xl py-3 px-4 focus:ring-2 focus:ring-black/5 transition-all text-black",
                formFieldLabel: "text-[#0A0A0A] font-medium text-sm mb-1.5",
                formButtonPrimary: "bg-[#0A0A0A] hover:bg-[#222] text-white font-semibold rounded-xl py-3 mt-2 shadow-md transition-all duration-200",
                socialButtonsBlockButton: "bg-white border border-black/10 text-[#0A0A0A] rounded-xl py-3 justify-center shadow-sm hover:bg-gray-50 transition-all duration-200",
                footerActionText: "text-[#6B7280] mr-1",
                footerActionLink: "text-[#0A0A0A] font-semibold hover:underline transition-colors",
                dividerRow: "my-6",
                dividerLine: "bg-black/10",
                dividerText: "text-[#6B7280] text-xs font-medium bg-transparent px-2",
                formFieldRow: "mb-4",
              },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
