/**
 * CRUCION Production Verification & Integration Test Suite
 * Tests genuine authentication, password hashing, encryption, rate limiting, and RBAC
 */

import assert from "assert";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import {
  encryptSecret,
  decryptSecret,
  createKeyHint,
  checkRateLimit,
  generateSecureToken,
} from "../src/lib/crypto";

async function runTestSuite() {
  console.log("=================================================");
  console.log("CRUCION PRODUCTION IMPLEMENTATION TEST SUITE");
  console.log("=================================================");

  // 1. Password Hashing & Verification Test
  console.log("\n[TEST 1] Password Hashing & Bcrypt Verification...");
  const rawPassword = "CrucionSuperSecurePassword2026!#";
  const hash = await bcrypt.hash(rawPassword, 12);
  assert(hash.startsWith("$2"), "Bcrypt hash must be valid");
  const isMatch = await bcrypt.compare(rawPassword, hash);
  assert.strictEqual(isMatch, true, "Bcrypt compare must succeed for correct password");
  const isWrongMatch = await bcrypt.compare("WrongPassword123!", hash);
  assert.strictEqual(isWrongMatch, false, "Bcrypt compare must fail for wrong password");
  console.log("✓ Bcrypt password hashing test PASSED (work factor 12)");

  // 2. AES-256-GCM Secret Encryption & Decryption
  console.log("\n[TEST 2] AES-256-GCM API Key Encryption at Rest...");
  const sampleApiKey = "sk-proj-CrucionEnterpriseApiKey1234567890abcdef";
  const encrypted = encryptSecret(sampleApiKey);
  assert.notStrictEqual(encrypted, sampleApiKey, "Encrypted string must differ from plaintext");
  assert(encrypted.includes(":"), "Encrypted payload must contain IV, tag and ciphertext");
  const decrypted = decryptSecret(encrypted);
  assert.strictEqual(decrypted, sampleApiKey, "Decrypted text must match original secret");
  const hint = createKeyHint(sampleApiKey);
  assert(hint.startsWith("sk-proj"), "Key hint must preserve prefix");
  assert(hint.includes("..."), "Key hint must mask middle characters");
  assert(!hint.includes("CrucionEnterprise"), "Key hint must not reveal private portion");
  console.log("✓ AES-256-GCM secret encryption test PASSED");

  // 3. Rate Limiting Protection
  console.log("\n[TEST 3] Rate Limiting on Authentication Endpoints...");
  const testKey = `test_ip_${Date.now()}`;
  for (let i = 0; i < 3; i++) {
    const res = checkRateLimit(testKey, 3, 60);
    assert.strictEqual(res.allowed, true, `Attempt ${i + 1} must be allowed within limit`);
  }
  const blocked = checkRateLimit(testKey, 3, 60);
  assert.strictEqual(blocked.allowed, false, "4th attempt must be blocked by rate limiter");
  assert(blocked.retryAfterSeconds! > 0, "Retry-After must be positive seconds");
  console.log("✓ Rate limiting test PASSED");

  // 4. User Registration & Multi-Tenant Organization Creation
  console.log("\n[TEST 4] User Registration & Persistent Organization Creation...");
  const testEmail = `operator_${Date.now()}@crucion.dev`;
  const { user, organization } = db.users.create({
    email: testEmail,
    name: "Lead Systems Architect",
    passwordHash: hash,
    organizationName: "Crucion Autonomous Swarm",
  });

  assert(user.id.startsWith("usr_"), "User ID must have usr_ prefix");
  assert.strictEqual(user.email, testEmail, "User email must match");
  assert(organization.id.startsWith("org_"), "Organization ID must have org_ prefix");
  assert.strictEqual(organization.name, "Crucion Autonomous Swarm");

  const orgMembers = db.organizations.getMembers(organization.id);
  assert(orgMembers.some((m) => m.member.userId === user.id && m.member.role === "OWNER"), "Creator must be OWNER");
  console.log("✓ User & Organization multi-tenant creation test PASSED");

  // 5. Project Provisioning & Isolation
  console.log("\n[TEST 5] Project Provisioning & Tenant Isolation...");
  const project = db.projects.create({
    name: "quantum-gateway-microvm",
    description: "Multi-cluster isolated service",
    organizationId: organization.id,
    ownerId: user.id,
    containerRuntime: "Rust / LLVM",
    cluster: "us-east-metal",
  });

  assert(project.id.startsWith("prj_"), "Project ID must have prj_ prefix");
  assert.strictEqual(project.containerRuntime, "Rust / LLVM");

  const userProjects = db.projects.listForUser(user.id);
  assert(userProjects.some((p) => p.id === project.id), "Project must appear in user's authorized projects");
  console.log("✓ Project creation and listing test PASSED");

  // 6. Connected Services (Encrypted Integrations)
  console.log("\n[TEST 6] Connected Services & Secret Storage...");
  const integration = db.integrations.upsert({
    userId: user.id,
    organizationId: organization.id,
    provider: "OPENAI",
    name: "Production OpenAI Fleet",
    secretKey: sampleApiKey,
  });

  assert.strictEqual(integration.provider, "OPENAI");
  assert(integration.keyHint.includes("..."), "Returned integration must only have keyHint");
  assert(!("encryptedSecret" in integration), "Encrypted secret must not be exposed in return object");

  const decryptedKey = db.integrations.getKeyForProvider(user.id, "OPENAI");
  assert.strictEqual(decryptedKey, sampleApiKey, "Stored key must decrypt correctly for server actions");
  console.log("✓ Connected Services encryption test PASSED");

  // 7. Audit Logging
  console.log("\n[TEST 7] Audit Logging & Compliance Records...");
  const auditEntry = db.auditLogs.record({
    userId: user.id,
    organizationId: organization.id,
    action: "INTEGRATION_CONFIGURED",
    details: { provider: "OPENAI", test: true },
  });

  assert(auditEntry.id.startsWith("aud_"), "Audit ID must have aud_ prefix");
  const recentLogs = db.auditLogs.list({ userId: user.id, limit: 10 });
  assert(recentLogs.some((l) => l.id === auditEntry.id), "Audit log must be queryable");
  console.log("✓ Audit trail recording test PASSED");

  // Clean up
  db.projects.delete(project.id);
  db.integrations.delete(integration.id, user.id);
  db.users.deleteAccount(user.id);
  console.log("\n✓ Cleaned up test records");

  console.log("\n=================================================");
  console.log("ALL 7 PRODUCTION IMPLEMENTATION TESTS PASSED ✓");
  console.log("=================================================");
}

runTestSuite().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
