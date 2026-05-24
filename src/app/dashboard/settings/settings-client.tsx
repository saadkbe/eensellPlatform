"use client";

import { useState, useTransition } from "react";
import { updateUserGoals } from "@/actions/user.actions";
import { toast } from "sonner";
import { Save, Palette, Target, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";

export function SettingsClient({ initialGoals }: { initialGoals: string }) {
  const [goals, setGoals] = useState(initialGoals);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSaveGoals = () => {
    startTransition(async () => {
      try {
        await updateUserGoals(goals);
        setSaved(true);
        toast.success("Learning goals saved!");
        setTimeout(() => setSaved(false), 2500);
      } catch {
        toast.error("Failed to save goals");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Theme Preference */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Switch between light and dark mode
              </p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              Learning Goals
            </CardTitle>
            {saved && (
              <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium animate-in fade-in slide-in-from-right-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Saved
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <p className="text-xs text-muted-foreground">
            Describe your learning objectives. This helps you stay focused and is visible on your profile.
          </p>
          <Textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g., Master Next.js and build 3 full-stack projects by the end of Q2..."
            rows={4}
            className="bg-muted/30 border-border text-foreground resize-none text-sm"
          />
          <Button
            onClick={handleSaveGoals}
            disabled={isPending || goals === initialGoals}
            className="gap-2 h-9 text-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Goals
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
