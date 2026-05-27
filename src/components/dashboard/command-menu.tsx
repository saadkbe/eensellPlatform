"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Target,
  Video,
  Compass,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    []
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-[200px] lg:w-[280px] h-9 px-3 bg-muted/50 border border-border rounded-full text-sm text-muted-foreground flex items-center justify-between transition-all hover:bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 opacity-70" />
          <span>Search pages...</span>
        </div>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search pages..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Learn">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/modules"))}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Modules</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/resources"))}>
              <FolderOpen className="mr-2 h-4 w-4" />
              <span>Resources</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Engage">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/community"))}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Community</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/live-calls"))}>
              <Video className="mr-2 h-4 w-4" />
              <span>Live Calls</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/goals"))}>
              <Target className="mr-2 h-4 w-4" />
              <span>Goals</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Grow">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/career"))}>
              <Compass className="mr-2 h-4 w-4" />
              <span>Career Paths</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
