import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { UpsertIntegrationSchema } from "@/lib/auth-definitions";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const integrations = db.integrations.listForUser(user.id);
  return NextResponse.json({ integrations });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const validated = UpsertIntegrationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const orgs = db.organizations.getUserOrganizations(user.id);
    const orgId = orgs[0]?.organization?.id;

    const integration = db.integrations.upsert({
      userId: user.id,
      organizationId: orgId,
      provider: validated.data.provider,
      name: validated.data.name,
      secretKey: validated.data.secretKey,
    });

    db.auditLogs.record({
      userId: user.id,
      action: "API_INTEGRATION_SAVED",
      details: { provider: validated.data.provider, name: validated.data.name },
    });

    return NextResponse.json({ integration }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error saving integration";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
