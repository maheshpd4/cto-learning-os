import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateJSON } from "@/lib/gemini";
import { practiceExercisePrompt } from "@/lib/prompts";
import { SkillArea } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { concept, skillArea } = await request.json();

    if (!concept?.trim()) {
      return NextResponse.json({ error: "concept is required" }, { status: 400 });
    }

    const prompt = practiceExercisePrompt(concept, skillArea || "ENTERPRISE_INTEGRATION");

    interface ExerciseResult {
      concept: string;
      beginnerTask: string;
      beginnerHints: string[];
      intermediateTask: string;
      intermediateHints: string[];
      architectTask: string;
      sampleCode: string;
      expectedOutput: string;
      realWorldScenario: string;
      interviewQuestion: string;
      interviewAnswer: string;
    }

    const exercise = await generateJSON<ExerciseResult>(prompt);

    // Optionally cache the exercise in DB
    try {
      await prisma.practiceExercise.create({
        data: {
          concept: exercise.concept || concept,
          skillArea: (skillArea as SkillArea) || SkillArea.ENTERPRISE_INTEGRATION,
          beginnerTask: exercise.beginnerTask || "",
          intermediateTask: exercise.intermediateTask || "",
          architectTask: exercise.architectTask || "",
          sampleCode: exercise.sampleCode || null,
          expectedOutput: exercise.expectedOutput || null,
          interviewQ: exercise.interviewQuestion || null,
        },
      });
    } catch {
      // Caching is best-effort
    }

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Practice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate practice exercise. Check your GEMINI_API_KEY." },
      { status: 500 }
    );
  }
}
