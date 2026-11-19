import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Cairo, Caveat, Aref_Ruqaa } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-arabic",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwritten",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic-hand",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.eensell.com"),
  title: {
    default: "Eensell University | Premium Education Platform",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Eensell University",
    title: "Eensell University | Premium Education Platform",
    description:
      "Premium AI-powered education platform for mastering modern skills.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Eensell University Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eensell University | Premium Education Platform",
    description:
      "Premium AI-powered education platform for mastering modern skills.",
    images: ["/icon-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

import { ThemeProvider } from "@/components/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ActivityTracker } from "@/components/activity-tracker";
import { LanguageProvider } from "@/components/landing/LanguageProvider";

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
            "bg-black hover:bg-black/90 text-white shadow-none",
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
      <html lang="en" className="scroll-smooth" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://flagcdn.com" />
          <link rel="dns-prefetch" href="https://flagcdn.com" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "Eensell University",
                "url": "https://eensell.com",
                "logo": "https://eensell.com/icon-512.png",
                "description":
                  "Premium AI-powered education platform for Moroccan & international entrepreneurs.",
              }),
            }}
          />
        </head>
        <body className={`${inter.variable} ${cairo.variable} ${caveat.variable} ${arefRuqaa.variable} font-sans antialiased`}>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <ActivityTracker />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <LanguageProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </LanguageProvider>
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
