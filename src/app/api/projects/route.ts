import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { CreateProjectSchema } from "@/lib/auth-definitions";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = db.projects.listForUser(user.id);
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CreateProjectSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const orgs = db.organizations.getUserOrganizations(user.id);
    const orgId = orgs[0]?.organization?.id;
    if (!orgId) {
      return NextResponse.json({ error: "No organization found" }, { status: 400 });
    }

    const project = db.projects.create({
      name: validated.data.name,
      description: validated.data.description,
      organizationId: orgId,
      ownerId: user.id,
      containerRuntime: validated.data.containerRuntime,
      cluster: validated.data.cluster,
      gitRepoUrl: validated.data.gitRepoUrl,
    });

    db.auditLogs.record({
      userId: user.id,
      organizationId: orgId,
      projectId: project.id,
      action: "API_PROJECT_CREATED",
      details: { name: project.name },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
