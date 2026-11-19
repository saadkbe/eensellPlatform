"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, Download, Share2, Sparkles, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { generateCertificatePdf, downloadCertificatePdf } from "@/lib/certificate";

interface Props {
  studentName: string;
  userClerkId?: string;
  isCompleted: boolean;
  progressPercent: number;
}

export function CertificateCard({ studentName, userClerkId, isCompleted, progressPercent }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(studentName || "Student");
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate a deterministic certificate serial ID based on student ID
  const certId = `EU-2026-${(userClerkId || "student").slice(-6).toUpperCase()}`;

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      triggerCelebration();
      const blob = await generateCertificatePdf({
        studentName: name,
        certificateId: certId,
        verificationUrl: `https://www.eensell.com/verify/${certId}`,
      });
      downloadCertificatePdf(blob, name);
      toast.success("Certificate downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate certificate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLinkedInShare = () => {
    const certUrl = encodeURIComponent(`https://www.eensell.com/verify/${certId}`);
    const title = encodeURIComponent("I just earned my AI & Digital Mastery Certification from Eensell University!");
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${certUrl}&title=${title}`,
      "_blank"
    );
  };

  if (!isCompleted) {
    return (
      <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-muted/40 border border-border/60 shadow-sm relative overflow-hidden group">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Award className="w-4 h-4 text-orange-500" />
              <span>Official Certification</span>
            </div>
            <h4 className="text-base font-bold text-foreground">
              Course Completion Certificate
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete all lessons to unlock your verified credential and downloadable high-res PDF.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
            <Award className="w-6 h-6 text-orange-500/80" />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>Progress to Unlock:</span>
          <span className="font-bold text-foreground">{progressPercent}% / 100%</span>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500/10 via-card to-card border-2 border-orange-500/30 shadow-lg shadow-orange-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full" />
        
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Certificate Ready</span>
            </div>
            <h4 className="text-lg font-black text-foreground">
              Congratulations! You are Certified
            </h4>
            <p className="text-xs text-muted-foreground">
              Your official Eensell University AI & Digital Mastery credential is ready.
            </p>
          </div>

          <Button
            onClick={() => {
              triggerCelebration();
              setOpen(true);
            }}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-md shadow-orange-500/20 shrink-0 gap-2"
          >
            <Award className="w-4 h-4" />
            <span>View & Download</span>
          </Button>
        </div>
      </div>

      <DialogContent className="max-w-2xl bg-card border-border p-6 rounded-3xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Official Credential</span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black">
            Your Course Certificate
          </DialogTitle>
        </DialogHeader>

        {/* Certificate Mini Preview */}
        <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border border-border/80 shadow-md my-4 bg-muted flex items-center justify-center">
          <Image
            src="/certificate-template.jpg"
            alt="Certificate Preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-widest mt-10 sm:mt-14">
              Proudly Presented To
            </p>
            <p className="text-lg sm:text-2xl font-black text-zinc-900 tracking-wider my-1 sm:my-2">
              {name.toUpperCase()}
            </p>
            <p className="text-[9px] sm:text-[11px] text-zinc-500 max-w-sm mx-auto leading-tight">
              for successfully completing the 2-month challenge and demonstrating mastery in AI & Automation.
            </p>
          </div>
        </div>

        {/* Name Customization Input */}
        <div className="space-y-1.5">
          <Label htmlFor="cert-name" className="text-xs font-semibold text-muted-foreground">
            Name displayed on certificate:
          </Label>
          <Input
            id="cert-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 text-sm font-bold bg-background border-border"
            placeholder="Your Full Name"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
          <Button
            onClick={handleDownload}
            disabled={isGenerating || !name.trim()}
            className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 rounded-xl shadow-md"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating High-Res PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF Certificate</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleLinkedInShare}
            variant="outline"
            className="w-full h-11 font-bold gap-2 rounded-xl border-border hover:bg-muted"
          >
            <Share2 className="w-4 h-4 text-[#0A66C2]" />
            <span>Share to LinkedIn</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
