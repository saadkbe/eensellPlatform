"use client";

import { SignIn } from "@clerk/nextjs";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

export default function SignInPage() {
  return (
    <AuthSplitLayout mode="sign-in">
      <SignIn
        fallbackRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#09090b",
            colorText: "#09090b",
            colorTextSecondary: "#64748b",
            colorBackground: "#ffffff",
            colorInputBackground: "#ffffff",
            colorInputText: "#09090b",
            borderRadius: "0.75rem",
            fontFamily: "inherit",
          },
          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none border-0 p-0",
            card: "w-full bg-transparent shadow-none border-0 p-0",
            header: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            logoBox: "hidden",
            footer: "bg-transparent",
            footerAction: "flex items-center justify-center mt-5 text-xs text-slate-500",
            footerActionLink: "text-slate-950 font-bold hover:underline ml-1",
            formFieldInput:
              "w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-2 px-3 text-xs focus:border-slate-950 focus:ring-1 focus:ring-slate-950 transition-all shadow-2xs placeholder:text-slate-400",
            formFieldLabel: "text-slate-700 font-semibold text-xs mb-1",
            formButtonPrimary:
              "w-full bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl py-2.5 text-xs shadow-sm transition-all cursor-pointer mt-2",
            socialButtonsBlockButton:
              "w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl py-2.5 px-3 justify-center shadow-2xs transition-all text-xs flex items-center gap-2",
            socialButtonsBlockButtonText: "font-semibold text-xs text-slate-800",
            dividerRow: "my-4",
            dividerLine: "bg-slate-200",
            dividerText: "text-slate-400 text-[10px] font-bold uppercase tracking-wider bg-white px-2",
            formFieldRow: "mb-3",
            formFieldAction: "text-xs text-slate-500 hover:text-slate-900 font-medium",
            identityPreview: "rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs",
          },
        }}
      />
    </AuthSplitLayout>
  );
}
