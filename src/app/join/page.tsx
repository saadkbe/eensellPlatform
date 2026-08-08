import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const referralCode = searchParams.ref;

  if (referralCode && typeof referralCode === "string") {
    // Store the referral code in a secure, HTTP-only cookie for 30 days
    const cookieStore = await cookies();
    cookieStore.set("eensell_ref", referralCode, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  }

  // Redirect the user to the signup page
  redirect("/sign-up");
}
