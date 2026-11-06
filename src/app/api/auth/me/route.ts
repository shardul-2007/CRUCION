import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizations = db.organizations.getUserOrganizations(user.id);
  const projects = db.projects.listForUser(user.id);
  const integrations = db.integrations.listForUser(user.id);

  return NextResponse.json({
    user,
    organizations,
    projectCount: projects.length,
    activeIntegrations: integrations.length,
  });
}
