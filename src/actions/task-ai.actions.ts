"use server";

import OpenAI from "openai";
import { getRoadmapDay } from "@/data/roadmap-data";
import { getCurrentUser } from "./user.actions";

export interface TaskAiRequest {
  dayNumber: number;
  question: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
}

export async function askTaskAiCoach({
  dayNumber,
  question,
  conversationHistory = [],
}: TaskAiRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        reply: "AI API Key is not configured on the server. Please contact admin.",
      };
    }

    const user = await getCurrentUser();
    const userName = user?.firstName || "there";

    const roadmap = getRoadmapDay(dayNumber);

    const openai = new OpenAI({ apiKey });

    const systemPrompt = `You are the Eensell University AI Mission Coach for the 60-Day AI Automation Agency Challenge.
You are coaching ${userName}. Always address them by their name naturally.
Current Active Task: Day ${roadmap.dayNumber}: "${roadmap.title}"
Phase: ${roadmap.phaseName}
Estimated Execution Time: ${roadmap.estimatedTime}
Mission Summary: ${roadmap.summary}
Deliverables for today:
${roadmap.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n")}

Guidelines:
1. Provide punchy, hyper-actionable, and motivating advice specifically about Day ${roadmap.dayNumber}.
2. If they ask about technical setup (Make.com scenarios, webhooks, WhatsApp Cloud API, AI prompt engineering, cold outreach, pricing), give clear, concise steps.
3. Format output cleanly with line breaks, bullet points, and bold text. Keep answers between 2 to 4 concise paragraphs so they are comfortable to read on mobile and desktop.
4. If they have a technical error, bug, or access problem that requires staff help, tell them to tap the "Report a Problem" button in the widget.`;

    const formattedHistory = conversationHistory.slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedHistory,
        { role: "user", content: question },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const reply =
      response.choices[0]?.message?.content ||
      "I am ready to help you execute today's task. What specific question do you have?";

    return { success: true, reply };
  } catch (error: any) {
    console.error("[TASK_AI_COACH_ERROR]", error);
    return {
      success: false,
      error: error.message || "AI Coach encountered an error",
      reply:
        "I couldn't reach the OpenAI service right now. Please verify your connection or click 'Report a Problem' to alert the admin team directly.",
    };
  }
}
