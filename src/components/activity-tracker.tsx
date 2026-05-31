"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackActivity } from "@/actions/activity.actions";
import { useAuth } from "@clerk/nextjs";

export function ActivityTracker() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const lastUpdateRef = useRef(Date.now());
  
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Track every 15 seconds
    const intervalId = setInterval(() => {
      const now = Date.now();
      const durationSeconds = Math.floor((now - lastUpdateRef.current) / 1000);
      
      if (durationSeconds > 0) {
        trackActivity(pathname, durationSeconds);
        lastUpdateRef.current = now;
      }
    }, 15000); 

    return () => {
      clearInterval(intervalId);
      const now = Date.now();
      const durationSeconds = Math.floor((now - lastUpdateRef.current) / 1000);
      if (durationSeconds > 0) {
        trackActivity(pathname, durationSeconds).catch(() => {});
      }
    };
  }, [pathname, isLoaded, isSignedIn]);

  useEffect(() => {
    // Reset timer on path change
    lastUpdateRef.current = Date.now();
  }, [pathname]);

  return null;
}
