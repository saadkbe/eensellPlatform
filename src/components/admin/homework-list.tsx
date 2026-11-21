"use client";

import { useState, useTransition, useMemo } from "react";
import { reviewHomework } from "@/actions/homework.actions";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, CheckCircle2, XCircle, Clock, ExternalLink, Download, 
  Search, Sparkles, MessageSquare, AlertCircle, Award, User, ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type HomeworkWithRelations = {
  id: string;
  fileUrl: string;
  status: string;
  feedback: string | null;
  createdAt: Date;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    imageUrl: string | null;
  };
  lesson: {
    id: string;
    title: string;
    module: {
      title: string;
    };
  };
};

const QUICK_FEEDBACKS = [
  "🎯 Excellent travail, devoir validé avec brio !",
  "💡 Très bonne analyse et structure claire, continue ainsi !",
  "⚠️ Offre incomplète : revois la tarification en MAD et la stratégie de closing.",
  "❌ Document incomplet : merci d'utiliser le template fourni dans la leçon.",
];

export function HomeworkList({
  initialHomeworks,
  isAll,
}: {
  initialHomeworks: HomeworkWithRelations[];
  isAll: boolean;
}) {
  const router = useRouter();
  const [homeworks, setHomeworks] = useState<HomeworkWithRelations[]>(initialHomeworks);
  const [isPending, startTransition] = useTransition();
  const [activeHomework, setActiveHomework] = useState<HomeworkWithRelations | null>(null);
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHomeworks = useMemo(() => {
    return homeworks.filter((hw) => {
      const q = searchQuery.toLowerCase();
      const userName = `${hw.user.firstName || ""} ${hw.user.lastName || ""}`.toLowerCase();
      const email = hw.user.email.toLowerCase();
      const lesson = hw.lesson.title.toLowerCase();
      const module = hw.lesson.module.title.toLowerCase();
      return userName.includes(q) || email.includes(q) || lesson.includes(q) || module.includes(q);
    });
  }, [homeworks, searchQuery]);

  const stats = useMemo(() => {
    const pending = homeworks.filter((h) => h.status === "PENDING").length;
    const approved = homeworks.filter((h) => h.status === "APPROVED").length;
    const rejected = homeworks.filter((h) => h.status === "REJECTED").length;
    return { pending, approved, rejected, total: homeworks.length };
  }, [homeworks]);

  const handleOpenReview = (hw: HomeworkWithRelations) => {
    setActiveHomework(hw);
    setFeedback(hw.feedback || "");
  };

  const handleCloseReview = () => {
    setActiveHomework(null);
    setFeedback("");
  };

  const handleReview = (status: "APPROVED" | "REJECTED") => {
    if (!activeHomework) return;
    const hwId = activeHomework.id;
    const studentName = `${activeHomework.user.firstName || ""} ${activeHomework.user.lastName || ""}`.trim() || activeHomework.user.email;

    startTransition(async () => {
      try {
        await reviewHomework(hwId, status, feedback.trim() ? feedback : undefined);
        
        // Optimistic local update
        setHomeworks((prev) =>
          prev.map((h) =>
            h.id === hwId
              ? { ...h, status, feedback: feedback.trim() ? feedback : null }
              : h
          )
        );

        toast.success(
          status === "APPROVED"
            ? `✅ Devoir de ${studentName} approuvé (+100 XP accordés) !`
            : `❌ Devoir de ${studentName} rejeté.`
        );
        handleCloseReview();
      } catch (err: any) {
        toast.error(err.message || "Erreur lors de la mise à jour du devoir");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Top Tabs & Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-md">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/homeworks")}
            size="sm"
            className={cn(
              "rounded-xl px-4 text-xs font-bold transition-all",
              !isAll
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            En attente ({stats.pending})
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/homeworks?tab=all")}
            size="sm"
            className={cn(
              "rounded-xl px-4 text-xs font-bold transition-all",
              isAll
                ? "bg-white/10 text-white border border-white/20 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            Toutes les soumissions ({stats.total})
          </Button>
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher étudiant, leçon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-slate-900/60 border-white/[0.08] text-white rounded-xl text-xs placeholder:text-slate-500 focus-visible:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* ── Submissions List ── */}
      {filteredHomeworks.length === 0 ? (
        <Card className="bg-slate-900/40 border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-md shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {searchQuery ? "Aucun devoir correspondant" : "Tout est à jour !"}
            </h3>
            <p className="text-sm text-slate-400 max-w-sm">
              {searchQuery
                ? "Essayez une autre recherche par nom, email ou titre de leçon."
                : isAll
                ? "Aucun devoir n'a encore été soumis par les étudiants."
                : "Aucun devoir en attente de vérification pour le moment. Bon travail !"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredHomeworks.map((hw) => {
            const studentName = `${hw.user.firstName || ""} ${hw.user.lastName || ""}`.trim() || hw.user.email.split("@")[0];
            const dateStr = new Date(hw.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={hw.id}
                className="group relative flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#0F111A]/90 hover:bg-[#141724] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-200 shadow-lg hover:shadow-emerald-500/[0.03] gap-4"
              >
                {/* Left: User & Lesson Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  {hw.user.imageUrl ? (
                    <img
                      src={hw.user.imageUrl}
                      alt={studentName}
                      className="w-11 h-11 rounded-full border border-white/10 shrink-0 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-400">
                      {studentName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-white truncate">{studentName}</p>
                      <span className="text-[11px] text-slate-400 truncate">({hw.user.email})</span>
                      
                      {/* Status Badge */}
                      {hw.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Clock className="w-2.5 h-2.5" /> En attente
                        </span>
                      )}
                      {hw.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Validé (+100 XP)
                        </span>
                      )}
                      {hw.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <XCircle className="w-2.5 h-2.5" /> Rejeté
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium text-[11px]">
                        {hw.lesson.module.title}
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">
                        • {hw.lesson.title}
                      </span>
                      <span className="text-slate-500 text-[11px] ml-auto sm:ml-0">
                        {dateStr}
                      </span>
                    </div>

                    {/* Feedback Preview if any */}
                    {hw.feedback && (
                      <div className="mt-2 text-xs text-slate-300 bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-1.5 flex items-start gap-2 max-w-xl">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="italic line-clamp-1">"{hw.feedback}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <a
                    href={hw.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
                    title="Ouvrir le fichier soumis"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span>PDF</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  <Button
                    onClick={() => handleOpenReview(hw)}
                    size="sm"
                    className={cn(
                      "rounded-xl px-4 text-xs font-bold transition-transform active:scale-95 shadow-md cursor-pointer",
                      hw.status === "PENDING"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-emerald-500/20"
                        : "bg-white/10 hover:bg-white/15 text-white border border-white/15"
                    )}
                  >
                    {hw.status === "PENDING" ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 mr-1" /> Évaluer
                      </>
                    ) : (
                      "Modifier avis"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── REDESIGNED MODERN REVIEW POPUP ── */}
      <Dialog open={!!activeHomework} onOpenChange={(open) => !open && handleCloseReview()}>
        <DialogContent
          showCloseButton={true}
          className="w-full max-w-xl p-0 overflow-hidden bg-[#0A0B10] text-white border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.9)] rounded-3xl"
        >
          {activeHomework && (
            <div>
              {/* Header with Ambient Glow */}
              <div className="relative p-6 sm:p-7 border-b border-white/[0.08] overflow-hidden bg-gradient-to-b from-white/[0.04] to-transparent">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {activeHomework.user.imageUrl ? (
                      <img
                        src={activeHomework.user.imageUrl}
                        alt="Student"
                        className="w-12 h-12 rounded-2xl border border-white/15 object-cover shadow-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-lg shadow-lg">
                        {(activeHomework.user.firstName?.[0] || activeHomework.user.email[0]).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <DialogTitle className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                        <span>Évaluation du Devoir</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                          +100 XP
                        </Badge>
                      </DialogTitle>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {activeHomework.user.firstName} {activeHomework.user.lastName} ({activeHomework.user.email})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Course Context Box */}
                <div className="mt-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {activeHomework.lesson.module.title}
                    </p>
                    <p className="font-semibold text-slate-200 truncate mt-0.5">
                      {activeHomework.lesson.title}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 font-medium">
                    Soumis le {new Date(activeHomework.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 space-y-6">
                {/* 1. PDF Document Card */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
                    Document Soumis par l'Étudiant
                  </label>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-4 group hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-rose-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          Fichier du Devoir (.PDF)
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          Cliquez pour consulter la réponse de l'étudiant
                        </p>
                      </div>
                    </div>

                    <a
                      href={activeHomework.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-colors shrink-0"
                    >
                      <span>Ouvrir PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* 2. Feedback Section with Quick Chips */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      Commentaire / Feedback (Recommandé)
                    </label>
                    <span className="text-[10px] text-slate-500">Visible par l'étudiant</span>
                  </div>

                  {/* Quick Preset Feedback Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {QUICK_FEEDBACKS.map((chip, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFeedback(chip)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors text-left"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <Textarea
                    placeholder="Écrivez vos remarques, félicitations ou axes d'amélioration..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    className="w-full bg-white/[0.04] border-white/10 rounded-2xl p-3 text-sm text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/50"
                  />
                </div>

                {/* 3. Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => handleReview("REJECTED")}
                    className="flex-1 h-12 rounded-2xl border-rose-500/30 hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 font-bold text-xs gap-2 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rejeter le Devoir</span>
                  </Button>

                  <Button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleReview("APPROVED")}
                    className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>{isPending ? "Validation..." : "Approuver (+100 XP)"}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
