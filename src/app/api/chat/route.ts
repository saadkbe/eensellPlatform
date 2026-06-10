import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import OpenAI from "openai";

export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    let usage = await db.chatUsage.findUnique({
      where: { userId_month_year: { userId: dbUser.id, month, year } },
    });

    if (!usage) {
      const activeUsersThisMonth = await db.chatUsage.count({ where: { month, year } });
      if (activeUsersThisMonth >= 100) {
        return new NextResponse("Monthly global user limit reached (100 users max).", { status: 403 });
      }
      usage = await db.chatUsage.create({
        data: { userId: dbUser.id, month, year, count: 0 },
      });
    }

    if (usage.count >= 10) {
      return new NextResponse("Monthly message limit reached (10 messages max).", { status: 429 });
    }

    const { messages } = await req.json();

    await db.chatUsage.update({
      where: { id: usage.id },
      data: { count: { increment: 1 } },
    });

    const userName = dbUser.firstName || "there";
    const systemPrompt = `You are Nexus, a highly intelligent, intensely positive, and highly motivating AI mentor for Eensell University students.
You are currently talking to ${userName}. ALWAYS address them by their first name naturally in your responses!
Your primary goal is to help them overcome obstacles, stay incredibly motivated, and achieve their ultimate goal: making their first dollars online through AI and digital business.
Always maintain a positive, uplifting, and encouraging mood. Celebrate their small wins and frequently use emojis to keep the energy high! 🚀
Remind them that consistent effort leads to freedom.
Keep your business advice concise, professional, and directly actionable.
When asked to generate slides or a presentation, output the content clearly using '---' on its own line to separate each slide, and format the slide content using Markdown (headings, bullet points).`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });

  } catch (error) {
    console.error("[CHAT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
