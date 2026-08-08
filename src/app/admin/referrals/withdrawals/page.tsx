import { getAdminWithdrawals } from "@/actions/referral.actions";
import { AdminWithdrawalsClient } from "@/components/admin/referrals/admin-withdrawals-client";

export const metadata = {
  title: "Withdrawal Requests | Admin",
};

export default async function AdminWithdrawalsPage() {
  const withdrawals = await getAdminWithdrawals();

  return (
    <div className="flex-1 w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Withdrawal Requests</h1>
        <p className="text-muted-foreground mt-2">
          Process student payout requests securely.
        </p>
      </div>

      <AdminWithdrawalsClient initialData={withdrawals} />
    </div>
  );
}
