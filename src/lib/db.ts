import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { encryptSecret, decryptSecret, createKeyHint } from "./crypto";

// Lazy Prisma Client initialization for environments with PostgreSQL adapter configured
let prismaInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient | null {
  if (prismaInstance) return prismaInstance;
  if (!process.env.DATABASE_URL) return null;

  try {
    // When DATABASE_URL is configured, instantiate PrismaClient
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
    return prismaInstance;
  } catch {
    return null;
  }
}

// --- Persistent storage engine ---
const JSON_DB_PATH = path.join(process.cwd(), "crucion-data.json");

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  avatarInitials: string;
  avatarUrl?: string;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface StoredSession {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: string;
  createdAt: string;
}

export interface StoredOrg {
  id: string;
  name: string;
  slug: string;
  description?: string;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredOrgMember {
  id: string;
  organizationId: string;
  userId?: string;
  invitedEmail?: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  status: "ACTIVE" | "INVITED" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
}

export interface StoredProject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  ownerId: string;
  containerRuntime: string;
  gitRepoUrl?: string;
  gitBranch: string;
  status: "ACTIVE" | "BUILDING" | "DEPLOYED" | "IDLE" | "ERROR";
  health: "OPTIMAL" | "DEGRADED" | "STANDBY";
  cluster: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastDeployedAt?: string;
}

export interface StoredProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: "LEAD" | "DEVELOPER" | "VIEWER";
  createdAt: string;
}

export interface StoredIntegration {
  id: string;
  userId: string;
  organizationId?: string;
  provider: string;
  name: string;
  encryptedSecret: string;
  keyHint: string;
  status: "ACTIVE" | "ERROR" | "DISCONNECTED";
  lastValidatedAt?: string;
  configJson?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredAuditLog {
  id: string;
  organizationId?: string;
  projectId?: string;
  userId?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface StoredAgentRun {
  id: string;
  projectId: string;
  userId: string;
  agentName: string;
  role: string;
  taskTitle: string;
  status: "RUNNING" | "IDLE" | "EXECUTING_TOOL" | "COMPLETED" | "ERROR";
  model: string;
  tokenUsage: number;
  toolsExecuted: number;
  durationSeconds: number;
  currentAction?: string;
  logsJson?: string;
  startedAt: string;
  completedAt?: string;
}

export interface StoredDeployment {
  id: string;
  projectId: string;
  environment: string;
  commitSha: string;
  commitMsg: string;
  status: "LIVE" | "ROLLING_UPDATE" | "CANARY" | "FAILED";
  latencyMs: number;
  region: string;
  liveUrl: string;
  deployedAt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  sessions: StoredSession[];
  organizations: StoredOrg[];
  orgMembers: StoredOrgMember[];
  projects: StoredProject[];
  projectMembers: StoredProjectMember[];
  integrations: StoredIntegration[];
  auditLogs: StoredAuditLog[];
  agentRuns: StoredAgentRun[];
  deployments: StoredDeployment[];
}

function initialData(): DatabaseSchema {
  return {
    users: [],
    sessions: [],
    organizations: [],
    orgMembers: [],
    projects: [],
    projectMembers: [],
    integrations: [],
    auditLogs: [],
    agentRuns: [],
    deployments: [],
  };
}

class JsonStorage {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureInitialized();
  }

  private ensureInitialized() {
    try {
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, JSON.stringify(initialData(), null, 2), "utf8");
      }
    } catch (e) {
      console.error("Error initializing json storage:", e);
    }
  }

  public read(): DatabaseSchema {
    try {
      if (fs.existsSync(this.filePath)) {
        const text = fs.readFileSync(this.filePath, "utf8");
        const parsed = JSON.parse(text);
        return {
          users: parsed.users || [],
          sessions: parsed.sessions || [],
          organizations: parsed.organizations || [],
          orgMembers: parsed.orgMembers || [],
          projects: parsed.projects || [],
          projectMembers: parsed.projectMembers || [],
          integrations: parsed.integrations || [],
          auditLogs: parsed.auditLogs || [],
          agentRuns: parsed.agentRuns || [],
          deployments: parsed.deployments || [],
        };
      }
    } catch {
      // Return fresh data if corrupt
    }
    return initialData();
  }

  public write(data: DatabaseSchema): void {
    const tempPath = `${this.filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
    fs.renameSync(tempPath, this.filePath);
  }
}

const storage = new JsonStorage(JSON_DB_PATH);

export function generateCuid(prefix = ""): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 9);
  return prefix ? `${prefix}_${ts}${rand}` : `c${ts}${rand}`;
}

// =============================================================
// REPOSITORY LAYER (UNIFIED INTERFACE)
// =============================================================

export const db = {
  // --- USERS ---
  users: {
    findByEmail(email: string): StoredUser | null {
      const data = storage.read();
      const user = data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.isActive
      );
      return user || null;
    },

    findById(id: string): StoredUser | null {
      const data = storage.read();
      const user = data.users.find((u) => u.id === id && u.isActive);
      return user || null;
    },

    findByVerificationToken(token: string): StoredUser | null {
      const data = storage.read();
      const user = data.users.find(
        (u) => u.verificationToken === token && u.isActive
      );
      if (!user) return null;
      if (user.verificationTokenExpiry && new Date(user.verificationTokenExpiry) < new Date()) {
        return null;
      }
      return user;
    },

    findByResetToken(token: string): StoredUser | null {
      const data = storage.read();
      const user = data.users.find((u) => u.resetToken === token && u.isActive);
      if (!user) return null;
      if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) < new Date()) {
        return null;
      }
      return user;
    },

    create(params: {
      email: string;
      name: string;
      passwordHash: string;
      role?: "USER" | "ADMIN" | "SUPERADMIN";
      organizationName?: string;
    }): { user: StoredUser; organization: StoredOrg } {
      const data = storage.read();
      const normalizedEmail = params.email.toLowerCase().trim();

      if (data.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        throw new Error("A user with this email address already exists.");
      }

      const now = new Date().toISOString();
      const userId = generateCuid("usr");
      const initials = params.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "CR";

      const newUser: StoredUser = {
        id: userId,
        email: normalizedEmail,
        name: params.name.trim(),
        passwordHash: params.passwordHash,
        role: params.role || "USER",
        avatarInitials: initials,
        emailVerified: false,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      data.users.push(newUser);

      // Create default organization for user
      const orgName = params.organizationName?.trim() || `${params.name.trim()}'s Workspace`;
      const orgSlug = orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `org-${userId.slice(-6)}`;

      const orgId = generateCuid("org");
      const newOrg: StoredOrg = {
        id: orgId,
        name: orgName,
        slug: `${orgSlug}-${Date.now().toString(36).slice(-4)}`,
        plan: "PRO",
        createdAt: now,
        updatedAt: now,
      };

      data.organizations.push(newOrg);

      // Add user as OWNER of organization
      const memberId = generateCuid("mbr");
      data.orgMembers.push({
        id: memberId,
        organizationId: orgId,
        userId: userId,
        role: "OWNER",
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
      });

      storage.write(data);
      return { user: newUser, organization: newOrg };
    },

    updateProfile(userId: string, updates: { name?: string; avatarUrl?: string }): StoredUser {
      const data = storage.read();
      const index = data.users.findIndex((u) => u.id === userId);
      if (index === -1) throw new Error("User not found");

      const user = data.users[index];
      if (updates.name) {
        user.name = updates.name.trim();
        user.avatarInitials = updates.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
      if (updates.avatarUrl !== undefined) {
        user.avatarUrl = updates.avatarUrl;
      }
      user.updatedAt = new Date().toISOString();
      data.users[index] = user;
      storage.write(data);
      return user;
    },

    updatePassword(userId: string, newPasswordHash: string): void {
      const data = storage.read();
      const index = data.users.findIndex((u) => u.id === userId);
      if (index === -1) throw new Error("User not found");

      data.users[index].passwordHash = newPasswordHash;
      data.users[index].resetToken = undefined;
      data.users[index].resetTokenExpiry = undefined;
      data.users[index].updatedAt = new Date().toISOString();
      storage.write(data);
    },

    setResetToken(email: string, token: string, expiry: Date): void {
      const data = storage.read();
      const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!user) return;

      user.resetToken = token;
      user.resetTokenExpiry = expiry.toISOString();
      user.updatedAt = new Date().toISOString();
      storage.write(data);
    },

    setVerificationToken(userId: string, token: string, expiry: Date): void {
      const data = storage.read();
      const user = data.users.find((u) => u.id === userId);
      if (!user) return;

      user.verificationToken = token;
      user.verificationTokenExpiry = expiry.toISOString();
      user.updatedAt = new Date().toISOString();
      storage.write(data);
    },

    verifyEmail(userId: string): void {
      const data = storage.read();
      const user = data.users.find((u) => u.id === userId);
      if (!user) throw new Error("User not found");

      user.emailVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      user.updatedAt = new Date().toISOString();
      storage.write(data);
    },

    updateLastLogin(userId: string): void {
      const data = storage.read();
      const user = data.users.find((u) => u.id === userId);
      if (user) {
        user.lastLoginAt = new Date().toISOString();
        storage.write(data);
      }
    },

    deleteAccount(userId: string): void {
      const data = storage.read();
      data.users = data.users.filter((u) => u.id !== userId);
      data.sessions = data.sessions.filter((s) => s.userId !== userId);
      data.orgMembers = data.orgMembers.filter((m) => m.userId !== userId);
      data.integrations = data.integrations.filter((i) => i.userId !== userId);
      storage.write(data);
    },
  },

  // --- SESSIONS ---
  sessions: {
    create(params: {
      userId: string;
      token: string;
      expiresAt: Date;
      ipAddress?: string;
      userAgent?: string;
    }): StoredSession {
      const data = storage.read();
      const session: StoredSession = {
        id: generateCuid("ses"),
        userId: params.userId,
        token: params.token,
        expiresAt: params.expiresAt.toISOString(),
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        createdAt: new Date().toISOString(),
      };
      data.sessions.push(session);
      storage.write(data);
      return session;
    },

    findByToken(token: string): StoredSession | null {
      const data = storage.read();
      const session = data.sessions.find((s) => s.token === token);
      if (!session) return null;
      if (new Date(session.expiresAt) < new Date()) {
        this.delete(token);
        return null;
      }
      return session;
    },

    delete(token: string): void {
      const data = storage.read();
      data.sessions = data.sessions.filter((s) => s.token !== token);
      storage.write(data);
    },

    deleteForUser(userId: string): void {
      const data = storage.read();
      data.sessions = data.sessions.filter((s) => s.userId !== userId);
      storage.write(data);
    },
  },

  // --- ORGANIZATIONS ---
  organizations: {
    findById(id: string): StoredOrg | null {
      const data = storage.read();
      return data.organizations.find((o) => o.id === id) || null;
    },

    getUserOrganizations(userId: string): { organization: StoredOrg; role: string }[] {
      const data = storage.read();
      const memberships = data.orgMembers.filter(
        (m) => m.userId === userId && m.status === "ACTIVE"
      );
      return memberships
        .map((m) => {
          const org = data.organizations.find((o) => o.id === m.organizationId);
          if (!org) return null;
          return { organization: org, role: m.role };
        })
        .filter(Boolean) as { organization: StoredOrg; role: string }[];
    },

    create(params: { name: string; userId: string; description?: string }): StoredOrg {
      const data = storage.read();
      const now = new Date().toISOString();
      const orgId = generateCuid("org");
      const slugBase = params.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "org";
      const slug = `${slugBase}-${Date.now().toString(36).slice(-4)}`;

      const newOrg: StoredOrg = {
        id: orgId,
        name: params.name.trim(),
        slug,
        description: params.description,
        plan: "PRO",
        createdAt: now,
        updatedAt: now,
      };

      data.organizations.push(newOrg);
      data.orgMembers.push({
        id: generateCuid("mbr"),
        organizationId: orgId,
        userId: params.userId,
        role: "OWNER",
        status: "ACTIVE",
        createdAt: now,
        updatedAt: now,
      });

      storage.write(data);
      return newOrg;
    },

    update(orgId: string, updates: { name?: string; description?: string }): StoredOrg {
      const data = storage.read();
      const index = data.organizations.findIndex((o) => o.id === orgId);
      if (index === -1) throw new Error("Organization not found");

      const org = data.organizations[index];
      if (updates.name) org.name = updates.name.trim();
      if (updates.description !== undefined) org.description = updates.description;
      org.updatedAt = new Date().toISOString();
      data.organizations[index] = org;
      storage.write(data);
      return org;
    },

    getMembers(orgId: string): { member: StoredOrgMember; user?: StoredUser }[] {
      const data = storage.read();
      const members = data.orgMembers.filter((m) => m.organizationId === orgId);
      return members.map((m) => {
        const user = m.userId ? data.users.find((u) => u.id === m.userId) : undefined;
        return { member: m, user };
      });
    },

    addMember(params: {
      organizationId: string;
      email: string;
      role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    }): StoredOrgMember {
      const data = storage.read();
      const normalizedEmail = params.email.toLowerCase().trim();
      const existingUser = data.users.find((u) => u.email.toLowerCase() === normalizedEmail);

      const alreadyMember = data.orgMembers.find(
        (m) =>
          m.organizationId === params.organizationId &&
          (m.userId === existingUser?.id || m.invitedEmail?.toLowerCase() === normalizedEmail)
      );

      if (alreadyMember) {
        throw new Error("User or email is already a member of this organization.");
      }

      const now = new Date().toISOString();
      const newMember: StoredOrgMember = {
        id: generateCuid("mbr"),
        organizationId: params.organizationId,
        userId: existingUser?.id,
        invitedEmail: existingUser ? undefined : normalizedEmail,
        role: params.role,
        status: existingUser ? "ACTIVE" : "INVITED",
        createdAt: now,
        updatedAt: now,
      };

      data.orgMembers.push(newMember);
      storage.write(data);
      return newMember;
    },

    removeMember(orgId: string, memberId: string): void {
      const data = storage.read();
      data.orgMembers = data.orgMembers.filter(
        (m) => !(m.organizationId === orgId && m.id === memberId)
      );
      storage.write(data);
    },
  },

  // --- PROJECTS ---
  projects: {
    listForUser(userId: string): StoredProject[] {
      const data = storage.read();
      const userOrgIds = data.orgMembers
        .filter((m) => m.userId === userId && m.status === "ACTIVE")
        .map((m) => m.organizationId);

      return data.projects.filter(
        (p) => userOrgIds.includes(p.organizationId) || p.ownerId === userId
      );
    },

    findById(id: string): StoredProject | null {
      const data = storage.read();
      return data.projects.find((p) => p.id === id) || null;
    },

    create(params: {
      name: string;
      description?: string;
      organizationId: string;
      ownerId: string;
      containerRuntime?: string;
      cluster?: string;
      gitRepoUrl?: string;
    }): StoredProject {
      const data = storage.read();
      const now = new Date().toISOString();
      const projectId = generateCuid("prj");
      const slug = params.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `prj-${projectId.slice(-6)}`;

      const newProject: StoredProject = {
        id: projectId,
        name: params.name.trim(),
        slug,
        description: params.description?.trim(),
        organizationId: params.organizationId,
        ownerId: params.ownerId,
        containerRuntime: params.containerRuntime || "Node 24 / V8",
        gitRepoUrl: params.gitRepoUrl,
        gitBranch: "main",
        status: "ACTIVE",
        health: "OPTIMAL",
        cluster: params.cluster || "us-east-metal",
        createdAt: now,
        updatedAt: now,
      };

      data.projects.unshift(newProject);

      data.projectMembers.push({
        id: generateCuid("prm"),
        projectId,
        userId: params.ownerId,
        role: "LEAD",
        createdAt: now,
      });

      storage.write(data);
      return newProject;
    },

    update(
      projectId: string,
      updates: Partial<Pick<StoredProject, "name" | "description" | "containerRuntime" | "gitRepoUrl" | "gitBranch" | "status" | "cluster">>
    ): StoredProject {
      const data = storage.read();
      const index = data.projects.findIndex((p) => p.id === projectId);
      if (index === -1) throw new Error("Project not found");

      const project = {
        ...data.projects[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      data.projects[index] = project;
      storage.write(data);
      return project;
    },

    delete(projectId: string): void {
      const data = storage.read();
      data.projects = data.projects.filter((p) => p.id !== projectId);
      data.projectMembers = data.projectMembers.filter((pm) => pm.projectId !== projectId);
      data.agentRuns = data.agentRuns.filter((ar) => ar.projectId !== projectId);
      data.deployments = data.deployments.filter((d) => d.projectId !== projectId);
      storage.write(data);
    },
  },

  // --- CONNECTED SERVICES / INTEGRATIONS ---
  integrations: {
    listForUser(userId: string): Omit<StoredIntegration, "encryptedSecret">[] {
      const data = storage.read();
      return data.integrations
        .filter((i) => i.userId === userId)
        .map(({ encryptedSecret, ...rest }) => rest);
    },

    getDecryptedKey(integrationId: string, userId: string): string | null {
      const data = storage.read();
      const item = data.integrations.find((i) => i.id === integrationId && i.userId === userId);
      if (!item) return null;
      try {
        return decryptSecret(item.encryptedSecret);
      } catch {
        return null;
      }
    },

    getKeyForProvider(userId: string, provider: string): string | null {
      const data = storage.read();
      const item = data.integrations.find(
        (i) => i.userId === userId && i.provider.toUpperCase() === provider.toUpperCase() && i.status === "ACTIVE"
      );
      if (!item) return null;
      try {
        return decryptSecret(item.encryptedSecret);
      } catch {
        return null;
      }
    },

    upsert(params: {
      userId: string;
      organizationId?: string;
      provider: string;
      name: string;
      secretKey: string;
      config?: Record<string, unknown>;
    }): Omit<StoredIntegration, "encryptedSecret"> {
      const data = storage.read();
      const now = new Date().toISOString();
      const encrypted = encryptSecret(params.secretKey.trim());
      const hint = createKeyHint(params.secretKey.trim());

      const existingIndex = data.integrations.findIndex(
        (i) => i.userId === params.userId && i.provider.toUpperCase() === params.provider.toUpperCase()
      );

      if (existingIndex >= 0) {
        data.integrations[existingIndex] = {
          ...data.integrations[existingIndex],
          name: params.name,
          encryptedSecret: encrypted,
          keyHint: hint,
          status: "ACTIVE",
          lastValidatedAt: now,
          configJson: params.config ? JSON.stringify(params.config) : undefined,
          updatedAt: now,
        };
        storage.write(data);
        const { encryptedSecret, ...rest } = data.integrations[existingIndex];
        return rest;
      } else {
        const newIntegration: StoredIntegration = {
          id: generateCuid("int"),
          userId: params.userId,
          organizationId: params.organizationId,
          provider: params.provider.toUpperCase(),
          name: params.name,
          encryptedSecret: encrypted,
          keyHint: hint,
          status: "ACTIVE",
          lastValidatedAt: now,
          configJson: params.config ? JSON.stringify(params.config) : undefined,
          createdAt: now,
          updatedAt: now,
        };
        data.integrations.push(newIntegration);
        storage.write(data);
        const { encryptedSecret, ...rest } = newIntegration;
        return rest;
      }
    },

    delete(integrationId: string, userId: string): void {
      const data = storage.read();
      data.integrations = data.integrations.filter(
        (i) => !(i.id === integrationId && i.userId === userId)
      );
      storage.write(data);
    },
  },

  // --- AUDIT LOGS ---
  auditLogs: {
    record(params: {
      userId?: string;
      organizationId?: string;
      projectId?: string;
      action: string;
      details?: Record<string, unknown> | string;
      ipAddress?: string;
      userAgent?: string;
    }): StoredAuditLog {
      const data = storage.read();
      const entry: StoredAuditLog = {
        id: generateCuid("aud"),
        userId: params.userId,
        organizationId: params.organizationId,
        projectId: params.projectId,
        action: params.action,
        details:
          typeof params.details === "object"
            ? JSON.stringify(params.details)
            : params.details,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        createdAt: new Date().toISOString(),
      };
      data.auditLogs.unshift(entry);
      if (data.auditLogs.length > 2000) {
        data.auditLogs = data.auditLogs.slice(0, 2000);
      }
      storage.write(data);
      return entry;
    },

    list(params?: { userId?: string; organizationId?: string; limit?: number }): StoredAuditLog[] {
      const data = storage.read();
      let logs = data.auditLogs;
      if (params?.userId) {
        logs = logs.filter((l) => l.userId === params.userId);
      }
      if (params?.organizationId) {
        logs = logs.filter((l) => l.organizationId === params.organizationId);
      }
      return logs.slice(0, params?.limit || 50);
    },
  },

  // --- AGENT RUNS ---
  agentRuns: {
    listForProject(projectId: string): StoredAgentRun[] {
      const data = storage.read();
      return data.agentRuns.filter((a) => a.projectId === projectId);
    },

    create(params: {
      projectId: string;
      userId: string;
      agentName: string;
      role: string;
      taskTitle: string;
      model: string;
    }): StoredAgentRun {
      const data = storage.read();
      const run: StoredAgentRun = {
        id: generateCuid("run"),
        projectId: params.projectId,
        userId: params.userId,
        agentName: params.agentName,
        role: params.role,
        taskTitle: params.taskTitle,
        status: "RUNNING",
        model: params.model,
        tokenUsage: 0,
        toolsExecuted: 0,
        durationSeconds: 0,
        currentAction: "Initializing microVM container sandbox",
        logsJson: JSON.stringify([
          `[${new Date().toLocaleTimeString()}] Task assigned: ${params.taskTitle}`,
          `[${new Date().toLocaleTimeString()}] Allocating isolated container workspace`,
        ]),
        startedAt: new Date().toISOString(),
      };
      data.agentRuns.unshift(run);
      storage.write(data);
      return run;
    },

    update(
      runId: string,
      updates: Partial<Pick<StoredAgentRun, "status" | "currentAction" | "tokenUsage" | "toolsExecuted" | "durationSeconds" | "logsJson" | "completedAt">>
    ): StoredAgentRun {
      const data = storage.read();
      const index = data.agentRuns.findIndex((r) => r.id === runId);
      if (index === -1) throw new Error("Agent run not found");

      data.agentRuns[index] = { ...data.agentRuns[index], ...updates };
      storage.write(data);
      return data.agentRuns[index];
    },
  },

  // --- DEPLOYMENTS ---
  deployments: {
    listForProject(projectId: string): StoredDeployment[] {
      const data = storage.read();
      return data.deployments.filter((d) => d.projectId === projectId);
    },

    create(params: {
      projectId: string;
      environment?: string;
      commitSha: string;
      commitMsg: string;
      liveUrl: string;
      region?: string;
    }): StoredDeployment {
      const data = storage.read();
      const dep: StoredDeployment = {
        id: generateCuid("dep"),
        projectId: params.projectId,
        environment: params.environment || "production",
        commitSha: params.commitSha,
        commitMsg: params.commitMsg,
        status: "LIVE",
        latencyMs: 1.2,
        region: params.region || "us-east-metal",
        liveUrl: params.liveUrl,
        deployedAt: new Date().toISOString(),
      };
      data.deployments.unshift(dep);
      storage.write(data);
      return dep;
    },
  },
};
