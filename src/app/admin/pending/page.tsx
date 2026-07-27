import { db } from "@/lib/db";
import { PendingList } from "@/components/admin/pending-list";
import { Clock } from "lucide-react";

export default async function AdminPendingPage() {
  const pending = await db.user.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 pb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] p-8 sm:p-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.08] via-transparent to-amber-500/[0.05]" />
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/8 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-4 border border-amber-500/20 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Pending Approvals</h1>
          <p className="text-white/40 text-sm sm:text-base max-w-xl leading-relaxed">Review and approve new user registrations.</p>
        </div>
      </div>
      <PendingList initialUsers={pending.map(u => ({ ...u, createdAt: u.createdAt }))} />
    </div>
  );
}
