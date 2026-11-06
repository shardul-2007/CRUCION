import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgs = db.organizations.getUserOrganizations(user.id);
  return NextResponse.json({ organizations: orgs });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    if (name.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    const org = db.organizations.create({
      name,
      userId: user.id,
      description: body.description,
    });

    db.auditLogs.record({
      userId: user.id,
      organizationId: org.id,
      action: "API_ORG_CREATED",
      details: { name: org.name },
    });

    return NextResponse.json({ organization: org }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Creation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
