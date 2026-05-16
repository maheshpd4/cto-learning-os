import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, status, notes } = await request.json();

    let newStatus: string | undefined;

    if (action === "toggle") {
      const task = await prisma.dailyTask.findUnique({ where: { id: params.id } });
      if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
      newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    } else if (status) {
      newStatus = status;
    }

    const updated = await prisma.dailyTask.update({
      where: { id: params.id },
      data: {
        status: newStatus as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED",
        completedAt: newStatus === "COMPLETED" ? new Date() : null,
        ...(notes && { notes }),
      },
    });

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error("Task update error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
