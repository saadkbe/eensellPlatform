import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Award, Calendar, User, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ certId: string }>;
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { certId } = await params;
  const decodedId = decodeURIComponent(certId);

  return (
    <div className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Navbar */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2">
            <Image src="/icon.svg" alt="Eensell" width={28} height={28} />
          </div>
          <span className="font-black text-lg tracking-tight">Eensell University</span>
        </Link>
        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 gap-1.5 py-1 px-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Credential Verification</span>
        </Badge>
      </header>

      {/* Main Card */}
      <main className="max-w-2xl mx-auto w-full my-12">
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Top Verified Banner */}
          <div className="flex items-center justify-center gap-2 mb-8 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 py-2.5 px-4 rounded-2xl w-fit mx-auto text-sm font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Official Credential Verified</span>
          </div>

          <div className="text-center space-y-3 mb-10">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Certificate of Success
            </h1>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              This digital credential certifies the successful completion and mastery of the 60-day AI & modern digital skills program.
            </p>
          </div>

          {/* Details Table */}
          <div className="space-y-4 rounded-2xl bg-black/40 border border-white/5 p-6 mb-8 divide-y divide-white/5">
            <div className="flex items-center justify-between pb-4">
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" />
                Program
              </span>
              <span className="text-sm font-bold text-white text-right">
                AI & Digital Mastery Program
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Certificate ID
              </span>
              <span className="font-mono text-sm font-black text-emerald-400">
                {decodedId}
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Status
              </span>
              <Badge className="bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400">
                Active & Valid
              </Badge>
            </div>

            <div className="pt-4">
              <span className="text-xs font-semibold text-zinc-400 block mb-3">
                Verified Skills & Competencies:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Generative AI Prompting",
                  "AI UGC Video Creation",
                  "Client Acquisition Systems",
                  "Digital Agency Workflows",
                  "Automation & Tools"
                ].map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white gap-2">
                <span>About Eensell University</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-zinc-500 py-4 border-t border-white/5">
        © {new Date().getFullYear()} Eensell University. All rights reserved.
      </footer>
    </div>
  );
}
