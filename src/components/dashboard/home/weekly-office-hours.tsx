"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Video, Calendar, Clock, ArrowRight, ExternalLink, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeeklyOfficeHoursProps {
  upcomingCall?: {
    id: string;
    title: string;
    description?: string | null;
    scheduledAt: Date | string;
    meetingUrl?: string | null;
  } | null;
}

export function WeeklyOfficeHours({ upcomingCall }: WeeklyOfficeHoursProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Target call time
  const targetDate = upcomingCall?.scheduledAt
    ? new Date(upcomingCall.scheduledAt)
    : (() => {
        // Fallback: Next Thursday at 20:00 GMT+1
        const now = new Date();
        const d = new Date(now);
        const day = d.getDay();
        const diff = (4 - day + 7) % 7 || 7;
        d.setDate(d.getDate() + diff);
        d.setHours(20, 0, 0, 0);
        return d;
      })();

  useEffect(() => {
    const updateCountdown = () => {
      const diff = targetDate.getTime() - new Date().getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Generate 1-click Google Calendar Add URL
  const gcalTitle = upcomingCall?.title || "Eensell University V2 Weekly Coaching Mastermind";
  const gcalDetails = "Live Technical Review, Client Deal Feedback & Q&A Office Hours";
  const startIso = targetDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endDate = new Date(targetDate.getTime() + 90 * 60 * 1000); // 90 mins
  const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    gcalTitle
  )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(
    gcalDetails
  )}&location=${encodeURIComponent(upcomingCall?.meetingUrl || "Google Meet / Zoom")}`;

  const formattedDate = targetDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const formattedTime = targetDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return (
    <div className="rounded-2xl bg-[#0F1117] border border-white/[0.06] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Video className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Weekly Office Hours
            </h4>
          </div>
        </div>

        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>UPCOMING</span>
        </span>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        <div>
          <h5 className="text-sm font-bold text-white leading-snug">
            {upcomingCall?.title || "Weekly Mastermind & Technical Office Hours"}
          </h5>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {formattedDate} at {formattedTime}
            </span>
          </div>
        </div>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
          {[
            { label: "DAYS", val: timeLeft.days },
            { label: "HRS", val: timeLeft.hours },
            { label: "MIN", val: timeLeft.minutes },
            { label: "SEC", val: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]"
            >
              <span className="text-lg font-black text-white block">
                {String(item.val).padStart(2, "0")}
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons: 1-click Google Calendar & Optional Join */}
        <div className="pt-2 flex flex-col gap-2">
          {upcomingCall?.meetingUrl && (
            <a
              href={upcomingCall.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                size="sm"
                className="w-full h-9 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition-all gap-1.5 shadow-sm"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Join Live Session</span>
              </Button>
            </a>
          )}

          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full h-9 rounded-xl text-xs font-bold bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border-white/[0.08] transition-all gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Add to Google Calendar</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
