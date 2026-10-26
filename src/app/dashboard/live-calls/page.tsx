import { db } from "@/lib/db";
import { LiveCallsClient, LiveCallItem } from "./live-calls-client";

export const dynamic = "force-dynamic";

export default async function LiveCallsPage() {
  const now = new Date();

  // Fetch upcoming and past live calls
  let [upcoming, past] = await Promise.all([
    db.liveCall.findMany({
      where: { scheduledAt: { gte: now }, isCompleted: false },
      orderBy: { scheduledAt: "asc" },
    }),
    db.liveCall.findMany({
      where: { OR: [{ scheduledAt: { lt: now } }, { isCompleted: true }] },
      orderBy: { scheduledAt: "desc" },
      take: 20,
    }),
  ]);

  // If no upcoming call exists in the database yet, provide next scheduled session
  if (upcoming.length === 0) {
    const nextDate = new Date();
    // Default to upcoming Tuesday or Thursday at 8:00 PM
    const dayOfWeek = nextDate.getDay();
    const daysUntilTuesday = (2 - dayOfWeek + 7) % 7 || 7;
    nextDate.setDate(nextDate.getDate() + daysUntilTuesday);
    nextDate.setHours(20, 0, 0, 0);

    upcoming = [
      {
        id: "default-next-call",
        title: "Live Agency Scaling & Client Acquisition Teardown",
        description:
          "Weekly interactive mastermind covering WhatsApp AI workflows, objection handling scripts, and live client proposal audits.",
        scheduledAt: nextDate,
        meetingUrl: "https://meet.google.com",
        replayUrl: null,
        isCompleted: false,
        createdAt: new Date(),
      },
    ];
  }

  // Format date objects to serializable items
  const serializableUpcoming: LiveCallItem[] = upcoming.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    scheduledAt: c.scheduledAt.toISOString(),
    meetingUrl: c.meetingUrl,
    replayUrl: c.replayUrl,
    isCompleted: c.isCompleted,
    createdAt: c.createdAt.toISOString(),
  }));

  const serializablePast: LiveCallItem[] = past.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    scheduledAt: c.scheduledAt.toISOString(),
    meetingUrl: c.meetingUrl,
    replayUrl: c.replayUrl,
    isCompleted: c.isCompleted,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <LiveCallsClient
      upcomingCalls={serializableUpcoming}
      pastCalls={serializablePast}
    />
  );
}
