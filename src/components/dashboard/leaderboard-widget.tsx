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
    <div className="rounded-xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 relative overflow-hidden flex flex-col h-full shadow-2xl">
      <div className="absolute top-0 right-0 p-32 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Top Performers</h2>
          <p className="text-sm text-muted-foreground">Global XP Leaderboard</p>
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
                index === 1 ? "border-zinc-500/30 bg-gradient-to-r from-zinc-500/10 to-transparent" :
                index === 2 ? "border-amber-600/30 bg-gradient-to-r from-amber-600/10 to-transparent" :
                "border-border/50 bg-muted/30 hover:bg-muted/50"
              } transition-colors group`}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 mr-2">
                <div className="flex items-center justify-center w-6 sm:w-8 font-bold text-sm sm:text-base text-muted-foreground shrink-0">
                  {isTop3 ? medals[index] : `#${index + 1}`}
                </div>
                <Avatar className={`w-10 h-10 sm:w-12 sm:h-12 border-2 shadow-md shrink-0 ${
                  index === 0 ? "border-yellow-500/50" :
                  index === 1 ? "border-zinc-400/50" :
                  index === 2 ? "border-amber-600/50" :
                  "border-border/50"
                }`}>
                  <AvatarImage src={user.imageUrl || ""} className="object-cover" />
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                    {user.firstName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm sm:text-base truncate ${isTop3 ? "text-foreground" : "text-foreground/80"}`}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs sm:text-[13px] font-medium text-muted-foreground mt-0.5 truncate">
                    {user.xp >= 1000 ? "Grandmaster" : user.xp >= 500 ? "Master" : user.xp >= 200 ? "Elite" : user.xp >= 50 ? "Scholar" : "Novice"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-background/40 rounded-xl border border-border/50 shadow-inner shrink-0">
                <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isTop3 ? "text-amber-500 fill-amber-500 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" : "text-muted-foreground"}`} />
                <span className={`font-mono text-sm sm:text-base font-bold tracking-tight ${isTop3 ? "text-amber-600 dark:text-amber-400" : "text-foreground/80"}`}>
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
