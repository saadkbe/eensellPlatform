"use client";

import Link from "next/link";
import Image from "next/image";
import { AuthShowcase } from "@/components/auth/auth-showcase";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}

export function AuthSplitLayout({ children, mode }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-12 bg-white text-slate-900 antialiased select-none">
      {/* ── Global Clerk Overrides to ensure 100% crisp visibility in all themes ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .cl-card,
            .cl-cardBox {
              background-color: transparent !important;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
            }
            .cl-header,
            .cl-headerTitle,
            .cl-headerSubtitle,
            .cl-logoBox,
            .cl-logoImage {
              display: none !important;
            }
            .cl-rootBox {
              width: 100% !important;
            }
            
            /* Social OAuth Buttons (Google) */
            .cl-socialButtonsBlockButton {
              background-color: #ffffff !important;
              border: 1px solid #e2e8f0 !important;
              color: #0f172a !important;
              border-radius: 0.75rem !important;
              height: 2.75rem !important;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
              transition: all 0.15s ease !important;
            }
            .cl-socialButtonsBlockButton:hover {
              background-color: #f8fafc !important;
              border-color: #cbd5e1 !important;
            }
            .cl-socialButtonsBlockButtonText,
            .cl-socialButtonsBlockButton span,
            .cl-socialButtonsBlockButton p {
              color: #0f172a !important;
              font-weight: 600 !important;
              font-size: 0.8125rem !important;
              opacity: 1 !important;
              display: inline-block !important;
            }
            
            /* Input Fields (Email, Password, Name) */
            .cl-formFieldInput {
              background-color: #ffffff !important;
              border: 1px solid #e2e8f0 !important;
              color: #0f172a !important;
              border-radius: 0.75rem !important;
              font-size: 0.8125rem !important;
              padding: 0.625rem 0.875rem !important;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03) !important;
              transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
            }
            .cl-formFieldInput:focus {
              border-color: #09090b !important;
              outline: none !important;
              box-shadow: 0 0 0 1px #09090b !important;
            }
            .cl-formFieldInput::placeholder {
              color: #94a3b8 !important;
            }
            
            /* Field Labels */
            .cl-formFieldLabel {
              color: #334155 !important;
              font-weight: 600 !important;
              font-size: 0.75rem !important;
              margin-bottom: 0.375rem !important;
            }
            
            /* Primary Submit Button ("Continue" / "Sign in") */
            .cl-formButtonPrimary {
              background-color: #09090b !important;
              border: 1px solid #09090b !important;
              color: #ffffff !important;
              font-weight: 700 !important;
              font-size: 0.8125rem !important;
              border-radius: 0.75rem !important;
              height: 2.75rem !important;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1) !important;
              cursor: pointer !important;
              transition: background-color 0.15s ease !important;
              margin-top: 0.5rem !important;
            }
            .cl-formButtonPrimary:hover {
              background-color: #18181b !important;
            }
            .cl-formButtonPrimary,
            .cl-formButtonPrimary span,
            .cl-formButtonPrimary p,
            .cl-formButtonPrimary * {
              color: #ffffff !important;
              font-weight: 700 !important;
            }
            
            /* Dividers */
            .cl-dividerRow {
              margin: 1.25rem 0 !important;
            }
            .cl-dividerLine {
              background-color: #e2e8f0 !important;
              height: 1px !important;
            }
            .cl-dividerText {
              color: #94a3b8 !important;
              background-color: #ffffff !important;
              font-size: 0.6875rem !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              padding: 0 0.5rem !important;
            }
            
            /* Footer Action Links */
            .cl-footer {
              background-color: transparent !important;
              padding: 0 !important;
            }
            .cl-footerAction {
              margin-top: 1.25rem !important;
              font-size: 0.75rem !important;
              color: #64748b !important;
            }
            .cl-footerActionText {
              color: #64748b !important;
              font-size: 0.75rem !important;
            }
            .cl-footerActionLink {
              color: #09090b !important;
              font-weight: 700 !important;
              text-decoration: underline !important;
              margin-left: 0.25rem !important;
            }
            .cl-footerActionLink:hover {
              color: #000000 !important;
            }
            
            /* Identity Preview (e.g., OTP step) */
            .cl-identityPreview {
              background-color: #f8fafc !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 0.75rem !important;
              padding: 0.5rem 0.75rem !important;
            }
            .cl-identityPreviewText,
            .cl-identityPreviewText * {
              color: #0f172a !important;
              font-size: 0.75rem !important;
              font-weight: 600 !important;
            }
            .cl-identityPreviewEditButton {
              color: #475569 !important;
              font-size: 0.75rem !important;
            }
            
            /* Alert / Error Callouts */
            .cl-alert,
            .cl-formFieldErrorText {
              color: #dc2626 !important;
              font-size: 0.75rem !important;
            }
            
            /* OTP code inputs */
            .cl-otpCodeFieldInput {
              background-color: #ffffff !important;
              border: 1px solid #cbd5e1 !important;
              color: #0f172a !important;
              border-radius: 0.5rem !important;
            }
          `,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          LEFT COLUMN: Clean Pure White Column (Auth Form)
         ══════════════════════════════════════════════════════════ */}
      <div className="md:col-span-5 lg:col-span-5 xl:col-span-5 px-6 sm:px-10 lg:px-14 xl:px-16 py-10 sm:py-14 flex flex-col justify-between bg-white relative z-10 min-h-screen border-r border-slate-100">
        <div className="w-full max-w-[390px] mx-auto my-auto flex flex-col items-center">
          {/* Official Brand Logo - Big, Crisp & Prominent */}
          <Link href="/" className="mb-7 transition-transform hover:scale-[1.03] flex items-center justify-center">
            <Image
              src="/logo2-cropped-black.png"
              alt="Eensell University"
              width={376}
              height={106}
              priority
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Form Header Title & Subtitle */}
          <div className="text-center mb-6 w-full">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mb-2">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              {mode === "sign-in"
                ? "Please sign in to access your workspace & community."
                : "Join 350+ Moroccan founders scaling AI agencies."}
            </p>
          </div>

          {/* Seamless Clerk Auth Component Container */}
          <div className="w-full select-text">{children}</div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="pt-8 text-center border-t border-slate-100 mt-6">
          <p className="text-[11px] text-slate-400 font-medium">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-slate-700 hover:text-slate-950 font-semibold underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-slate-700 hover:text-slate-950 font-semibold underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT COLUMN: Clean High-Converting Showcase Banner
          Visible on md: (768px+) and up
         ══════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex md:col-span-7 lg:col-span-7 xl:col-span-7 p-8 sm:p-10 lg:p-12 xl:p-14 bg-[#070A12] text-white flex-col justify-center relative overflow-hidden min-h-screen">
        {/* Subtle Dark Dot Grid Background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#334155 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Ambient Radiant Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-emerald-500/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-[110px] pointer-events-none" />

        {/* Clean Showcase Component */}
        <AuthShowcase />
      </div>
    </div>
  );
}
