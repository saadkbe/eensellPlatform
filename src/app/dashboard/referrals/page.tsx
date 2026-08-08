import { getStudentReferralStats } from "@/actions/referral.actions";
import { StudentReferralClient } from "@/components/dashboard/referrals/student-referral-client";

export const metadata = {
  title: "Referrals | Eensell University",
  description: "Manage your referrals and commissions",
};

export default async function ReferralsPage() {
  const data = await getStudentReferralStats();

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Refer & Earn ??</h1>
        <p className="text-muted-foreground mt-2">
          Invite your friends to Eensell University and earn 50 MAD for every successful enrollment.
        </p>
      </div>

      <StudentReferralClient initialData={data} />
    </div>
  );
}
