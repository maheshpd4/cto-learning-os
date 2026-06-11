// ============================================================
// CTO Learning OS — AI Provider Abstraction
// Provider: Google Gemini 1.5 Flash (free tier)
// To swap: only change this file
// ============================================================

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  GEMINI_API_KEY not set. AI features will return mock responses.");
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

// ── Mock responses for when API key is not set ────────────────
const MOCK_CHAT_RESPONSE = `I'm your CTO Coach! To enable real AI coaching, please add your **GEMINI_API_KEY** to the \`.env.local\` file.

Get a free API key at: https://aistudio.google.com/app/apikey

In the meantime, here's a practice question:

**System Design Challenge:**
Design a distributed message queue that handles 1 million messages per second with at-least-once delivery guarantees. Walk me through your approach.

Consider: partitioning, replication, consumer groups, and failure handling.`;

// ── Core text generation ──────────────────────────────────────
export async function generateText(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  if (!genAI) return MOCK_CHAT_RESPONSE;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemInstruction || undefined,
      safetySettings,
      generationConfig,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`AI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ── JSON-structured generation ────────────────────────────────
export async function generateJSON<T>(
  prompt: string,
  systemInstruction?: string
): Promise<T> {
  if (!genAI) {
    throw new Error("AI generation failed: GEMINI_API_KEY is not configured");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: systemInstruction || undefined,
      safetySettings,
      generationConfig: { ...generationConfig, temperature: 0.3 },
    });

    const fullPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, just the JSON object.`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Strip markdown code blocks if present
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Gemini JSON generation error:", error);
    throw new Error(`AI JSON generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ── Multi-turn chat session ───────────────────────────────────
export async function createChatSession(systemInstruction: string) {
  if (!genAI) {
    return {
      sendMessage: async (message: string) => MOCK_CHAT_RESPONSE,
    };
  }

  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction,
    safetySettings,
    generationConfig,
  });

  const chat = model.startChat({ history: [] });

  return {
    sendMessage: async (message: string): Promise<string> => {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    },
  };
}

// ── Single-shot coach message (stateless — history from DB) ──
export async function coachReply(
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>,
  systemInstruction: string
): Promise<string> {
  if (!genAI) return MOCK_CHAT_RESPONSE;

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction,
      safetySettings,
      generationConfig,
    });

    const chat = model.startChat({ history: conversationHistory });
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Coach reply error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Coach is unavailable right now: ${detail}`);
  }
}

// ── Format Gemini markdown to be chat-friendly ────────────────
export function formatAIResponse(text: string): string {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .trim();
}
