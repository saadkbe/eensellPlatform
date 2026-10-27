import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, voiceId: customVoiceId } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
      include: { workspaceAccount: true },
    });

    const apiKey =
      user?.workspaceAccount?.elevenLabsApiKey || process.env.ELEVENLABS_API_KEY;
    const voiceId =
      customVoiceId ||
      user?.workspaceAccount?.voiceId ||
      "21m00Tcm4TlvDq8ikWAM"; // Default Rachel voice

    // If no API key configured, signal fallback to browser Web Speech API
    if (!apiKey) {
      return NextResponse.json({
        useWebSpeech: true,
        message: "No ElevenLabs API key found. Using high-fidelity native Web Speech synthesis.",
      });
    }

    // Call ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.warn("ElevenLabs error, falling back to Web Speech:", err);
      return NextResponse.json({
        useWebSpeech: true,
        error: "ElevenLabs API quota or key issue. Falling back to native voice.",
      });
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Workspace voice route error:", error);
    return NextResponse.json(
      { useWebSpeech: true, error: error.message },
      { status: 200 }
    );
  }
}
