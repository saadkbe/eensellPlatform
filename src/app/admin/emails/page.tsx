import { db } from "@/lib/db";
import { EmailComposer } from "@/components/admin/email-composer";
import { Mail } from "lucide-react";

export default async function AdminEmailsPage() {
  const activeUsers = await db.user.findMany({
    where: { status: "ACTIVE" },
    select: { email: true },
  });

  return (
    <div className="space-y-8 pb-8">
      {/* ── Premium Header ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-8 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.08] via-transparent to-blue-500/[0.05]" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 text-xs font-medium mb-4 border border-sky-500/20">
              <Mail className="w-3.5 h-3.5" />
              <span>Email Campaigns</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Email Broadcasts
            </h1>
            <p className="text-white/40 text-base max-w-xl">
              Send updates, announcements, and newsletters to all active students.
            </p>
          </div>
        </div>
      </div>

      <EmailComposer activeEmails={activeUsers.map((u) => u.email)} />
    </div>
  );
}
