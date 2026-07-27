import { PenLine } from "lucide-react";
import { getPosts } from "@/actions/community.actions";
import { AdminPostsClient } from "./posts-client";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6 pb-8">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500/10 via-background to-background border border-border p-8 sm:p-10 shadow-sm">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-violet-500/5 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-medium mb-4 border border-violet-500/20">
            <PenLine className="w-3.5 h-3.5" />
            <span>Content Management</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
            Community Posts
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Create rich announcements with formatted text, images, videos, and links. Posts appear in the Community Hub for all users.
          </p>
        </div>
      </div>

      <AdminPostsClient initialPosts={posts} />
    </div>
  );
}
