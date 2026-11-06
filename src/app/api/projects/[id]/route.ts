import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await db.projects.findById(id);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Authorization check
  const userProjects = await db.projects.listForUser(user.id);
  if (!userProjects.some((p) => p.id === id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const agentRuns = await db.agentRuns.listForProject(id);
  const deployments = await db.deployments.listForProject(id);

  return NextResponse.json({ project, agentRuns, deployments });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await db.projects.findById(id);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Only owner or admin can update
  if (project.ownerId !== user.id && user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const updated = await db.projects.update(id, body);

    await db.auditLogs.record({
      userId: user.id,
      projectId: id,
      action: "API_PROJECT_UPDATED",
      details: body,
    });

    return NextResponse.json({ project: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await db.projects.findById(id);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  if (project.ownerId !== user.id && user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.projects.delete(id);
  await db.auditLogs.record({
    userId: user.id,
    projectId: id,
    action: "API_PROJECT_DELETED",
    details: { name: project.name },
  });

  return NextResponse.json({ message: "Project deleted successfully" });
}
