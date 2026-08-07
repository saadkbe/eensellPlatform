"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { completeWalkthrough } from "@/actions/user.actions";

export function WalkthroughProvider({
  hasSeenWalkthrough,
}: {
  hasSeenWalkthrough: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hasSeenWalkthrough) return;

    // Small delay to let the dashboard render and settle
    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: "Got it!",
        nextBtnText: "Next",
        prevBtnText: "Back",
        progressText: "{{current}} of {{total}}",
        popoverClass: "eensell-driver-popover",
        onDestroyStarted: () => {
          // They skipped or finished it
          if (!driverObj.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
            driverObj.destroy();
            completeWalkthrough().catch(console.error);
          }
        },
        steps: [
          {
            element: "#tour-sidebar-dashboard",
            popover: {
              title: "Welcome to the Dashboard",
              description: "This is your command center. Track your progress, recent activity, and upcoming live calls.",
              side: "right",
              align: "start"
            }
          },
          {
            element: "#tour-sidebar-modules",
            popover: {
              title: "The Learning Modules",
              description: "This is where the magic happens. Access all your AI, freelancing, and agency building courses here.",
              side: "right",
              align: "start"
            }
          },
          {
            element: "#tour-sidebar-community",
            popover: {
              title: "The Community",
              description: "You're never alone. Ask questions, network with others, and find accountability partners.",
              side: "right",
              align: "start"
            }
          },
          {
            element: "#tour-topbar-search",
            popover: {
              title: "Global Search",
              description: "Looking for a specific lesson or resource? Use the command menu (Ctrl+K) to find anything instantly.",
              side: "bottom",
              align: "center"
            }
          },
          {
            element: "#tour-topbar-notifications",
            popover: {
              title: "Notifications",
              description: "Stay updated on replies, new lessons, and announcements from the founder.",
              side: "bottom",
              align: "end"
            }
          }
        ]
      });

      driverObj.drive();
    }, 2000); // Wait 2 seconds before starting tour

    return () => clearTimeout(timer);
  }, [mounted, hasSeenWalkthrough]);

  return null;
}
