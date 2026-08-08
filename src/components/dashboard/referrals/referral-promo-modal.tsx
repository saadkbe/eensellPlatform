"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function ReferralPromoModal() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("referral_promo_seen");
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("referral_promo_seen", "true");
  };

  const handleCTA = () => {
    handleClose();
    router.push("/dashboard/referrals");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background/80 backdrop-blur-xl border-orange-500/30 shadow-2xl shadow-orange-500/10 rounded-2xl">
        <div className="relative">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-background to-orange-900/10 z-0"></div>
          
          {/* Glowing Orb */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/30 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 p-8 flex flex-col items-center text-center">
            {/* Icon Container */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-[2px] mb-6 shadow-xl shadow-orange-500/20"
            >
              <div className="w-full h-full rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center">
                <Gift className="w-10 h-10 text-orange-500 drop-shadow-md" />
              </div>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-extrabold tracking-tight mb-2"
            >
              Get Paid to Learn! 💰
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm mb-8 leading-relaxed"
            >
              We just launched our new <span className="font-semibold text-foreground">Refer & Earn</span> program. 
              Share your unique link and earn <span className="font-bold text-orange-500">50 MAD</span> for every friend who joins Eensell University.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full space-y-3"
            >
              <Button 
                onClick={handleCTA} 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 h-12 text-md rounded-xl font-semibold group"
              >
                Get My Referral Link
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={handleClose} 
                variant="ghost" 
                className="w-full hover:bg-muted/50 h-10 text-muted-foreground"
              >
                Maybe Later
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
