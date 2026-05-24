import { db } from "@/lib/db";
import { Video, Clock, ExternalLink, PlayCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function LiveCallsPage() {
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    db.liveCall.findMany({
      where: { scheduledAt: { gte: now }, isCompleted: false },
      orderBy: { scheduledAt: "asc" },
    }),
    db.liveCall.findMany({
      where: { OR: [{ scheduledAt: { lt: now } }, { isCompleted: true }] },
      orderBy: { scheduledAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Live Calls</h1>
        <p className="text-muted-foreground mt-1 text-sm">Join live sessions or watch replays.</p>
      </div>

      {/* Upcoming */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> Upcoming Sessions
        </h2>
        {upcoming.length === 0 ? (
          <Card className="bg-card/60 border-border">
            <CardContent className="py-12 text-center">
              <Video className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No upcoming sessions scheduled</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((call) => (
              <Card key={call.id} className="bg-card/60 border-border hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <Badge className="bg-success/10 text-success border-success/20 text-[10px] mb-3">Live</Badge>
                  <h3 className="text-base font-semibold text-foreground mb-2">{call.title}</h3>
                  {call.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{call.description}</p>}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    {call.scheduledAt.toLocaleDateString("en-US", {
                      weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                  {call.meetingUrl && (
                    <a href={call.meetingUrl} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="gradient-primary text-white hover:opacity-90 w-full">
                        <Video className="w-4 h-4 mr-2" /> Join Session
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Replays */}
      <section>
        <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <PlayCircle className="w-4 h-4 text-primary" /> Replays
        </h2>
        {past.length === 0 ? (
          <Card className="bg-card/60 border-border">
            <CardContent className="py-12 text-center">
              <PlayCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No replays available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((call) => (
              <Card key={call.id} className="bg-card/60 border-border hover:border-primary/20 transition-all">
                <CardContent className="p-5">
                  <Badge className="bg-secondary text-muted-foreground border-primary/20 text-[10px] mb-3">Replay</Badge>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{call.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {call.scheduledAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  {call.replayUrl ? (
                    <a href={call.replayUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80">
                      Watch Replay <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground">Replay not yet available</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
