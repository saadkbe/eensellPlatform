import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Settings as SettingsIcon, User, Bell, Shield, Mail, Palette, Target, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const clerkUser = await currentUser();

  const dbUser = await db.user.findUnique({
    where: { clerkId: clerkUser?.id || "" },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your account, preferences, and learning goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — Profile + Preferences (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="bg-card/50 border-border overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <CardHeader className="pb-4 relative z-10 border-b border-border/50">
              <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 rounded-xl bg-muted/30 border border-border">
                <div className="shrink-0 ring-4 ring-primary/15 rounded-full">
                  <UserButton 
                    appearance={{ 
                      elements: { 
                        avatarBox: "w-16 h-16",
                        userButtonPopoverCard: "bg-white dark:bg-[#0A0A0A] border border-border shadow-2xl",
                        userProfileBase: "bg-white dark:bg-[#0A0A0A]",
                        card: "bg-white dark:bg-[#0A0A0A]"
                      } 
                    }} 
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-xl font-bold text-foreground">
                    {clerkUser?.firstName} {clerkUser?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    {clerkUser?.emailAddresses[0]?.emailAddress}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {dbUser?.role === "ADMIN" ? "Admin" : "Member"}
                    </Badge>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 px-1">
                Click your avatar to update your photo, name, and security settings.
              </p>
            </CardContent>
          </Card>

          {/* Interactive Client Section */}
          <SettingsClient initialGoals={dbUser?.goals || ""} />
        </div>

        {/* RIGHT — Notifications + Account Info (1 col) */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { label: "Email Updates", desc: "New content notifications", defaultOn: true },
                { label: "Live Reminders", desc: "Session start alerts", defaultOn: true },
                { label: "Marketing", desc: "Promotional emails", defaultOn: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.defaultOn
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.defaultOn ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/50"}`} />
                    {item.defaultOn ? "On" : "Off"}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="bg-gradient-to-br from-primary/8 to-card border-primary/15 overflow-hidden relative">
            <div className="absolute right-0 top-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <CardContent className="p-5 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center mb-3 border border-primary/20 text-primary">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">Your Account</h3>
              <p className="text-xs text-muted-foreground mb-4">
                You've been a valued member of the Eensell community.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{dbUser?.status || "Active"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-semibold text-foreground">{dbUser?.role === "ADMIN" ? "Administrator" : "Student"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Onboarding</span>
                  <span className="font-semibold text-foreground">{dbUser?.onboardingCompleted ? "Completed ✓" : "Pending"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
