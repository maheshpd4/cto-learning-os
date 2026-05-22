export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const body = await request.json();
    const task = await prisma.projectTask.update({
      where: { id: params.taskId },
      data: {
        ...body,
        completedAt: body.status === "COMPLETED" ? new Date() : null,
      },
    });

    // Recompute project completion percentage
    const allTasks = await prisma.projectTask.findMany({
      where: { projectId: params.id },
    });
    const completedCount = allTasks.filter((t) => t.status === "COMPLETED").length;
    const pct = allTasks.length > 0 ? (completedCount / allTasks.length) * 100 : 0;

    await prisma.project.update({
      where: { id: params.id },
      data: { completionPct: Math.round(pct) },
    });

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
