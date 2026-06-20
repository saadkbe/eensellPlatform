import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import {
  Compass,
  CheckCircle2,
  Lock,
  Heart,
  ArrowRight,
  Target,
  Award,
  DollarSign,
  Clock,
  Globe,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const clerkUser = await currentUser();

  const [modules, userProgress] = await Promise.all([
    db.module.findMany({
      orderBy: { order: "asc" },
      include: {
        lessons: {
          where: { isPublished: true },
          select: { id: true },
        },
      },
    }),
    clerkUser
      ? db.progress.findMany({
          where: { user: { clerkId: clerkUser.id }, isCompleted: true },
          select: { lessonId: true },
        })
      : [],
  ]);

  const completedLessonIds = new Set(userProgress.map((p) => p.lessonId));

  let firstInProgressFound = false;
  let completedModulesCount = 0;

  const steps = modules.map((mod) => {
    let status: "completed" | "in-progress" | "locked" = "locked";

    if (mod.isPublished) {
      const completedLessonsCount = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length;
      if (mod.lessons.length > 0 && completedLessonsCount === mod.lessons.length) {
        status = "completed";
        completedModulesCount++;
      } else if (completedLessonsCount > 0) {
        status = "in-progress";
        firstInProgressFound = true;
      } else if (!firstInProgressFound) {
        status = "in-progress";
        firstInProgressFound = true;
      }
    }

    const nextLesson = mod.lessons.find((l) => !completedLessonIds.has(l.id)) || mod.lessons[0];

    return { ...mod, status, nextLesson };
  });

  const progressPercent = modules.length > 0 ? Math.round((completedModulesCount / modules.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-10">
      {/* ── Emotional Hero ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-7 sm:p-9">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4 text-xs">
            <Compass className="w-3 h-3 mr-1" />
            Ultimate AI Entrepreneur Roadmap
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3 leading-tight">
            You're not looking for a job. <br />
            <span className="text-primary">You're building an empire.</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            This roadmap tracks your actual progress through the Eensell University curriculum. 
            Complete modules, unlock new skills, and scale your income.
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roadmap (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Master Curriculum
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs max-w-md">
                    Follow the modules in order to build your AI skillset.
                  </CardDescription>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    Overall Progress
                  </span>
                  <p className="text-lg font-bold text-primary">{progressPercent}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-7 sm:pl-9 border-l-2 border-muted space-y-8 py-2">
                {steps.map((step, idx) => {
                  let icon, borderCol, textCol, cardBg;

                  if (step.status === "completed") {
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                    borderCol = "border-emerald-500/20";
                    textCol = "text-emerald-500";
                    cardBg = "bg-card hover:shadow-md";
                  } else if (step.status === "in-progress") {
                    icon = (
                      <div className="w-5 h-5 rounded-full border-[3px] border-primary bg-background shadow-[0_0_10px_hsl(var(--primary)/0.4)] animate-pulse" />
                    );
                    borderCol = "border-primary/30";
                    textCol = "text-primary";
                    cardBg = "bg-card hover:shadow-md";
                  } else {
                    icon = <Lock className="w-4 h-4 text-muted-foreground/50" />;
                    borderCol = "border-border";
                    textCol = "text-muted-foreground";
                    cardBg = "bg-muted/20 opacity-60";
                  }

                  return (
                    <div key={step.id} className="relative group">
                      {/* Timeline node */}
                      <div className="absolute -left-[33px] sm:-left-[41px] top-4 flex items-center justify-center bg-background rounded-full p-0.5">
                        {icon}
                      </div>

                      {/* Content */}
                      <div
                        className={cn(
                          "p-5 rounded-xl border transition-all duration-300",
                          borderCol,
                          cardBg
                        )}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3
                            className={cn(
                              "font-semibold text-sm",
                              step.status === "locked" ? "text-muted-foreground" : "text-foreground"
                            )}
                          >
                            <span className="text-muted-foreground/60 mr-1.5">
                              {String(idx + 1).padStart(2, "0")}.
                            </span>
                            {step.title}
                          </h3>
                          {step.status === "completed" && (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] shrink-0">
                              Done
                            </Badge>
                          )}
                          {step.status === "in-progress" && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] shrink-0">
                              Next Up
                            </Badge>
                          )}
                          {step.status === "locked" && (
                            <Badge className="bg-muted text-muted-foreground border-transparent text-[9px] shrink-0">
                              {step.isPublished ? "Locked" : "Upcoming"}
                            </Badge>
                          )}
                        </div>

                        {step.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                            {step.description}
                          </p>
                        )}

                        {!step.isPublished && step.status === "locked" && (
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 mt-4">
                            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-foreground/80 italic leading-snug">
                              This module is currently in production and dropping soon.
                            </p>
                          </div>
                        )}

                        {step.status === "in-progress" && step.isPublished && step.lessons.length > 0 && step.nextLesson && (
                          <Link href={`/dashboard/modules/${step.id}/${step.nextLesson.id}`}>
                            <Button
                              size="sm"
                              className="mt-4 gap-2 text-xs h-8 shadow-md shadow-primary/15"
                            >
                              Start Learning <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}
                        
                        {step.status === "in-progress" && step.isPublished && step.lessons.length === 0 && (
                           <div className="mt-4 text-xs text-amber-500 font-medium">
                             Lessons are currently being added...
                           </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (1 col) */}
        <div className="space-y-5">
          {/* Income Projection */}
          <Card className="bg-card/50 border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Income Potential
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div>
                <p className="text-3xl font-bold text-foreground">5K – 30K MAD</p>
                <p className="text-[10px] text-emerald-500 font-medium mt-1">
                  Monthly income potential
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">3–6 Months</p>
                    <p className="text-[10px] text-muted-foreground">Estimated completion time</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Globe className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">Work From Anywhere</p>
                    <p className="text-[10px] text-muted-foreground">Location independence</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">High Demand</p>
                    <p className="text-[10px] text-muted-foreground">AI skills are highly sought after</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certification */}
          <Card className="bg-card/50 border-border shadow-sm">
            <CardContent className="p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3 border border-amber-500/20 text-amber-500">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">Eensell Certified</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Complete all {modules.length} modules to earn your Eensell AI Mastery certification.
              </p>
              <div className="w-full bg-muted h-1.5 rounded-full">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {completedModulesCount} of {modules.length} modules complete
              </p>
            </CardContent>
          </Card>

          {/* Emotional Quote */}
          <div className="p-5 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs text-foreground/80 italic leading-relaxed">
              "The best time to start was yesterday. The second best time is right now. Every expert
              was once a beginner who refused to quit."
            </p>
            <p className="text-[10px] text-muted-foreground mt-2 font-medium">— Eensell Team</p>
          </div>
        </div>
      </div>
    </div>
  );
}
