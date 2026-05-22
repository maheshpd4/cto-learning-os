export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SkillArea, MaterialType, Difficulty, MaterialStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skillArea = searchParams.get("skillArea");
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  try {
    const materials = await prisma.material.findMany({
      where: {
        ...(skillArea && skillArea !== "ALL" && { skillArea: skillArea as SkillArea }),
        ...(status && status !== "ALL" && { status: status as MaterialStatus }),
        ...(type && type !== "ALL" && { type: type as MaterialType }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ materials });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, type, notes, skillArea, phase, difficulty, status, tags } = body;

    if (!title || !type || !skillArea) {
      return NextResponse.json({ error: "title, type, and skillArea are required" }, { status: 400 });
    }

    const material = await prisma.material.create({
      data: {
        title,
        url: url || null,
        type: type as MaterialType,
        notes: notes || null,
        skillArea: skillArea as SkillArea,
        phase: phase ? Number(phase) : null,
        difficulty: (difficulty as Difficulty) || Difficulty.INTERMEDIATE,
        status: (status as MaterialStatus) || MaterialStatus.NOT_STARTED,
        tags: tags || [],
      },
    });

    return NextResponse.json({ material }, { status: 201 });
  } catch (error) {
    console.error("Material create error:", error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
