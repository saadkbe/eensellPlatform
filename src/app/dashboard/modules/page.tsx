import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { 
  BookOpen, Lock, PlayCircle, CheckCircle2, Clock, 
  Brain, Wand2, Video, Zap, Megaphone, Building2, Users, DollarSign, Rocket
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { COURSE_CATEGORIES } from "@/data/course-mapping";

const iconMap: Record<string, any> = {
  Brain, Wand2, Video, Zap, Megaphone, Building2, Users, DollarSign, Rocket
};

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
          AI Library
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Explore all available courses and track your progress.
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

      {/* Courses Grid */}
      {COURSE_CATEGORIES.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-1">No courses yet</h2>
          <p className="text-sm text-muted-foreground">
            Course library will appear here once published.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {COURSE_CATEGORIES.map((course, index) => {
            const courseModules = modules
              .filter((m) => course.moduleOrders.includes(m.order))
              .sort((a, b) => a.order - b.order);

            const isPublished = courseModules.some((m) => m.isPublished);

            const courseImageUrl = courseModules.find((m) => m.imageUrl)?.imageUrl;
            const IconComponent = iconMap[course.icon] || BookOpen;

            // For unpublished courses, they are "locked" and "upcoming"
            if (!isPublished) {
              return (
                <div key={`upcoming-${course.id}`}>
                  <Card className="bg-black border-border/40 transition-all duration-500 group h-full overflow-hidden flex flex-col shadow-xl hover:shadow-2xl rounded-3xl p-0 gap-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none z-0" />
                    
                    {/* Full Bleed Image Cover with Smooth Black Fade */}
                    <div className="w-full relative bg-black overflow-hidden shrink-0 z-10 flex items-center justify-center">
                      {courseImageUrl ? (
                        <img 
                          src={courseImageUrl} 
                          alt={course.title}
                          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full aspect-[16/9] bg-neutral-950 flex flex-col items-center justify-center opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out relative">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                          <IconComponent className="w-12 h-12 text-neutral-500 mb-2" />
                        </div>
                      )}
                      
                      {/* Linear gradient fade to connect seamlessly with black CardContent */}
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />

                      {/* Floating Badges on Image */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                        <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-xs font-black text-white uppercase tracking-widest border border-white/20 shadow-2xl">
                          {course.code}
                        </span>
                        <Badge className="bg-amber-500 hover:bg-amber-400 text-white border-transparent text-xs shadow-[0_0_20px_rgba(245,158,11,0.5)] backdrop-blur-md font-black tracking-wider px-3 py-1 rounded-xl">
                          <Lock className="w-3.5 h-3.5 mr-1.5" />
                          Dropping Soon
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5 sm:p-6 pt-2 flex flex-col flex-1 z-20 bg-black">
                      <h3 className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400/90 line-clamp-2 mb-6 leading-relaxed font-normal">
                        {course.description || "This course is currently in production and will be dropping soon. Stay tuned!"}
                      </p>

                      <div className="mt-auto pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                          <span className="text-slate-400 font-bold uppercase tracking-wider">Progress</span>
                          <span className="text-amber-500 font-black tracking-wider uppercase">Locked</span>
                        </div>
                        <Progress
                          value={0}
                          className="h-2 bg-slate-800/80 rounded-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            // Published courses logic
            const courseLessons = courseModules.flatMap((m) =>
              m.lessons.map((l) => ({ ...l, moduleId: m.id }))
            );
            const totalLessons = courseLessons.length;
            const completedCount = courseLessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const percent =
              totalLessons > 0
                ? Math.round((completedCount / totalLessons) * 100)
                : 0;
            const isCompleted = percent === 100 && totalLessons > 0;
            const firstLesson = courseLessons[0];
            const totalDuration = courseLessons.reduce(
              (sum, l) => sum + (l.duration || 0),
              0
            );
            const durationMin = Math.round(totalDuration / 60);

            return (
              <Link
                key={course.id}
                href={
                  firstLesson
                    ? `/dashboard/modules/${firstLesson.moduleId}/${firstLesson.id}`
                    : "#"
                }
                className="block h-full group"
              >
                  <Card className="bg-black border-border/40 transition-all duration-500 h-full overflow-hidden flex flex-col p-0 gap-0 relative shadow-xl hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)] hover:-translate-y-2 hover:border-primary/50 rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                    
                    {/* Full Bleed Image Cover with Smooth Black Fade */}
                    <div className="w-full relative bg-black overflow-hidden shrink-0 z-10 flex items-center justify-center">
                      {courseImageUrl ? (
                        <img 
                          src={courseImageUrl} 
                          alt={course.title}
                          className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full aspect-[16/9] bg-neutral-950 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out relative overflow-hidden">
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                          <IconComponent className="w-12 h-12 text-neutral-800 relative z-10" />
                        </div>
                      )}
                      
                      {/* Linear gradient fade to connect seamlessly with black CardContent */}
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />

                      {/* Floating Badges on Image */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                        <span className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-xs font-black text-white uppercase tracking-widest border border-white/20 shadow-2xl">
                          {course.code}
                        </span>
                        {isCompleted ? (
                          <Badge className="bg-emerald-500 hover:bg-emerald-400 text-white border-transparent text-xs shadow-[0_0_20px_rgba(16,185,129,0.5)] backdrop-blur-md font-black tracking-wider px-3 py-1 rounded-xl">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            Completed
                          </Badge>
                        ) : percent > 0 ? (
                          <Badge className="bg-primary hover:bg-primary/90 text-white border-transparent text-xs shadow-[0_0_20px_rgba(249,115,22,0.5)] backdrop-blur-md font-black tracking-wider px-3 py-1 rounded-xl">
                            <PlayCircle className="w-3.5 h-3.5 mr-1.5" />
                            In Progress
                          </Badge>
                        ) : (
                          <Badge className="bg-black/80 hover:bg-black backdrop-blur-md text-white border-white/20 text-xs shadow-2xl font-black tracking-wider px-3 py-1 rounded-xl">
                            <Lock className="w-3.5 h-3.5 mr-1.5 text-white/70" />
                            Not Started
                          </Badge>
                        )}
                      </div>
                    </div>

                  <CardContent className="p-5 sm:p-6 pt-2 flex flex-col flex-1 z-20 bg-black">
                    {/* Title & description */}
                    <h3 className="text-lg sm:text-xl font-black text-white mb-2 group-hover:text-primary transition-colors tracking-tight leading-tight">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-xs sm:text-sm text-slate-300/90 line-clamp-2 mb-5 leading-relaxed font-normal">
                        {course.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-200 mb-6 mt-auto pt-1">
                      <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-xl shadow-inner">
                        <PlayCircle className="w-3.5 h-3.5 text-primary" />
                        {completedCount} / {totalLessons} lessons
                      </span>
                      {durationMin > 0 && (
                        <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-xl shadow-inner">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          ≈ {durationMin} min
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                        <span className="font-bold text-slate-300 uppercase tracking-wider">Course Progress</span>
                        <span className={percent === 100 ? "text-emerald-400 font-black tracking-wider" : "text-primary font-black tracking-wider"}>
                          {percent}%
                        </span>
                      </div>
                      <Progress
                        value={percent}
                        className={cn("h-2 bg-slate-800 rounded-full", percent === 100 && "[&>div]:bg-emerald-500")}
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

