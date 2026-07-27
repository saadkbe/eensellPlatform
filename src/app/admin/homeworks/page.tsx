import { getPendingHomeworks, getAllHomeworks } from "@/actions/homework.actions";
import { HomeworkList } from "@/components/admin/homework-list";
import { FileCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHomeworksPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const isAll = searchParams.tab === "all";
  const homeworks = isAll ? await getAllHomeworks() : await getPendingHomeworks();

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <FileCheck className="w-8 h-8 text-primary" />
            Homework Review
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Review student submissions, provide feedback, and approve their progress.
          </p>
        </div>
      </div>

      <HomeworkList initialHomeworks={homeworks} isAll={isAll} />
    </div>
  );
}
