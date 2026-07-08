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
  const currentUserId = dbUser?.id || "";

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div 
        className="relative overflow-hidden rounded-3xl border border-[#5865F2]/40 p-8 sm:p-12 shadow-2xl"
        style={{
          backgroundImage: `url('/discord-bg.svg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3 flex items-center gap-3.5 drop-shadow-md">
              <MessageSquare className="w-8 h-8 text-[#5865F2] animate-pulse" />
              Community Hub
            </h1>
            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed font-medium drop-shadow">
              Official announcements and updates from the Eensell team. Join Discord for live discussions.
            </p>
          </div>
          <div className="shrink-0 md:pr-12">
            <a
              href="https://discord.gg/9F3rScRvK"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#5865F2] text-white text-base font-bold hover:bg-[#4752C4] shadow-[0_0_30px_rgba(88,101,242,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(88,101,242,0.8)]"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>

      <CommunityClient initialPosts={posts} isAdmin={isAdmin} currentUserId={currentUserId} />
    </div>
  );
}
