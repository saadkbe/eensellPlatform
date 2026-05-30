import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { LessonViewer } from "@/components/dashboard/lesson-viewer";
import { getHomeworkForLesson } from "@/actions/homework.actions";

interface LessonPageProps {
  params: Promise<{ moduleId: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleId, lessonId } = await params;
  const clerkUser = await currentUser();

  const lesson = await db.lesson.findUnique({
    where: { id: lessonId, moduleId, isPublished: true },
    include: {
      resources: true,
      module: {
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { order: "asc" },
            select: { id: true, title: true, order: true, duration: true },
          },
        },
      },
    },
  });

  if (!lesson) return notFound();

  const userProgress = clerkUser
    ? await db.progress.findMany({
        where: { user: { clerkId: clerkUser.id }, lesson: { moduleId } },
        select: { lessonId: true, isCompleted: true },
      })
    : [];

  const completedIds = userProgress.filter((p) => p.isCompleted).map((p) => p.lessonId);
  const idx = lesson.module.lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = idx > 0 ? lesson.module.lessons[idx - 1] : null;
  const nextLesson = idx < lesson.module.lessons.length - 1 ? lesson.module.lessons[idx + 1] : null;

  const homework = lesson.requiresHomework ? await getHomeworkForLesson(lessonId) : null;

  return (
    <LessonViewer
      lesson={lesson}
      moduleLessons={lesson.module.lessons}
      moduleId={moduleId}
      moduleTitle={lesson.module.title}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      completedLessonIds={completedIds}
      isCompleted={completedIds.includes(lessonId)}
      homework={homework}
    />
  );
}
