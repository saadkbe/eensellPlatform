import { getAdminReferralStats } from "@/actions/referral.actions";
import { AdminReferralClient } from "@/components/admin/referrals/admin-referral-client";

export const metadata = {
  title: "Referral Management | Admin",
};

export default async function AdminReferralsPage() {
  const data = await getAdminReferralStats();

  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Referrals & Affiliates</h1>
        <p className="text-muted-foreground mt-2">
          Monitor referral performance, adjust commissions, and manage payouts.
        </p>
      </div>

      <AdminReferralClient initialData={data} />
    </div>
  );
}
