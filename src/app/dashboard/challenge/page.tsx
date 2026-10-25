import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/user.actions";
import { getUserChallengeProgress } from "@/actions/challenge.actions";
import { ChallengeClient } from "./challenge-client";

export const dynamic = "force-dynamic";

export default async function ChallengePage() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const challengeProgress = await getUserChallengeProgress();

  return (
    <ChallengeClient
      initialCompletedDays={challengeProgress.completedDays}
      initialUserXp={challengeProgress.userXp}
    />
  );
}
