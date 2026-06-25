import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { BookOpen, Lock, PlayCircle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ModulesPage() {
  const clerkUser = await currentUser();

  const [modules, userProgress] = await Promise.all([
    db.module.findMany({
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: "asc" },
          select: { id: true, title: true, duration: true },
        },
      },
      orderBy: { order: "asc" },
    }),
    clerkUser
      ? db.progress.findMany({
          where: {
            user: { clerkId: clerkUser.id },
            isCompleted: true,
          },
          select: { lessonId: true },
        })
      : [],
  ]);

  const completedLessonIds = new Set(userProgress.map((p) => p.lessonId));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Course Modules
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Explore all available modules and track your progress.
        </p>
      </div>

      {/* Uploading Notice */}
      <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-3 rounded-xl flex items-center gap-3">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
        </span>
        <p className="text-sm font-medium">New videos are currently being uploaded! Check back soon for more content.</p>
      </div>

      {/* Modules Grid */}
      {modules.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">No modules yet</h2>
          <p className="text-sm text-muted-foreground">
            Course modules will appear here once published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {modules.map((module, index) => {
            // For unpublished modules, they are "locked" and "upcoming"
            if (!module.isPublished) {
              return (
                <div key={`upcoming-${module.id}`}>
                  <Card className="bg-card border-border/40 transition-all duration-500 group h-full overflow-hidden flex flex-col shadow-sm hover:shadow-md p-0 gap-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/[0.02] pointer-events-none z-0" />
                    
                    {/* Full Bleed Image Cover */}
                    <div className="w-full relative bg-[#030712] overflow-hidden shrink-0 z-10 border-b border-border/20 flex items-center justify-center">
                      {module.imageUrl ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 group-hover:opacity-80 transition-opacity duration-500 z-10" />
                          <img 
                            src={module.imageUrl} 
                            alt={module.title}
                            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </>
                      ) : (
                        <div className="w-full aspect-[16/9] bg-neutral-950 flex flex-col items-center justify-center opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out relative">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                          <BookOpen className="w-12 h-12 text-neutral-500 mb-2" />
                        </div>
                      )}
                      
                      {/* Floating Badges on Image */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 shadow-xl">
                          MOD {String(index + 1).padStart(2, "0")}
                        </span>
                        <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white border-transparent text-[10px] shadow-lg backdrop-blur-md font-semibold tracking-wide">
                          <Lock className="w-3 h-3 mr-1.5" />
                          Dropping Soon
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1 z-10">
                      <h3 className="text-lg font-bold text-foreground/80 mb-2 leading-tight">
                        {module.title}
                      </h3>
                      <p className="text-sm text-muted-foreground/70 line-clamp-2 mb-6 leading-relaxed">
                        {module.description || "This module is currently in production and will be dropping soon. Stay tuned!"}
                      </p>

                      <div className="mt-auto pt-4 border-t border-border/30">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="text-muted-foreground font-bold">Locked</span>
                        </div>
                        <Progress
                          value={0}
                          className="h-1.5 bg-muted opacity-50"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            // Published modules logic
            const totalLessons = module.lessons.length;
            const completedCount = module.lessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const percent =
              totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0;
            const isCompleted = percent === 100 && totalLessons > 0;
            const firstLessonId = module.lessons[0]?.id;
            const totalDuration = module.lessons.reduce(
              (sum, l) => sum + (l.duration || 0),
              0
            );
            const durationMin = Math.round(totalDuration / 60);

            return (
              <Link
                key={module.id}
                href={
                  firstLessonId
                    ? `/dashboard/modules/${module.id}/${firstLessonId}`
                    : "#"
                }
                className="block h-full group"
              >
                  <Card className="bg-card border-border/50 transition-all duration-500 h-full overflow-hidden flex flex-col p-0 gap-0 relative shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1.5 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] hover:border-primary/40">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                    
                    {/* Full Bleed Image Cover */}
                    <div className="w-full relative bg-[#030712] overflow-hidden shrink-0 z-10 border-b border-border/20 flex items-center justify-center">
                      {module.imageUrl ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20 group-hover:opacity-80 transition-opacity duration-500 z-10" />
                          <img 
                            src={module.imageUrl} 
                            alt={module.title}
                            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </>
                      ) : (
                        <div className="w-full aspect-[16/9] bg-neutral-950 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out relative overflow-hidden">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                          <BookOpen className="w-12 h-12 text-neutral-800 relative z-10" />
                        </div>
                      )}
                      
                      {/* Floating Badges on Image */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 shadow-xl">
                          MOD {String(index + 1).padStart(2, "0")}
                        </span>
                        {isCompleted ? (
                          <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-transparent text-[10px] shadow-lg backdrop-blur-md font-semibold tracking-wide">
                            <CheckCircle2 className="w-3 h-3 mr-1.5" />
                            Completed
                          </Badge>
                        ) : percent > 0 ? (
                          <Badge className="bg-primary/90 hover:bg-primary text-white border-transparent text-[10px] shadow-lg backdrop-blur-md font-semibold tracking-wide">
                            <PlayCircle className="w-3 h-3 mr-1.5" />
                            In Progress
                          </Badge>
                        ) : (
                          <Badge className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border-white/10 text-[10px] shadow-lg font-semibold tracking-wide">
                            <Lock className="w-3 h-3 mr-1.5 text-white/70" />
                            Not Started
                          </Badge>
                        )}
                      </div>
                    </div>

                  <CardContent className="p-6 flex flex-col flex-1 z-10 bg-card">
                    {/* Title & description */}
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {module.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-[13px] font-semibold text-muted-foreground/80 mb-6 mt-auto pt-2">
                      <span className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md">
                        <PlayCircle className="w-4 h-4 text-primary" />
                        {totalLessons} lessons
                      </span>
                      {durationMin > 0 && (
                        <span className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded-md">
                          <Clock className="w-4 h-4 text-primary" />
                          ≈ {durationMin} min
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="pt-4 border-t border-border/40">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-medium text-foreground">Course Progress</span>
                        <span className={percent === 100 ? "text-emerald-500 font-bold" : "text-primary font-bold"}>
                          {percent}%
                        </span>
                      </div>
                      <Progress
                        value={percent}
                        className={cn("h-2 bg-secondary", percent === 100 && "[&>div]:bg-emerald-500")}
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
