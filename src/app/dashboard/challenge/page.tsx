import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { getChallengeDays, getChallengeProgress } from "@/actions/challenge.actions";
import {
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Award,
  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ChallengePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) return redirect("/sign-in");

  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id },
    select: { id: true },
  });

  if (!dbUser) return redirect("/sign-in");

  const [challengeDays, progress] = await Promise.all([
    getChallengeDays(clerkUser.id),
    getChallengeProgress(clerkUser.id)
  ]);

  return (
    <div className="space-y-6 pb-10">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-7 sm:p-9">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.08),transparent_70%)] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4 text-xs">
            <Target className="w-3 h-3 mr-1" />
            60-Day Challenge
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3 leading-tight">
            Your Blueprint to <span className="text-primary">Success</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
            Follow this 60-day roadmap to build your AI skills, craft your offer, and land your first clients. 
            Complete missions daily to stay on track.
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
                    <CalendarDays className="w-5 h-5 text-primary" />
                    Daily Missions
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs max-w-md">
                    Complete your daily tasks to progress through the challenge.
                  </CardDescription>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    Overall Progress
                  </span>
                  <p className="text-lg font-bold text-primary">{progress.progressPercent}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-7 sm:pl-9 border-l-2 border-muted space-y-8 py-2">
                {challengeDays.map((day) => {
                  let status: "completed" | "current" | "locked" = "locked";
                  
                  if (day.isCompleted) {
                    status = "completed";
                  } else if (day.dayNumber <= progress.currentDay) {
                    status = "current";
                  } else {
                    status = "locked";
                  }

                  let icon, borderCol, textCol, cardBg;

                  if (status === "completed") {
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
                    borderCol = "border-emerald-500/20";
                    textCol = "text-emerald-500";
                    cardBg = "bg-card hover:shadow-md";
                  } else if (status === "current") {
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
                    <div key={day.id} className="relative group">
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
                              status === "locked" ? "text-muted-foreground" : "text-foreground"
                            )}
                          >
                            <span className="text-muted-foreground/60 mr-1.5">
                              Day {day.dayNumber}.
                            </span>
                            {day.title}
                          </h3>
                          {status === "completed" && (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] shrink-0">
                              Done
                            </Badge>
                          )}
                          {status === "current" && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] shrink-0">
                              Action Required
                            </Badge>
                          )}
                          {status === "locked" && (
                            <Badge className="bg-muted text-muted-foreground border-transparent text-[9px] shrink-0">
                              Upcoming
                            </Badge>
                          )}
                        </div>

                        <div className="mt-3 space-y-3">
                          <div>
                            <p className="text-xs font-medium text-foreground mb-1 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-primary" />
                              {day.missionTitle}
                            </p>
                            {day.missionDescription && (
                              <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                                {day.missionDescription}
                              </p>
                            )}
                          </div>
                        </div>

                        {status === "current" && day.lessonId && day.moduleId && (
                          <Link href={`/dashboard/modules/${day.moduleId}/${day.lessonId}`}>
                            <Button
                              size="sm"
                              className="mt-4 gap-2 text-xs h-8 shadow-md shadow-primary/15"
                            >
                              Open Lesson <ArrowRight className="w-3 h-3" />
                            </Button>
                          </Link>
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
          {/* Progress Card */}
          <Card className="bg-card/50 border-border shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" />
                Challenge Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div>
                <p className="text-3xl font-bold text-foreground">Day {progress.currentDay}</p>
                <p className="text-[10px] text-emerald-500 font-medium mt-1">
                  Current day in your 60-day journey
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{progress.completedDays} Days</p>
                    <p className="text-[10px] text-muted-foreground">Successfully completed</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{progress.remainingDays} Days</p>
                    <p className="text-[10px] text-muted-foreground">Remaining in challenge</p>
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
              <h3 className="text-sm font-bold text-foreground mb-1">Challenge Completion</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Complete all 60 days to unlock your final reward and build a sustainable AI business.
              </p>
              <div className="w-full bg-muted h-1.5 rounded-full">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress.progressPercent}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {progress.progressPercent}% complete
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
