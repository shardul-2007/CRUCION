"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import {
  CreateProjectSchema,
  UpsertIntegrationSchema,
  InviteMemberSchema,
  ActionResponse,
} from "@/lib/auth-definitions";

// -------------------------------------------------------------
// PROJECTS
// -------------------------------------------------------------
export async function createProjectAction(formData: FormData): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized. Please sign in." };

  const validated = CreateProjectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    containerRuntime: formData.get("containerRuntime") || "Node 24 / V8",
    cluster: formData.get("cluster") || "us-east-metal",
    gitRepoUrl: formData.get("gitRepoUrl") || undefined,
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Invalid project parameters.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const orgs = db.organizations.getUserOrganizations(user.id);
  const orgId = orgs[0]?.organization?.id;
  if (!orgId) {
    return { success: false, message: "No active organization found." };
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
    action: "PROJECT_CREATED",
    details: { name: project.name, runtime: project.containerRuntime },
  });

  revalidatePath("/dashboard");
  return {
    success: true,
    message: `Project "${project.name}" provisioned successfully in ${project.cluster}.`,
    data: project,
  };
}

export async function deleteProjectAction(projectId: string): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized." };

  const project = db.projects.findById(projectId);
  if (!project) return { success: false, message: "Project not found." };

  // Authorization check: only owner or org admin can delete
  if (project.ownerId !== user.id && user.role !== "ADMIN" && user.role !== "SUPERADMIN") {
    return { success: false, message: "Permission denied. Only the project owner can delete this project." };
  }

  db.projects.delete(projectId);
  db.auditLogs.record({
    userId: user.id,
    organizationId: project.organizationId,
    projectId: project.id,
    action: "PROJECT_DELETED",
    details: { name: project.name },
  });

  revalidatePath("/dashboard");
  return { success: true, message: `Project "${project.name}" deleted successfully.` };
}

// -------------------------------------------------------------
// ORGANIZATIONS
// -------------------------------------------------------------
export async function createOrganizationAction(formData: FormData): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized." };

  const name = ((formData.get("name") as string) || "").trim();
  const description = (formData.get("description") as string) || undefined;

  if (name.length < 2) {
    return { success: false, message: "Organization name must be at least 2 characters." };
  }

  const org = db.organizations.create({
    name,
    userId: user.id,
    description,
  });

  db.auditLogs.record({
    userId: user.id,
    organizationId: org.id,
    action: "ORG_CREATED",
    details: { name: org.name },
  });

  revalidatePath("/dashboard");
  return { success: true, message: `Organization "${org.name}" created.`, data: org };
}

export async function inviteOrgMemberAction(formData: FormData): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized." };

  const orgId = formData.get("organizationId") as string;
  const validated = InviteMemberSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role") || "MEMBER",
  });

  if (!validated.success || !orgId) {
    return { success: false, message: "Invalid invitation data." };
  }

  try {
    const member = db.organizations.addMember({
      organizationId: orgId,
      email: validated.data.email,
      role: validated.data.role,
    });

    db.auditLogs.record({
      userId: user.id,
      organizationId: orgId,
      action: "ORG_MEMBER_INVITED",
      details: { email: validated.data.email, role: validated.data.role },
    });

    revalidatePath("/dashboard");
    return { success: true, message: `Invited ${validated.data.email} as ${validated.data.role}.`, data: member };
  } catch (e: unknown) {
    return { success: false, message: e instanceof Error ? e.message : "Failed to invite member." };
  }
}

export async function removeOrgMemberAction(orgId: string, memberId: string): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized." };

  db.organizations.removeMember(orgId, memberId);
  db.auditLogs.record({
    userId: user.id,
    organizationId: orgId,
    action: "ORG_MEMBER_REMOVED",
    details: { memberId },
  });

  revalidatePath("/dashboard");
  return { success: true, message: "Member removed from organization." };
}

// -------------------------------------------------------------
// CONNECTED SERVICES & ENCRYPTED INTEGRATIONS
// -------------------------------------------------------------
export async function upsertIntegrationAction(formData: FormData): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized." };

  const validated = UpsertIntegrationSchema.safeParse({
    provider: formData.get("provider"),
    name: formData.get("name"),
    secretKey: formData.get("secretKey"),
  });

  if (!validated.success) {
    return {
      success: false,
      message: "Please enter a valid provider and non-empty secret key.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { provider, name, secretKey } = validated.data;
  const orgs = db.organizations.getUserOrganizations(user.id);
  const orgId = orgs[0]?.organization?.id;

  const result = db.integrations.upsert({
    userId: user.id,
    organizationId: orgId,
    provider,
    name,
    secretKey,
  });

  db.auditLogs.record({
    userId: user.id,
    organizationId: orgId,
    action: "INTEGRATION_CONFIGURED",
    details: { provider, name, keyHint: result.keyHint },
  });

  revalidatePath("/dashboard");
  return {
    success: true,
    message: `Connected ${name} (${provider}) with AES-256 encrypted credentials.`,
    data: result,
  };
}

export async function deleteIntegrationAction(integrationId: string): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized." };

  db.integrations.delete(integrationId, user.id);
  db.auditLogs.record({
    userId: user.id,
    action: "INTEGRATION_DISCONNECTED",
    details: { integrationId },
  });

  revalidatePath("/dashboard");
  return { success: true, message: "Integration disconnected and secret purged." };
}

// -------------------------------------------------------------
// AGENT OS DISPATCH (COGNITIVE WORKFORCE)
// -------------------------------------------------------------
export async function dispatchAgentAction(params: {
  projectId: string;
  taskTitle: string;
  role: string;
  model: string;
}): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Unauthorized." };

  const project = db.projects.findById(params.projectId);
  if (!project) return { success: false, message: "Project not found." };

  // Check if provider key is configured
  let provider = "OPENAI";
  if (params.model.toLowerCase().includes("claude")) provider = "ANTHROPIC";
  else if (params.model.toLowerCase().includes("gemini")) provider = "GOOGLE_GEMINI";
  else if (params.model.toLowerCase().includes("ollama")) provider = "OLLAMA";

  const keyConfigured = db.integrations.getKeyForProvider(user.id, provider);

  const run = db.agentRuns.create({
    projectId: params.projectId,
    userId: user.id,
    agentName: `CrucionBot-${Math.floor(100 + Math.random() * 900)}`,
    role: params.role,
    taskTitle: params.taskTitle,
    model: params.model,
  });

  db.auditLogs.record({
    userId: user.id,
    projectId: params.projectId,
    action: "AGENT_DISPATCHED",
    details: {
      task: params.taskTitle,
      role: params.role,
      model: params.model,
      credentialsConfigured: !!keyConfigured,
    },
  });

  revalidatePath("/dashboard");
  return {
    success: true,
    message: `Agent dispatched for task: "${params.taskTitle}"`,
    data: run,
  };
}
