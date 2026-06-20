import { MessageSquare } from "lucide-react";
import { getPosts } from "@/actions/community.actions";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { CommunityClient } from "./community-client";

export default async function CommunityPage() {
  const clerkUser = await currentUser();
  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser?.id || "" },
  });

  const posts = await getPosts();
  const isAdmin = dbUser?.role === "ADMIN";

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#5865F2]/15 via-background to-background border border-border p-7 sm:p-8">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#5865F2]/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#5865F2]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-1.5 flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-[#5865F2]" />
              Community Hub
            </h1>
            <p className="text-sm text-muted-foreground">
              Official announcements and updates from the Eensell team. Join Discord for live discussions.
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5865F2] text-white text-sm font-semibold hover:bg-[#4752C4] shadow-lg shadow-[#5865F2]/20 transition-all hover:scale-105"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>

      <CommunityClient initialPosts={posts} isAdmin={isAdmin} />
    </div>
  );
}
