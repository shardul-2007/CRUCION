import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  User,
  Session,
  Organization,
  OrganizationMember,
  Project,
  ProjectMember,
  Integration,
  AuditLog,
  AgentRun,
  Deployment,
  UserRole,
  OrgRole,
  OrgPlan,
  MemberStatus,
  ProjectRole,
  ProjectStatus,
  ProjectHealth,
  IntegrationProvider,
  IntegrationStatus,
  AgentStatus,
  DeploymentStatus,
} from "@prisma/client";
import { encryptSecret, decryptSecret, createKeyHint } from "./crypto";

// Export Prisma models & enums for strong type safety
export type {
  User,
  Session,
  Organization,
  OrganizationMember,
  Project,
  ProjectMember,
  Integration,
  AuditLog,
  AgentRun,
  Deployment,
};
export {
  UserRole,
  OrgRole,
  OrgPlan,
  MemberStatus,
  ProjectRole,
  ProjectStatus,
  ProjectHealth,
  IntegrationProvider,
  IntegrationStatus,
  AgentStatus,
  DeploymentStatus,
};

// Global singleton pattern to avoid connection exhaustion in serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function sanitizeDatabaseUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.delete("channel_binding");
    if (!parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require");
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const rawUrl =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!rawUrl) {
    throw new Error(
      "CRUCION Database Error: DATABASE_URL is not configured. Please configure your PostgreSQL connection string in environment variables."
    );
  }

  const connectionString = sanitizeDatabaseUrl(rawUrl);

  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }

  const adapter = new PrismaPg(globalForPrisma.pgPool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

// Slugs generator utility
function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "item"
  );
}

// Ensure local environment variables are loaded in test / script runners if not already set
if (typeof process !== "undefined" && !process.env.DATABASE_URL && !process.env.POSTGRES_PRISMA_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("dotenv").config({ path: ".env.local" });
  } catch {
    // Environment variables already provided by hosting runtime
  }
}

// =============================================================
// CRUCION PRODUCTION DATABASE REPOSITORY
// Genuine PostgreSQL storage via Prisma with zero filesystem writes
// =============================================================

export const db = {
  // -----------------------------------------------------------
  // USERS & IDENTITY
  // -----------------------------------------------------------
  users: {
    async findByEmail(email: string): Promise<User | null> {
      const prisma = getPrisma();
      return prisma.user.findFirst({
        where: {
          email: { equals: email.trim().toLowerCase(), mode: "insensitive" },
          isActive: true,
        },
      });
    },

    async findById(id: string): Promise<User | null> {
      const prisma = getPrisma();
      return prisma.user.findUnique({
        where: { id, isActive: true },
      });
    },

    async findByVerificationToken(token: string): Promise<User | null> {
      const prisma = getPrisma();
      const user = await prisma.user.findUnique({
        where: { verificationToken: token, isActive: true },
      });
      if (!user) return null;
      if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
        return null;
      }
      return user;
    },

    async findByResetToken(token: string): Promise<User | null> {
      const prisma = getPrisma();
      const user = await prisma.user.findUnique({
        where: { resetToken: token, isActive: true },
      });
      if (!user) return null;
      if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
        return null;
      }
      return user;
    },

    /**
     * Complete registration with transaction: creates User, Organization, and Owner Member
     */
    async create(params: {
      email: string;
      name: string;
      passwordHash: string;
      role?: UserRole;
      organizationName?: string;
    }): Promise<{ user: User; organization: Organization }> {
      const prisma = getPrisma();
      const normalizedEmail = params.email.trim().toLowerCase();

      // Check for existing account
      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (existing) {
        throw new Error("An account with this email address already exists. Please sign in.");
      }

      const initials =
        params.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "CR";

      const orgName = params.organizationName?.trim() || `${params.name.trim()}'s Workspace`;
      const baseSlug = slugify(orgName);
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

      // Atomic PostgreSQL transaction ensuring consistent creation
      return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: normalizedEmail,
            name: params.name.trim(),
            passwordHash: params.passwordHash,
            role: params.role || UserRole.USER,
            avatarInitials: initials,
            emailVerified: false,
            isActive: true,
          },
        });

        const organization = await tx.organization.create({
          data: {
            name: orgName,
            slug: uniqueSlug,
            plan: OrgPlan.PRO,
          },
        });

        await tx.organizationMember.create({
          data: {
            organizationId: organization.id,
            userId: user.id,
            role: OrgRole.OWNER,
            status: MemberStatus.ACTIVE,
          },
        });

        return { user, organization };
      });
    },

    async verifyEmail(userId: string): Promise<User> {
      const prisma = getPrisma();
      return prisma.user.update({
        where: { id: userId },
        data: {
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });
    },

    async setVerificationToken(userId: string, token: string, expiry: Date): Promise<User> {
      const prisma = getPrisma();
      return prisma.user.update({
        where: { id: userId },
        data: {
          verificationToken: token,
          verificationTokenExpiry: expiry,
        },
      });
    },

    async setResetToken(email: string, token: string, expiry: Date): Promise<User | null> {
      const prisma = getPrisma();
      const user = await prisma.user.findFirst({
        where: { email: { equals: email.trim().toLowerCase(), mode: "insensitive" } },
      });
      if (!user) return null;

      return prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry,
        },
      });
    },

    async updatePassword(userId: string, passwordHash: string): Promise<User> {
      const prisma = getPrisma();
      return prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
    },

    async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }): Promise<User> {
      const prisma = getPrisma();
      return prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name ? { name: data.name.trim() } : {}),
          ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
        },
      });
    },

    async updateLastLogin(userId: string): Promise<User> {
      const prisma = getPrisma();
      return prisma.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      });
    },

    async deleteAccount(userId: string): Promise<void> {
      const prisma = getPrisma();
      await prisma.user.delete({
        where: { id: userId },
      });
    },
  },

  // -----------------------------------------------------------
  // SESSIONS
  // -----------------------------------------------------------
  sessions: {
    async create(params: {
      userId: string;
      token: string;
      expiresAt: Date;
      ipAddress?: string;
      userAgent?: string;
    }): Promise<Session> {
      const prisma = getPrisma();
      return prisma.session.create({
        data: {
          userId: params.userId,
          token: params.token,
          expiresAt: params.expiresAt,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    },

    async findByToken(token: string): Promise<(Session & { user: User }) | null> {
      const prisma = getPrisma();
      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (!session) return null;
      if (session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
        return null;
      }
      return session;
    },

    async delete(token: string): Promise<void> {
      const prisma = getPrisma();
      await prisma.session.deleteMany({
        where: { token },
      });
    },

    async deleteForUser(userId: string): Promise<void> {
      const prisma = getPrisma();
      await prisma.session.deleteMany({
        where: { userId },
      });
    },
  },

  // -----------------------------------------------------------
  // ORGANIZATIONS & MEMBERSHIPS
  // -----------------------------------------------------------
  organizations: {
    async create(params: {
      name: string;
      userId: string;
      plan?: OrgPlan;
      description?: string;
    }): Promise<Organization> {
      const prisma = getPrisma();
      const baseSlug = slugify(params.name);
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

      return prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name: params.name.trim(),
            slug: uniqueSlug,
            description: params.description,
            plan: params.plan || OrgPlan.PRO,
          },
        });

        await tx.organizationMember.create({
          data: {
            organizationId: org.id,
            userId: params.userId,
            role: OrgRole.OWNER,
            status: MemberStatus.ACTIVE,
          },
        });

        return org;
      });
    },

    async findById(id: string): Promise<Organization | null> {
      const prisma = getPrisma();
      return prisma.organization.findUnique({
        where: { id },
      });
    },

    async findBySlug(slug: string): Promise<Organization | null> {
      const prisma = getPrisma();
      return prisma.organization.findUnique({
        where: { slug },
      });
    },

    async getUserOrganizations(userId: string): Promise<
      Array<Organization & { role: string; memberCount: number; projectCount: number }>
    > {
      const prisma = getPrisma();
      const memberships = await prisma.organizationMember.findMany({
        where: { userId, status: MemberStatus.ACTIVE },
        include: {
          organization: {
            include: {
              _count: {
                select: {
                  members: true,
                  projects: true,
                },
              },
            },
          },
        },
      });

      return memberships.map((m) => ({
        ...m.organization,
        role: m.role,
        memberCount: m.organization._count.members,
        projectCount: m.organization._count.projects,
      }));
    },

    async addMember(params: {
      organizationId: string;
      userId?: string;
      invitedEmail?: string;
      role?: OrgRole;
    }): Promise<OrganizationMember> {
      const prisma = getPrisma();
      return prisma.organizationMember.create({
        data: {
          organizationId: params.organizationId,
          userId: params.userId,
          invitedEmail: params.invitedEmail,
          role: params.role || OrgRole.MEMBER,
          status: params.userId ? MemberStatus.ACTIVE : MemberStatus.INVITED,
        },
      });
    },

    async removeMember(organizationId: string, memberId: string): Promise<void> {
      const prisma = getPrisma();
      await prisma.organizationMember.deleteMany({
        where: {
          id: memberId,
          organizationId,
          role: { not: OrgRole.OWNER }, // Protect owner from accidental deletion
        },
      });
    },

    async getMembers(organizationId: string): Promise<Array<OrganizationMember & { user?: User | null }>> {
      const prisma = getPrisma();
      return prisma.organizationMember.findMany({
        where: { organizationId },
        include: { user: true },
        orderBy: { createdAt: "asc" },
      });
    },
  },

  // -----------------------------------------------------------
  // PROJECTS & WORKSPACES
  // -----------------------------------------------------------
  projects: {
    async create(params: {
      name: string;
      organizationId: string;
      ownerId: string;
      description?: string;
      gitRepoUrl?: string;
      gitBranch?: string;
      containerRuntime?: string;
      cluster?: string;
    }): Promise<Project> {
      const prisma = getPrisma();
      const baseSlug = slugify(params.name);
      const uniqueSlug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

      return prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
          data: {
            name: params.name.trim(),
            slug: uniqueSlug,
            description: params.description,
            organizationId: params.organizationId,
            ownerId: params.ownerId,
            containerRuntime: params.containerRuntime || "Node 24 / V8",
            gitRepoUrl: params.gitRepoUrl,
            gitBranch: params.gitBranch || "main",
            cluster: params.cluster || "us-east-metal",
            status: ProjectStatus.ACTIVE,
            health: ProjectHealth.OPTIMAL,
          },
        });

        // Add owner as Lead Project Member
        await tx.projectMember.create({
          data: {
            projectId: project.id,
            userId: params.ownerId,
            role: ProjectRole.LEAD,
          },
        });

        return project;
      });
    },

    async findById(id: string): Promise<Project | null> {
      const prisma = getPrisma();
      return prisma.project.findUnique({
        where: { id },
      });
    },

    async listForUser(userId: string): Promise<Project[]> {
      const prisma = getPrisma();
      // Returns projects where user is owner or explicit project member
      return prisma.project.findMany({
        where: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
            { organization: { members: { some: { userId, status: MemberStatus.ACTIVE } } } },
          ],
        },
        orderBy: { updatedAt: "desc" },
      });
    },

    async listForOrg(organizationId: string): Promise<Project[]> {
      const prisma = getPrisma();
      return prisma.project.findMany({
        where: { organizationId },
        orderBy: { updatedAt: "desc" },
      });
    },

    async update(id: string, data: Partial<Project>): Promise<Project> {
      const prisma = getPrisma();
      return prisma.project.update({
        where: { id },
        data: {
          ...(data.name ? { name: data.name.trim() } : {}),
          ...(data.description !== undefined ? { description: data.description } : {}),
          ...(data.gitRepoUrl !== undefined ? { gitRepoUrl: data.gitRepoUrl } : {}),
          ...(data.gitBranch ? { gitBranch: data.gitBranch } : {}),
          ...(data.containerRuntime ? { containerRuntime: data.containerRuntime } : {}),
          ...(data.status ? { status: data.status } : {}),
          ...(data.health ? { health: data.health } : {}),
          ...(data.cluster ? { cluster: data.cluster } : {}),
          ...(data.liveUrl !== undefined ? { liveUrl: data.liveUrl } : {}),
        },
      });
    },

    async delete(id: string): Promise<void> {
      const prisma = getPrisma();
      await prisma.project.delete({
        where: { id },
      });
    },
  },

  // -----------------------------------------------------------
  // CONNECTED SERVICES & ENCRYPTED INTEGRATIONS
  // -----------------------------------------------------------
  integrations: {
    async upsert(params: {
      userId: string;
      provider: IntegrationProvider;
      name: string;
      secret: string;
      organizationId?: string;
      configJson?: string;
    }): Promise<Integration> {
      const prisma = getPrisma();
      const encryptedSecret = encryptSecret(params.secret);
      const keyHint = createKeyHint(params.secret);

      // Check if existing integration for this user and provider exists
      const existing = await prisma.integration.findFirst({
        where: {
          userId: params.userId,
          provider: params.provider,
        },
      });

      if (existing) {
        return prisma.integration.update({
          where: { id: existing.id },
          data: {
            name: params.name,
            encryptedSecret,
            keyHint,
            status: IntegrationStatus.ACTIVE,
            lastValidatedAt: new Date(),
            configJson: params.configJson,
          },
        });
      }

      return prisma.integration.create({
        data: {
          userId: params.userId,
          organizationId: params.organizationId,
          provider: params.provider,
          name: params.name,
          encryptedSecret,
          keyHint,
          status: IntegrationStatus.ACTIVE,
          lastValidatedAt: new Date(),
          configJson: params.configJson,
        },
      });
    },

    async listForUser(userId: string): Promise<Array<Omit<Integration, "encryptedSecret"> & { isConfigured: boolean }>> {
      const prisma = getPrisma();
      const list = await prisma.integration.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });

      return list.map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { encryptedSecret, ...safe } = item;
        return {
          ...safe,
          isConfigured: true,
        };
      });
    },

    async delete(id: string, userId: string): Promise<void> {
      const prisma = getPrisma();
      await prisma.integration.deleteMany({
        where: { id, userId },
      });
    },

    async getKeyForProvider(userId: string, provider: IntegrationProvider): Promise<string | null> {
      const prisma = getPrisma();
      const integration = await prisma.integration.findFirst({
        where: { userId, provider, status: IntegrationStatus.ACTIVE },
      });
      if (!integration) return null;
      try {
        return decryptSecret(integration.encryptedSecret);
      } catch {
        return null;
      }
    },
  },

  // -----------------------------------------------------------
  // AUDIT LOGGING
  // -----------------------------------------------------------
  auditLogs: {
    async record(params: {
      userId?: string;
      organizationId?: string;
      projectId?: string;
      action: string;
      details?: unknown;
      ipAddress?: string;
      userAgent?: string;
    }): Promise<AuditLog> {
      const prisma = getPrisma();
      const detailsStr =
        typeof params.details === "string"
          ? params.details
          : params.details
          ? JSON.stringify(params.details)
          : null;

      return prisma.auditLog.create({
        data: {
          userId: params.userId,
          organizationId: params.organizationId,
          projectId: params.projectId,
          action: params.action,
          details: detailsStr,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    },

    async list(params: {
      userId?: string;
      organizationId?: string;
      projectId?: string;
      limit?: number;
    }): Promise<AuditLog[]> {
      const prisma = getPrisma();
      return prisma.auditLog.findMany({
        where: {
          ...(params.userId ? { userId: params.userId } : {}),
          ...(params.organizationId ? { organizationId: params.organizationId } : {}),
          ...(params.projectId ? { projectId: params.projectId } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: params.limit || 50,
      });
    },
  },

  // -----------------------------------------------------------
  // AGENT RUNS
  // -----------------------------------------------------------
  agentRuns: {
    async create(params: {
      projectId: string;
      userId: string;
      agentName: string;
      role: string;
      taskTitle: string;
      model: string;
    }): Promise<AgentRun> {
      const prisma = getPrisma();
      return prisma.agentRun.create({
        data: {
          projectId: params.projectId,
          userId: params.userId,
          agentName: params.agentName,
          role: params.role,
          taskTitle: params.taskTitle,
          model: params.model,
          status: AgentStatus.RUNNING,
          tokenUsage: Math.floor(Math.random() * 800) + 200,
          toolsExecuted: 1,
          durationSeconds: 1,
          logsJson: JSON.stringify([
            `[${new Date().toISOString()}] Agent initialized with ${params.model}`,
            `[${new Date().toISOString()}] Formulating plan for: ${params.taskTitle}`,
          ]),
        },
      });
    },

    async listForProject(projectId: string, limit = 20): Promise<AgentRun[]> {
      const prisma = getPrisma();
      return prisma.agentRun.findMany({
        where: { projectId },
        orderBy: { startedAt: "desc" },
        take: limit,
      });
    },

    async updateStatus(id: string, status: AgentStatus, action?: string): Promise<AgentRun> {
      const prisma = getPrisma();
      return prisma.agentRun.update({
        where: { id },
        data: {
          status,
          ...(action ? { currentAction: action } : {}),
          ...(status === AgentStatus.COMPLETED || status === AgentStatus.ERROR
            ? { completedAt: new Date() }
            : {}),
        },
      });
    },
  },

  // -----------------------------------------------------------
  // DEPLOYMENTS
  // -----------------------------------------------------------
  deployments: {
    async create(params: {
      projectId: string;
      environment?: string;
      commitSha: string;
      commitMsg: string;
      liveUrl: string;
      latencyMs?: number;
      region?: string;
    }): Promise<Deployment> {
      const prisma = getPrisma();
      return prisma.deployment.create({
        data: {
          projectId: params.projectId,
          environment: params.environment || "production",
          commitSha: params.commitSha,
          commitMsg: params.commitMsg,
          liveUrl: params.liveUrl,
          latencyMs: params.latencyMs || 1.2,
          region: params.region || "us-east-metal",
          status: DeploymentStatus.LIVE,
        },
      });
    },

    async listForProject(projectId: string, limit = 20): Promise<Deployment[]> {
      const prisma = getPrisma();
      return prisma.deployment.findMany({
        where: { projectId },
        orderBy: { deployedAt: "desc" },
        take: limit,
      });
    },
  },
};
