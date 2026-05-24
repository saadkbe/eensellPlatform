"use client";

import { useState, useTransition } from "react";
import { sendBroadcastEmail } from "@/actions/email.actions";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function EmailComposer({ activeEmails }: { activeEmails: string[] }) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSend = () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    startTransition(async () => {
      try {
        const result = await sendBroadcastEmail(activeEmails, subject, content);
        if (result.success) {
          toast.success(`Email sent to ${result.sent} users`);
          setSubject("");
          setContent("");
        } else {
          toast.error("Failed to send emails");
        }
      } catch { toast.error("Failed to send emails"); }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Email Management</h1>
        <p className="text-muted-foreground mt-1 text-sm">Send broadcast emails to all active users.</p>
      </div>

      <Card className="bg-card/60 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-base font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Compose Broadcast
          </CardTitle>
          <p className="text-xs text-muted-foreground">This will be sent to {activeEmails.length} active users.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Subject</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)}
              className="bg-background border-border text-foreground mt-1" placeholder="Email subject..." />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Content (HTML supported)</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)}
              className="bg-background border-border text-foreground mt-1 min-h-[200px]" placeholder="Write your email content..." />
          </div>
          <Button onClick={handleSend} disabled={isPending} className="gradient-primary text-white hover:opacity-90">
            <Send className="w-4 h-4 mr-2" /> {isPending ? "Sending..." : "Send to All Active Users"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card/60 border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-base font-semibold">Email Templates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Approval Email", desc: "Sent automatically when a user is approved" },
            { name: "Rejection Email", desc: "Sent automatically when a user is rejected" },
            { name: "Broadcast Email", desc: "Custom email sent to all active users" },
          ].map((t) => (
            <div key={t.name} className="p-4 rounded-xl bg-background border border-border">
              <p className="text-sm text-foreground font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
