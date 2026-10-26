"use server";

import OpenAI from "openai";
import { getRoadmapDay, RoadmapDay } from "@/data/roadmap-data";
import { getCurrentUser } from "./user.actions";

export interface TaskAiRequest {
  dayNumber: number;
  question: string;
  conversationHistory?: { role: "user" | "assistant"; content: string }[];
}

/**
 * Intelligent Fallback Generator for when OpenAI API key has 0 billing credits
 * or encounters a temporary model/rate limit error.
 */
function generateCuratedCoachReply(
  roadmap: RoadmapDay,
  question: string,
  userName: string,
  fallbackNotice?: string
): string {
  const qLower = question.toLowerCase();

  let adviceBody = "";

  if (qLower.includes("step 1") || qLower.includes("first step") || qLower.includes("how to start")) {
    adviceBody = `Here is how to execute **Step 1** for **Day ${roadmap.dayNumber}**:
• **Objective:** ${roadmap.deliverables[0] || "Begin by reviewing today's strategic foundation."}
• **Action:** Open your workspace, create a dedicated document or tab for Day ${roadmap.dayNumber}, and focus solely on this deliverable before moving to step 2.
• **Pro-Tip:** Keep it minimal and functional—perfection is the enemy of execution. Allocate strictly 15–20 minutes to complete this initial deliverable.`;
  } else if (qLower.includes("pitfall") || qLower.includes("mistake") || qLower.includes("warning") || qLower.includes("avoid")) {
    adviceBody = `Here are the top pitfalls to avoid for **Day ${roadmap.dayNumber} (${roadmap.title})**:
• **Over-engineering:** Don't spend hours tweaking minor settings. Stick strictly to the estimated time of **${roadmap.estimatedTime}**.
• **Skipping Documentation:** Always save webhook URLs, API keys, or prospect notes into your CRM or notion tracker immediately.
• **Premature Optimization:** Focus on getting the deliverable to 80% completion and mark it off. Momentum creates mastery.`;
  } else if (qLower.includes("make") || qLower.includes("webhook") || qLower.includes("whatsapp") || qLower.includes("api")) {
    adviceBody = `Technical directives for **Day ${roadmap.dayNumber}**:
• **Core Focus:** ${roadmap.summary}
• **Verification:** Always run a single test trigger with test payload before chaining subsequent modules or routers.
• **Credentials Security:** Double check that your authorization tokens and headers are saved safely in your environment variables or Make.com connections tab.`;
  } else {
    adviceBody = `Here is your mission breakdown for **Day ${roadmap.dayNumber}: "${roadmap.title}"**:

• **Phase:** ${roadmap.phaseName}
• **Target Completion Time:** ${roadmap.estimatedTime}

**Action Plan:**
${roadmap.deliverables.map((d, i) => `**${i + 1}.** ${d}`).join("\n\n")}

**Coach's Directive:** Execute one item at a time. Once you verify your deliverables, tap the button to mark Day ${roadmap.dayNumber} as completed for **+50 XP**!`;
  }

  const notice = fallbackNotice
    ? `\n\n> *Note: ${fallbackNotice}*`
    : "";

  return `Hey ${userName}! 🚀\n\n${adviceBody}${notice}`;
}

export async function askTaskAiCoach({
  dayNumber,
  question,
  conversationHistory = [],
}: TaskAiRequest) {
  const user = await getCurrentUser();
  const userName = user?.firstName || "Student";
  const roadmap = getRoadmapDay(dayNumber);

  const rawKey = process.env.OPENAI_API_KEY?.trim();

  if (!rawKey) {
    return {
      success: true,
      reply: generateCuratedCoachReply(
        roadmap,
        question,
        userName,
        "OpenAI API key is pending configuration in .env; answering via Eensell Mission Engine."
      ),
    };
  }

  try {
    const openai = new OpenAI({ apiKey: rawKey });

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
3. Format output cleanly with line breaks, bullet points, and bold text. Keep answers between 2 to 4 concise paragraphs.
4. If they have a technical error, bug, or access problem that requires staff help, tell them to tap the "Report a Problem" button in the widget.`;

    const formattedHistory = conversationHistory.slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Primary model is gpt-4o (which is enabled on the project key)
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
    console.warn("[TASK_AI_COACH_OPENAI_NOTICE]", error?.status, error?.message);

    let notice = "Serving via Eensell AI Mission Engine.";
    if (error?.status === 429) {
      notice = "Your OpenAI account has 0 credits remaining (add credits at platform.openai.com/settings/organization/billing); currently answering via Eensell AI Mission Engine.";
    } else if (error?.status === 401 || error?.status === 403) {
      notice = "OpenAI key authorization restriction; currently answering via Eensell AI Mission Engine.";
    }

    // Seamless fallback so student is NEVER blocked or presented with an error
    const fallbackReply = generateCuratedCoachReply(
      roadmap,
      question,
      userName,
      notice
    );

    return {
      success: true,
      reply: fallbackReply,
    };
  }
}
