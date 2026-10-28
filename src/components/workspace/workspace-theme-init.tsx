"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function WorkspaceThemeInit() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // Check if user has explicitly saved a preference for workspace
    const hasWorkspacePref = localStorage.getItem("eensell-workspace-theme-preference");
    if (!hasWorkspacePref) {
      setTheme("light");
      localStorage.setItem("eensell-workspace-theme-preference", "light");
    }
  }, [setTheme]);

  return null;
}
