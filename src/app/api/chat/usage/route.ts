import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const usage = await db.chatUsage.findUnique({
      where: {
        userId_month_year: {
          userId: dbUser.id,
          month,
          year,
        },
      },
    });

    return NextResponse.json({
      count: usage?.count || 0,
      limit: 10,
    });
  } catch (error) {
    console.error("[CHAT_USAGE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
