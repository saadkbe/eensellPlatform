import { db } from "@/lib/db";
import { CourseManager } from "@/components/admin/course-manager";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const modules = await db.module.findMany({
    include: {
      lessons: {
        include: {
          resources: true,
          _count: {
            select: {
              homeworks: true,
              progress: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return <CourseManager initialModules={modules} />;
}
