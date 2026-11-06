import crypto from "crypto";

const ENCRYPTION_KEY_RAW =
  process.env.ENCRYPTION_SECRET ||
  process.env.SESSION_SECRET ||
  "crucion_default_encryption_secret_must_be_32_bytes_long_in_prod";

// Derive 32 bytes key using SHA-256
const ENCRYPTION_KEY = crypto.createHash("sha256").update(ENCRYPTION_KEY_RAW).digest();
const ALGORITHM = "aes-256-gcm";

/**
 * Encrypts a sensitive string (e.g. third-party API key) using AES-256-GCM
 */
export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string. Never expose decrypted secrets to client.
 */
export function decryptSecret(cipherText: string): string {
  const parts = cipherText.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid ciphertext format");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Creates a safe hint of an API key for UI display (e.g. sk-proj-...3a1b)
 */
export function createKeyHint(key: string): string {
  if (!key) return "";
  const trimmed = key.trim();
  if (trimmed.length <= 8) return "••••••••";
  const start = trimmed.slice(0, 7);
  const end = trimmed.slice(-4);
  return `${start}...${end}`;
}

/**
 * Generates cryptographically secure random token (hex)
 */
export function generateSecureToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString("hex");
}

/**
 * Simple in-memory sliding window rate limiter
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests = 5,
  windowSeconds = 60
): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
}
