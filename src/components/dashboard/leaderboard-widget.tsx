"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star } from "lucide-react";

interface LeaderboardUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  xp: number;
}

export function LeaderboardWidget({ users }: { users: LeaderboardUser[] }) {
  if (!users || users.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 relative overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="absolute top-0 right-0 p-32 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Top Performers</h2>
          <p className="text-sm text-zinc-400">Global XP Leaderboard</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 relative z-10">
        {users.map((user, index) => {
          const isTop3 = index < 3;
          const medals = [
            <Medal key={1} className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />,
            <Medal key={2} className="w-5 h-5 text-zinc-300 drop-shadow-[0_0_8px_rgba(212,212,216,0.3)]" />,
            <Medal key={3} className="w-5 h-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.4)]" />,
          ];

          return (
            <motion.div
              key={user.id}
              layout // Enables smooth place-swapping animation
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 350, 
                damping: 25,
                delay: index * 0.05
              }}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border backdrop-blur-sm ${
                index === 0 ? "border-yellow-500/40 bg-gradient-to-r from-yellow-500/10 to-transparent shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]" : 
                index === 1 ? "border-zinc-300/30 bg-gradient-to-r from-zinc-300/10 to-transparent" :
                index === 2 ? "border-amber-600/30 bg-gradient-to-r from-amber-600/10 to-transparent" :
                "border-white/5 bg-white/5 hover:bg-white/10"
              } transition-colors group`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 font-bold text-base text-zinc-500">
                  {isTop3 ? medals[index] : `#${index + 1}`}
                </div>
                <Avatar className={`w-12 h-12 border-2 shadow-md ${
                  index === 0 ? "border-yellow-500/50" :
                  index === 1 ? "border-zinc-300/50" :
                  index === 2 ? "border-amber-600/50" :
                  "border-white/10"
                }`}>
                  <AvatarImage src={user.imageUrl || ""} className="object-cover" />
                  <AvatarFallback className="bg-zinc-800 text-zinc-300 text-sm font-medium">
                    {user.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className={`font-bold text-base truncate max-w-[140px] sm:max-w-[180px] ${isTop3 ? "text-white" : "text-zinc-200"}`}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[13px] font-medium text-muted-foreground mt-0.5">
                    {user.xp >= 1000 ? "Grandmaster" : user.xp >= 500 ? "Master" : user.xp >= 200 ? "Elite" : user.xp >= 50 ? "Scholar" : "Novice"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-xl border border-white/5 shadow-inner">
                <Star className={`w-4 h-4 ${isTop3 ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" : "text-zinc-500"}`} />
                <span className={`font-mono text-base font-bold tracking-tight ${isTop3 ? "text-amber-400" : "text-zinc-300"}`}>
                  {user.xp}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
