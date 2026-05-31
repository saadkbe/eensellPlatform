import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Cairo } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: {
    default: "Eensell University — Premium Education Platform",
    template: "%s | Eensell University",
  },
  description:
    "Premium AI-powered education platform for mastering modern skills. Access exclusive masterclasses, live calls, and curated resources.",
  keywords: [
    "education",
    "online learning",
    "masterclass",
    "AI",
    "premium courses",
  ],
  authors: [{ name: "Eensell" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Eensell University",
    title: "Eensell University — Premium Education Platform",
    description:
      "Premium AI-powered education platform for mastering modern skills.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eensell University — Premium Education Platform",
    description:
      "Premium AI-powered education platform for mastering modern skills.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { ThemeProvider } from "@/components/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ActivityTracker } from "@/components/activity-tracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--card))",
          colorInputText: "hsl(var(--foreground))",
          colorText: "hsl(var(--foreground))",
          colorTextSecondary: "hsl(var(--muted-foreground))",
        },
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-primary-foreground shadow-none",
          card: "bg-white dark:bg-[#0A0A0A] border border-border shadow-xl",
          userProfileBase: "bg-white dark:bg-[#0A0A0A]",
          userButtonPopoverCard: "bg-white dark:bg-[#0A0A0A]",
          modalContent: "bg-white dark:bg-[#0A0A0A]",
          modalBackdrop: "bg-black/60 backdrop-blur-sm",
          scrollBox: "bg-white dark:bg-[#0A0A0A]",
          navbar: "bg-white dark:bg-[#0A0A0A]",
          headerTitle: "text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton:
            "bg-secondary border-border text-foreground hover:bg-secondary/80",
          formFieldInput:
            "bg-background border-border text-foreground placeholder:text-muted-foreground",
          footerActionLink: "text-primary hover:text-primary/80",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${cairo.variable} font-sans antialiased`}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ActivityTracker />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <TooltipProvider>
              {children}
            </TooltipProvider>
            <Toaster
              toastOptions={{
                style: {
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
