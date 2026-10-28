import Link from "next/link";
import { Metadata } from "next";
import { 
  Building2, User, CreditCard, Hash, Globe, FileCode2,
  Check, Copy, Sparkles, ShieldCheck, Zap, Video, ArrowRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UpgradePaymentClient } from "./upgrade-payment-client";

export const metadata: Metadata = {
  title: "Complete Payment | Upgrade to Eensell University V2 (499 MAD)",
  description: "Official payment details for upgrading to Eensell University V2. CIH Bank, Wafacash, and Cash Plus instructions.",
};

export default function UpgradePaymentPage() {
  return <UpgradePaymentClient />;
}
