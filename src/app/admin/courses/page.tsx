import { db } from "@/lib/db";
import { CourseManager } from "@/components/admin/course-manager";

export default async function AdminCoursesPage() {
  const modules = await db.module.findMany({
    include: { lessons: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  return <CourseManager initialModules={modules} />;
}
