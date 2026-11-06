import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload, SafeUser } from "./auth-definitions";
import { db } from "./db";
import { generateSecureToken } from "./crypto";

const secretKey =
  process.env.SESSION_SECRET ||
  "crucion_session_super_secret_key_production_grade_32_bytes_min";
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    ...payload,
    expiresAt: payload.expiresAt.toISOString(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  sessionToken: string | undefined = ""
): Promise<SessionPayload | null> {
  if (!sessionToken) return null;
  try {
    const { payload } = await jwtVerify(sessionToken, encodedKey, {
      algorithms: ["HS256"],
    });
    return {
      ...payload,
      expiresAt: new Date(payload.expiresAt as string),
    } as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    organization: string;
    avatarInitials: string;
  },
  meta?: { ipAddress?: string; userAgent?: string }
): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionTokenId = generateSecureToken(32);

  const sessionPayload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organization: user.organization,
    avatarInitials: user.avatarInitials,
    expiresAt,
  };

  const jwt = await encrypt(sessionPayload);

  // Store session in PostgreSQL DB for revocation tracking
  try {
    await db.sessions.create({
      userId: user.id,
      token: sessionTokenId,
      expiresAt,
      ipAddress: meta?.ipAddress,
      userAgent: meta?.userAgent,
    });
  } catch (err) {
    console.error("Failed to persist session to database:", err);
  }

  const cookieStore = await cookies();
  cookieStore.set("crucion_session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return jwt;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("crucion_session")?.value;
  if (!sessionCookie) return null;

  const payload = await decrypt(sessionCookie);
  if (!payload) return null;

  if (new Date(payload.expiresAt) < new Date()) {
    await deleteSession();
    return null;
  }

  return payload;
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await db.users.findById(session.userId);
    if (!user) return null;

    // Get user's primary organization
    const orgs = await db.organizations.getUserOrganizations(user.id);
    const primaryOrg = orgs[0]?.name || "Personal Workspace";

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: primaryOrg,
      avatarInitials: user.avatarInitials || user.name.slice(0, 2).toUpperCase(),
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  } catch {
    return null;
  }
}

export async function updateSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("crucion_session")?.value;
  const payload = await decrypt(sessionCookie);

  if (!sessionCookie || !payload) return;

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookieStore.set("crucion_session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession(): Promise<void> {
  const session = await getSession();
  if (session?.userId) {
    try {
      await db.sessions.deleteForUser(session.userId);
    } catch {
      // Ignored if DB is momentarily unreachable
    }
  }
  const cookieStore = await cookies();
  cookieStore.delete("crucion_session");
}
