import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateJSON } from "@/lib/gemini";
import { resumeBulletPrompt } from "@/lib/prompts";
import { SKILL_LABELS } from "@/lib/utils";

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { tasks: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const technologies = project.skillAreas.map((a) => SKILL_LABELS[a] || a);
    const completedTasks = project.tasks.filter((t) => t.status === "COMPLETED");

    const prompt = resumeBulletPrompt({
      title: project.title,
      description: project.description,
      technologies,
      impact: completedTasks.length > 0
        ? `Completed ${completedTasks.length} implementation tasks`
        : "Architecture and design work",
    });

    interface BulletResult {
      bullets: string[];
      linkedinSummary: string;
    }

    const result = await generateJSON<BulletResult>(prompt);
    const bullet = result.bullets?.[0] || "";

    if (bullet) {
      await prisma.project.update({
        where: { id: params.id },
        data: { resumeBullet: bullet },
      });
    }

    return NextResponse.json({ bullet, bullets: result.bullets, linkedinSummary: result.linkedinSummary });
  } catch (error) {
    console.error("Resume bullet error:", error);
    return NextResponse.json({ error: "Failed to generate resume bullet" }, { status: 500 });
  }
}
