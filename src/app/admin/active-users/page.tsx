import { db } from "@/lib/db";
import { ActiveUsersClient } from "@/components/admin/active-users-client";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function ActiveUsersPage() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Double check admin role from DB to be safe
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser.id }
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const activeUsers = await db.user.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "asc"
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      imageUrl: true,
      createdAt: true,
      role: true,
      progress: {
        where: { isCompleted: true },
        select: { id: true }
      }
    }
  });

  // Map to a clean object for the client
  const mappedUsers = activeUsers.map((user, index) => ({
    id: user.id,
    rank: index + 1,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0],
    email: user.email,
    imageUrl: user.imageUrl,
    startDate: user.createdAt.toISOString(),
    role: user.role,
    completedLessons: user.progress.length,
  }));

  return (
    <div className="pb-8">
      <ActiveUsersClient users={mappedUsers} />
    </div>
  );
}
