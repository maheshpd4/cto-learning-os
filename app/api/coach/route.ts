export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { coachReply } from "@/lib/gemini";
import { SYSTEM_PROMPT_COACH } from "@/lib/prompts";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "new_session") {
      const session = await prisma.coachSession.create({
        data: { title: `Session ${new Date().toLocaleDateString()}` },
      });
      const welcomeMsg = await prisma.coachMessage.create({
        data: {
          sessionId: session.id,
          role: "ASSISTANT",
          content: "New coaching session started. What would you like to work on today? I can help with architecture deep dives, mock interviews, code reviews, or concept explanations.",
        },
      });
      return NextResponse.json({ sessionId: session.id, messages: [welcomeMsg] });
    }

    // Default: load the latest session (or create one)
    let session = await prisma.coachSession.findFirst({
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    });

    if (!session) {
      const newSession = await prisma.coachSession.create({ data: {} });
      const welcomeMsg = await prisma.coachMessage.create({
        data: {
          sessionId: newSession.id,
          role: "ASSISTANT",
          content: "Welcome to your CTO Learning OS AI Coach! I'm here to help you on your journey to becoming an AI + Data + Cloud CTO by November 4, 2026.\n\nI can help you with:\n- **Architecture deep dives** — explain any concept at CTO level\n- **Mock interviews** — grill you on system design and leadership\n- **Code reviews** — review your practice code\n- **Daily debriefs** — ask you end-of-day questions\n- **Scenario challenges** — real-world architecture problems\n\nWhere would you like to start today?",
        },
      });
      return NextResponse.json({ sessionId: newSession.id, messages: [welcomeMsg] });
    }

    return NextResponse.json({ sessionId: session.id, messages: session.messages });
  } catch (error) {
    console.error("Coach GET error:", error);
    return NextResponse.json({ error: "Failed to load session" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get or create session
    let session = sessionId
      ? await prisma.coachSession.findUnique({
          where: { id: sessionId },
          include: { messages: { orderBy: { createdAt: "asc" }, take: 20 } },
        })
      : null;

    if (!session) {
      session = await prisma.coachSession.create({
        data: {},
        include: { messages: true },
      });
    }

    // Save user message
    await prisma.coachMessage.create({
      data: { sessionId: session.id, role: "USER", content: message },
    });

    // Build conversation history for Gemini.
    // Gemini's chat history must start with a "user" message — drop any
    // leading assistant/welcome messages so the API doesn't reject it.
    const firstUserIdx = session.messages.findIndex((msg) => msg.role === "USER");
    const relevantMessages = firstUserIdx === -1 ? [] : session.messages.slice(firstUserIdx);

    const history = relevantMessages.map((msg) => ({
      role: msg.role === "USER" ? "user" : "model" as "user" | "model",
      parts: [{ text: msg.content }],
    }));

    // The most recently saved message is the user's current message (just
    // saved above) — it shouldn't also be in the history passed to startChat.
    if (history.length > 0 && history[history.length - 1].role === "user") {
      history.pop();
    }

    // Get AI reply
    const reply = await coachReply(message, history, SYSTEM_PROMPT_COACH);

    // Save AI reply
    const aiMessage = await prisma.coachMessage.create({
      data: { sessionId: session.id, role: "ASSISTANT", content: reply },
    });

    return NextResponse.json({ reply, sessionId: session.id, messageId: aiMessage.id });
  } catch (error) {
    console.error("Coach POST error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: detail },
      { status: 500 }
    );
  }
}
