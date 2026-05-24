import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { BookOpen, Lock, PlayCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default async function ModulesPage() {
  const clerkUser = await currentUser();

  const [modules, userProgress] = await Promise.all([
    db.module.findMany({
      where: { isPublished: true },
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
        <span className="relative flex h-3 w-3">
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
            const totalLessons = module.lessons.length;
            const completedCount = module.lessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const percent =
              totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0;
            const isCompleted = percent === 100;
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
              >
                  <Card className="bg-card/60 border-border hover:border-primary/30 transition-all duration-300 group cursor-pointer h-full hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col">
                    {/* Full Bleed Image Cover */}
                    <div className="w-full aspect-video relative bg-card/80 border-b border-border/50 overflow-hidden shrink-0">
                      {module.imageUrl ? (
                        <>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                          <img 
                            src={module.imageUrl} 
                            alt={module.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/5 to-purple-500/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out">
                          <BookOpen className="w-12 h-12 text-primary/20" />
                        </div>
                      )}
                      
                      {/* Floating Badges on Image */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
                        <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-widest">
                          MOD {String(index + 1).padStart(2, "0")}
                        </span>
                        {isCompleted ? (
                          <Badge className="bg-emerald-500 text-white border-transparent text-[10px] shadow-sm">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : percent > 0 ? (
                          <Badge className="bg-primary text-white border-transparent text-[10px] shadow-sm">
                            In Progress
                          </Badge>
                        ) : (
                          <Badge className="bg-black/60 backdrop-blur-md text-white border-transparent text-[10px] shadow-sm">
                            <Lock className="w-3 h-3 mr-1" />
                            Not Started
                          </Badge>
                        )}
                      </div>
                    </div>

                  <CardContent className="p-6 flex flex-col flex-1">

                    {/* Title & description */}
                    <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary/80 transition-colors">
                      {module.title}
                    </h3>
                    {module.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                        {module.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6 mt-auto pt-4">
                      <span className="flex items-center gap-1.5">
                        <PlayCircle className="w-4 h-4 text-primary/70" />
                        {totalLessons} lessons
                      </span>
                      {durationMin > 0 && (
                        <span className="flex items-center gap-1.5">
                          ≈ {durationMin} min
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">{percent}%</span>
                      </div>
                      <Progress
                        value={percent}
                        className="h-1.5 bg-secondary"
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
