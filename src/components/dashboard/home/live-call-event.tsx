"use client";

import { Video, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveCallEventProps {
  liveCall: any | null;
}

export function LiveCallEvent({ liveCall }: LiveCallEventProps) {
  return (
    <div className="bg-[#0a0b10] border border-white/[0.08] rounded-3xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
          <Video className="w-4 h-4 text-rose-500" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">Live Session</h2>
      </div>

      {liveCall ? (
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-4 w-fit animate-pulse">
            Upcoming
          </div>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {liveCall.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Clock className="w-4 h-4" />
            {new Date(liveCall.scheduledAt).toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          {liveCall.meetingUrl && (
            <a href={liveCall.meetingUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-white text-black hover:bg-white/90 rounded-xl font-bold">
                Join Session
              </Button>
            </a>
          )}
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mx-auto mb-3">
            <Video className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-sm font-semibold text-white/60">No upcoming session</p>
        </div>
      )}
    </div>
  );
}
