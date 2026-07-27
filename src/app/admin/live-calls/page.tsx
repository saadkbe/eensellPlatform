"use client";

import { useEffect, useState, useTransition } from "react";
import {
  getAllLiveCalls,
  createLiveCall,
  updateLiveCall,
  deleteLiveCall,
} from "@/actions/livecall.actions";
import { toast } from "sonner";
import {
  Video,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Radio,
  CalendarCheck,
  LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UploadButton } from "@/lib/uploadthing";

type LiveCall = {
  id: string;
  title: string;
  description: string | null;
  scheduledAt: Date;
  meetingUrl: string | null;
  replayUrl: string | null;
  isCompleted: boolean;
  createdAt: Date;
};

function getCallStatus(call: LiveCall) {
  const now = new Date();
  const scheduled = new Date(call.scheduledAt);
  const diff = scheduled.getTime() - now.getTime();
  const hourMs = 60 * 60 * 1000;

  if (call.isCompleted) return "completed";
  if (diff <= 0 && diff > -2 * hourMs) return "live";
  if (diff <= 0) return "completed";
  return "upcoming";
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "live":
      return (
        <Badge className="bg-red-500/10 text-red-500 border border-red-500/20 gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          Live Now
        </Badge>
      );
    case "upcoming":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          Upcoming
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-white/[0.04] text-white/40 border border-white/[0.06]">
          Completed
        </Badge>
      );
    default:
      return null;
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminLiveCallsPage() {
  const [calls, setCalls] = useState<LiveCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Schedule dialog
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  // Replay dialog
  const [replayOpen, setReplayOpen] = useState(false);
  const [replayCallId, setReplayCallId] = useState("");
  const [replayUrl, setReplayUrl] = useState("");
  const [replayMode, setReplayMode] = useState("link"); // 'link' or 'upload'

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCallId, setDeleteCallId] = useState("");

  const fetchCalls = async () => {
    try {
      const data = await getAllLiveCalls();
      setCalls(data as LiveCall[]);
    } catch {
      toast.error("Failed to load live calls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const now = new Date();
  const upcomingCalls = calls.filter((c) => {
    const status = getCallStatus(c);
    return status === "upcoming" || status === "live";
  });
  const pastCalls = calls.filter((c) => getCallStatus(c) === "completed");

  const handleSchedule = () => {
    if (!title.trim() || !scheduledAt) {
      toast.error("Title and date/time are required");
      return;
    }
    startTransition(async () => {
      try {
        await createLiveCall({
          title: title.trim(),
          description: description.trim() || undefined,
          scheduledAt: new Date(scheduledAt),
          meetingUrl: meetingUrl.trim() || undefined,
        });
        toast.success("Live call scheduled successfully");
        setScheduleOpen(false);
        setTitle("");
        setDescription("");
        setScheduledAt("");
        setMeetingUrl("");
        fetchCalls();
      } catch {
        toast.error("Failed to schedule live call");
      }
    });
  };

  const handleAddReplay = () => {
    if (!replayUrl.trim()) {
      toast.error("Please enter a replay URL");
      return;
    }
    startTransition(async () => {
      try {
        await updateLiveCall(replayCallId, {
          replayUrl: replayUrl.trim(),
          isCompleted: true,
        });
        toast.success("Replay URL added successfully");
        setReplayOpen(false);
        setReplayCallId("");
        setReplayUrl("");
        fetchCalls();
      } catch {
        toast.error("Failed to add replay URL");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteLiveCall(deleteCallId);
        toast.success("Live call deleted");
        setDeleteOpen(false);
        setDeleteCallId("");
        fetchCalls();
      } catch {
        toast.error("Failed to delete live call");
      }
    });
  };

  return (
    <div className="space-y-8 pb-8">
      {/* ── Premium Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-8 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-transparent to-indigo-500/[0.05]" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-medium mb-4 border border-blue-500/20">
              <Video className="w-3.5 h-3.5" />
              <span>Live Sessions</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Live Calls Management
            </h1>
            <p className="text-white/40 text-base max-w-xl">
              Schedule live coaching sessions, manage Google Meet links, and
              upload session replays for your students.
            </p>
          </div>

          <div className="shrink-0">
            <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
              <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all">
                <Plus className="w-4 h-4" />
                Schedule Call
              </DialogTrigger>

              <DialogContent className="bg-[#12131a] border-white/[0.08] text-white sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Schedule a Live Call</DialogTitle>
                  <DialogDescription className="text-white/40">
                    Set up a new live coaching session with Google Meet.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div>
                    <Label className="text-xs text-white/40">
                      Title *
                    </Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-white/[0.02] border-white/[0.06] text-white mt-1"
                      placeholder="e.g. Weekly Q&A Session"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-white/40">
                      Description
                    </Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-white/[0.02] border-white/[0.06] text-white mt-1 min-h-[80px]"
                      placeholder="What will this session cover?"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-white/40">
                      Date &amp; Time *
                    </Label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-white/40">
                      Google Meet URL
                    </Label>
                    <Input
                      value={meetingUrl}
                      onChange={(e) => setMeetingUrl(e.target.value)}
                      className="bg-white/[0.02] border-white/[0.06] text-white mt-1"
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleSchedule}
                    disabled={isPending}
                    className="gap-2"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    {isPending ? "Scheduling..." : "Schedule Call"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.06] hover:border-blue-500/20 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {upcomingCalls.length}
                </p>
                <p className="text-sm font-medium text-white/40">
                  Upcoming Sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.06] hover:border-indigo-500/20 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {pastCalls.filter((c) => c.replayUrl).length}
                </p>
                <p className="text-sm font-medium text-white/40">
                  Replays Available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.06] hover:border-emerald-500/20 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {calls.length}
                </p>
                <p className="text-sm font-medium text-white/40">
                  Total Sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Upcoming Sessions ── */}
      <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.06] overflow-hidden">
        <CardHeader className="border-b border-white/[0.04] bg-white/[0.02] pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Upcoming Sessions
            </CardTitle>
            <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20">
              {upcomingCalls.length} scheduled
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-white/40">Loading sessions...</p>
            </div>
          ) : upcomingCalls.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                <Calendar className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-sm font-medium text-white">
                No upcoming sessions
              </p>
              <p className="text-xs text-white/40 mt-1">
                Schedule a new live call to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {upcomingCalls.map((call) => {
                const status = getCallStatus(call);
                return (
                  <div
                    key={call.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/[0.03] transition-colors group gap-4"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-blue-500/20">
                        {status === "live" ? (
                          <Radio className="w-5 h-5 text-red-500" />
                        ) : (
                          <Video className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                          {call.title}
                        </p>
                        {call.description && (
                          <p className="text-xs text-white/40 mt-0.5 line-clamp-1">
                            {call.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs text-white/40">
                            <Calendar className="w-3 h-3" />
                            {formatDate(call.scheduledAt)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            {formatTime(call.scheduledAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 sm:ml-4">
                      <StatusBadge status={status} />
                      {call.meetingUrl && (
                        <a
                          href={call.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs border-white/[0.06] hover:bg-white/[0.04]"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Meet
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setDeleteCallId(call.id);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Past Sessions ── */}
      <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.06] overflow-hidden">
        <CardHeader className="border-b border-white/[0.04] bg-white/[0.02] pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
              <Film className="w-5 h-5 text-indigo-500" />
              Past Sessions
            </CardTitle>
            <Badge className="bg-white/[0.04] text-white/40 border border-white/[0.06]">
              {pastCalls.length} completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-white/40">Loading sessions...</p>
            </div>
          ) : pastCalls.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                <Film className="w-8 h-8 text-white/40" />
              </div>
              <p className="text-sm font-medium text-white">
                No past sessions yet
              </p>
              <p className="text-xs text-white/40 mt-1">
                Completed sessions will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {pastCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-white/[0.03] transition-colors group gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-indigo-500/20">
                      <Film className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">
                        {call.title}
                      </p>
                      {call.description && (
                        <p className="text-xs text-white/40 mt-0.5 line-clamp-1">
                          {call.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-xs text-white/40">
                          <Calendar className="w-3 h-3" />
                          {formatDate(call.scheduledAt)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-white/40">
                          <Clock className="w-3 h-3" />
                          {formatTime(call.scheduledAt)}
                        </span>
                        {call.replayUrl && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                            <Film className="w-3 h-3" />
                            Replay available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:ml-4">
                    <StatusBadge status="completed" />

                    {call.replayUrl ? (
                      <a
                        href={call.replayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs border-white/[0.06] hover:bg-white/[0.04]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Replay
                        </Button>
                      </a>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs border-white/[0.06] hover:border-indigo-500/30 hover:bg-indigo-500/5"
                        onClick={() => {
                          setReplayCallId(call.id);
                          setReplayUrl("");
                          setReplayOpen(true);
                        }}
                      >
                        <LinkIcon className="w-3 h-3" />
                        Add Replay
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setDeleteCallId(call.id);
                        setDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Replay Dialog ── */}
      <Dialog open={replayOpen} onOpenChange={setReplayOpen}>
        <DialogContent className="bg-[#12131a] border-white/[0.08] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Replay Video</DialogTitle>
            <DialogDescription className="text-white/40">
              Upload the session video or paste a YouTube / Vimeo link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Tabs value={replayMode} onValueChange={setReplayMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/[0.04] p-1 rounded-lg">
                <TabsTrigger value="link" className="data-[state=active]:bg-[#12131a] data-[state=active]:text-white text-white/40 rounded-md text-xs">
                  Paste URL
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-[#12131a] data-[state=active]:text-white text-white/40 rounded-md text-xs">
                  Upload Video
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="link" className="mt-0 space-y-3">
                <Label className="text-xs text-white/40">Replay URL *</Label>
                <Input
                  value={replayUrl}
                  onChange={(e) => setReplayUrl(e.target.value)}
                  className="bg-white/[0.02] border-white/[0.06] text-white mt-1"
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-[11px] text-white/40 mt-1.5">
                  Supports YouTube, Vimeo, or any direct video link.
                </p>
              </TabsContent>
              
              <TabsContent value="upload" className="mt-0">
                <div className="space-y-3">
                  <Label className="text-xs text-white/40">Upload MP4/WebM *</Label>
                  {replayUrl && replayMode === "upload" ? (
                    <div className="flex items-center gap-3 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3 mt-1">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <Film className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Video uploaded successfully</p>
                        <p className="text-xs text-white/40 truncate">{replayUrl}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplayUrl("")}
                        className="text-white/40 hover:text-destructive shrink-0"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <UploadButton
                        endpoint="replayVideo"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) setReplayUrl(res[0].ufsUrl);
                          toast.success("Video uploaded!");
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(error.message);
                        }}
                        appearance={{
                          button: "bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium px-4 py-2 rounded-lg",
                          container: "w-full",
                          allowedContent: "text-white/40 text-xs",
                        }}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddReplay}
              disabled={isPending}
              className="gap-2"
            >
              <Film className="w-4 h-4" />
              {isPending ? "Saving..." : "Save Replay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="bg-[#12131a] border-white/[0.08] text-white sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Live Call</DialogTitle>
            <DialogDescription className="text-white/40">
              Are you sure you want to delete this live call? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-white/[0.06] bg-transparent text-white hover:bg-white/[0.02]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
