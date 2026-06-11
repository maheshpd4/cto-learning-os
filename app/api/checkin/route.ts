export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateJSON } from "@/lib/gemini";
import { dailyReviewPrompt } from "@/lib/prompts";
import { SkillArea } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studiedTopics,
      builtThings,
      unclearConcepts,
      codeWritten,
      blockers,
      confidenceScore,
    } = body;

    // 1. Generate AI analysis
    const prompt = dailyReviewPrompt({
      studiedTopics,
      builtThings,
      unclearConcepts,
      codeWritten,
      blockers,
      confidenceScore,
    });

    interface ReviewResult {
      summary: string;
      corrections: string;
      strengths: string[];
      weakAreas: string[];
      nextDayPlan: string[];
      suggestedPractice: string;
      interviewQuestions: string[];
      coachNote: string;
    }

    let aiResult: ReviewResult | null = null;
    let aiError: string | null = null;
    try {
      aiResult = await generateJSON<ReviewResult>(prompt);
    } catch (e) {
      aiError = e instanceof Error ? e.message : "Unknown AI error";
      console.warn("AI generation failed, saving without AI analysis:", e);
      // Fallback so the UI always has something to render
      aiResult = {
        summary: "AI analysis is currently unavailable, but your check-in was saved.",
        corrections: "",
        strengths: [],
        weakAreas: [],
        nextDayPlan: [],
        suggestedPractice: "",
        interviewQuestions: [],
        coachNote: `(AI error: ${aiError})`,
      };
    }

    // 2. Map weak areas to skill areas for tracking
    const weakAreaMap: Record<string, SkillArea> = {
      kafka: SkillArea.ENTERPRISE_INTEGRATION,
      streaming: SkillArea.DATA_PLATFORMS,
      kubernetes: SkillArea.PLATFORM_ENGINEERING,
      k8s: SkillArea.PLATFORM_ENGINEERING,
      security: SkillArea.SECURITY,
      llm: SkillArea.AI_SYSTEMS,
      rag: SkillArea.AI_SYSTEMS,
      cloud: SkillArea.CLOUD_ARCHITECTURE,
      leadership: SkillArea.PRODUCT_FINANCE_LEADERSHIP,
    };

    const detectedWeakAreas: SkillArea[] = [];
    const contentToScan = `${unclearConcepts} ${blockers || ""} ${aiResult?.weakAreas?.join(" ") || ""}`.toLowerCase();
    for (const [keyword, area] of Object.entries(weakAreaMap)) {
      if (contentToScan.includes(keyword) && !detectedWeakAreas.includes(area)) {
        detectedWeakAreas.push(area);
      }
    }

    // 3. Save check-in to DB
    const checkIn = await prisma.checkIn.create({
      data: {
        studiedTopics,
        builtThings,
        unclearConcepts,
        codeWritten: codeWritten || null,
        blockers: blockers || null,
        confidenceScore: Number(confidenceScore),
        aiSummary: aiResult ? JSON.stringify(aiResult) : null,
        aiCorrections: aiResult?.corrections || null,
        nextDayPlan: aiResult ? JSON.stringify(aiResult.nextDayPlan) : null,
        suggestedPractice: aiResult?.suggestedPractice || null,
        interviewQuestions: aiResult ? JSON.stringify(aiResult.interviewQuestions) : null,
        weakAreasDetected: detectedWeakAreas,
      },
    });

    // 4. Update daily streak
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    await prisma.dailyStreak.upsert({
      where: { date: todayDate },
      update: { completed: true },
      create: { date: todayDate, completed: true },
    });

    return NextResponse.json({ ...checkIn, aiError });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { error: "Failed to save check-in" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const checkIns = await prisma.checkIn.findMany({
      orderBy: { date: "desc" },
      take: 30,
    });
    return NextResponse.json({ checkIns });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch check-ins" }, { status: 500 });
  }
}
