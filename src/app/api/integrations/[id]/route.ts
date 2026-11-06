import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.integrations.delete(id, user.id);

  await db.auditLogs.record({
    userId: user.id,
    action: "API_INTEGRATION_DELETED",
    details: { integrationId: id },
  });

  return NextResponse.json({ message: "Integration removed successfully" });
}
