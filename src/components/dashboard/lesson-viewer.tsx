"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { markLessonComplete, markLessonIncomplete } from "@/actions/user.actions";
import { toast } from "sonner";
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  Download, FileText, PlayCircle, Clock, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LessonViewerProps {
  lesson: {
    id: string; title: string; description: string | null;
    videoUrl: string | null; duration: number | null;
    resources: { id: string; title: string; type: string; fileUrl: string | null }[];
  };
  moduleLessons: { id: string; title: string; order: number; duration: number | null }[];
  moduleId: string; moduleTitle: string;
  prevLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
  completedLessonIds: string[];
  isCompleted: boolean;
}

export function LessonViewer({
  lesson, moduleLessons, moduleId, moduleTitle,
  prevLesson, nextLesson, completedLessonIds, isCompleted: initialCompleted,
}: LessonViewerProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggleComplete = () => {
    startTransition(async () => {
      try {
        if (completed) {
          await markLessonIncomplete(lesson.id);
          setCompleted(false);
          toast.success("Lesson marked as incomplete");
        } else {
          await markLessonComplete(lesson.id);
          setCompleted(true);
          toast.success("Lesson completed! 🎉");
        }
      } catch { toast.error("Something went wrong"); }
    });
  };

  // Helper to convert standard YouTube/Vimeo URLs to embed URLs
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    try {
      const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vimeoMatch && vimeoMatch[1]) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      
      const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}`;
      
      return url;
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(lesson.videoUrl);

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80 tracking-wide uppercase">
        <Link href="/dashboard/modules" className="hover:text-primary transition-colors">Modules</Link>
        <span>/</span>
        <span className="text-muted-foreground">{moduleTitle}</span>
        <span>/</span>
        <span className="text-primary/90">{lesson.title}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
        {/* Main Content */}
        <div className="space-y-8 min-w-0">
          {/* Cinematic Video Player */}
          {embedUrl ? (
            <div className="relative group">
              {/* Subtle Glowing Background */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative w-full rounded-2xl overflow-hidden bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl aspect-video ring-1 ring-white/5">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={lesson.title}
                />
              </div>
            </div>
          ) : (
            <div className="w-full rounded-2xl bg-card/40 backdrop-blur-md border border-white/10 aspect-video flex items-center justify-center shadow-lg">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No video available</p>
              </div>
            </div>
          )}

          {/* Lesson Info + Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-tight">
                {lesson.title}
              </h1>
              {lesson.duration && (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground font-medium">
                  <Clock className="w-4 h-4 text-primary/70" />
                  {Math.round(lesson.duration / 60)} minutes
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggleComplete}
              disabled={isPending}
              className={cn(
                "relative shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg border",
                completed
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 shadow-emerald-500/10"
                  : "gradient-primary text-white hover:opacity-90 border-transparent shadow-primary/20"
              )}
            >
              <AnimatePresence mode="wait">
                {completed ? (
                  <motion.div
                    key="completed"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Completed</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="incomplete"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2"
                  >
                    <Circle className="w-5 h-5" />
                    <span>Mark Complete</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {lesson.description && (
            <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 shadow-sm text-base text-muted-foreground/90 leading-relaxed whitespace-pre-wrap">
              {lesson.description}
            </div>
          )}

          {/* Resources */}
          {lesson.resources.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" /> Downloadable Resources
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.resources.map((r) => {
                  const isLink = r.type === "link";
                  return (
                    <a key={r.id} href={r.fileUrl || "#"} target="_blank" rel="noopener noreferrer"
                      className="group relative flex items-center gap-4 p-4 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-primary/5">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
                      
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                        {isLink ? <ExternalLink className="w-6 h-6 text-primary" /> : <FileText className="w-6 h-6 text-primary" />}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{r.title}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-medium">{r.type}</p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:bg-primary/20 shrink-0">
                        {isLink ? <ExternalLink className="w-4 h-4 text-primary" /> : <Download className="w-4 h-4 text-primary" />}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-white/5">
            {prevLesson ? (
              <Link href={`/dashboard/modules/${moduleId}/${prevLesson.id}`}>
                <Button variant="outline" size="lg" className="border-white/10 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl">
                  <ChevronLeft className="w-5 h-5 mr-2" /> Previous Lesson
                </Button>
              </Link>
            ) : <div />}
            {nextLesson ? (
              <Link href={`/dashboard/modules/${moduleId}/${nextLesson.id}`}>
                <Button size="lg" className="gradient-primary text-white hover:opacity-90 rounded-xl shadow-lg shadow-primary/20">
                  Next Lesson <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* Sidebar — Lesson List */}
        <div className="h-fit sticky top-6">
          <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 shadow-xl">
            <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-2 h-6 rounded-full bg-primary" />
              {moduleTitle}
            </h3>
            <div className="space-y-1.5">
              {moduleLessons.map((l, i) => {
                const isCurrent = l.id === lesson.id;
                const isDone = completedLessonIds.includes(l.id);
                return (
                  <Link key={l.id} href={`/dashboard/modules/${moduleId}/${l.id}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all relative overflow-hidden group",
                      isCurrent 
                        ? "text-primary-foreground shadow-md" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}>
                    {isCurrent && (
                      <motion.div 
                        layoutId="activeLesson" 
                        className="absolute inset-0 bg-primary/90 -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {isDone ? (
                      <CheckCircle2 className={cn("w-5 h-5 shrink-0 transition-colors", isCurrent ? "text-primary-foreground" : "text-emerald-500")} />
                    ) : isCurrent ? (
                      <PlayCircle className="w-5 h-5 text-primary-foreground shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/50 shrink-0 group-hover:text-muted-foreground" />
                    )}
                    
                    <span className="truncate">{i + 1}. {l.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
