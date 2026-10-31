import { getPosts } from "@/actions/community.actions";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { CommunityClient } from "./community-client";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const clerkUser = await currentUser();
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser?.id || "" },
  });

  const posts = await getPosts();
  const isAdmin = dbUser?.role === "ADMIN";
  const currentUserId = dbUser?.id || "";

  const currentUserData = {
    id: currentUserId,
    firstName: dbUser?.firstName || clerkUser?.firstName || "Agency",
    lastName: dbUser?.lastName || clerkUser?.lastName || "Builder",
    imageUrl: dbUser?.imageUrl || clerkUser?.imageUrl || null,
    role: dbUser?.role || "USER",
  };

  return (
    <div className="pb-16 max-w-7xl mx-auto">
      <CommunityClient
        initialPosts={posts}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        currentUser={currentUserData}
      />
    </div>
  );
}
