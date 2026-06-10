import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Usage Tracking and Limitations
    let usage = await db.chatUsage.findUnique({
      where: {
        userId_month_year: {
          userId: dbUser.id,
          month,
          year,
        },
      },
    });

    if (!usage) {
      // Check if global limit of 100 users for this month is reached
      const activeUsersThisMonth = await db.chatUsage.count({
        where: { month, year },
      });

      if (activeUsersThisMonth >= 100) {
        return new NextResponse("Monthly global user limit reached (100 users max).", { status: 403 });
      }

      usage = await db.chatUsage.create({
        data: {
          userId: dbUser.id,
          month,
          year,
          count: 0,
        },
      });
    }

    if (usage.count >= 10) {
      return new NextResponse("Monthly message limit reached (10 messages max).", { status: 429 });
    }

    // Parse the incoming messages
    const { messages } = await req.json();

    // Increment usage
    await db.chatUsage.update({
      where: { id: usage.id },
      data: { count: { increment: 1 } },
    });

    const userName = dbUser.firstName || "there";
    const systemPrompt = `You are Nexus, a highly intelligent, intensely positive, and highly motivating AI mentor for Eensell University students.
You are currently talking to ${userName}. ALWAYS address them by their name naturally in your responses!
Your primary goal is to help them overcome obstacles, stay incredibly motivated, and achieve their ultimate goal: making their first dollars online through AI and digital business. 
Always maintain a positive, uplifting, and encouraging mood. Celebrate their small wins and frequently use emojis to keep the energy high! Remind them that consistent effort leads to freedom. 
Keep your business advice concise, professional, and directly actionable. 
When asked to generate slides or a presentation, output the content clearly using '---' on its own line to separate each slide, and format the slide content using Markdown (headings, bullet points).`;

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error("[CHAT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
