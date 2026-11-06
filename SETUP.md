# CRUCION — Universal Software Engineering Ecosystem
## Production Setup & Implementation Guide

CRUCION is a unified, enterprise-grade software engineering platform unifying isolated microVM execution, autonomous AgentOS swarms, and zero-downtime edge deployments.

---

## 1. Architecture Overview

- **Design System**: Light, clean enterprise aesthetic matching GuardScale reference (`#ffffff` surface, `#0066cc` and `#0284c7` primary blue accents, sharp typography).
- **Authentication**: Genuine, multi-tenant session authentication with bcrypt password hashing (work factor 12), encrypted sessions, email verification, password reset, and rate-limiting.
- **Persistent Database**:
  - Prisma ORM schema configured for PostgreSQL (`prisma/schema.prisma`).
  - Production SQL migration in `prisma/migrations/0_init/migration.sql`.
  - Zero-config persistent repository fallback (`crucion-data.json`) for local development without active PostgreSQL daemon.
- **Ecosystem Integration**:
  - One Crucion account connecting OpenAI, Anthropic, Gemini, GitHub, Vercel, and Ollama.
  - AES-256-GCM symmetric encryption for all credentials at rest.
  - Secrets are never exposed to browser or client code.
- **AgentOS**: Autonomous multi-agent loops operating directly inside microVM container workspaces.

---

## 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set the following variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://...`) |
| `SESSION_SECRET` | 32+ character random string for session cookies |
| `ENCRYPTION_SECRET` | 32+ character key for AES-256-GCM API key encryption |
| `NEXT_PUBLIC_APP_URL` | Base application URL (`http://localhost:3000`) |

---

## 3. Database Setup & Migrations

### With PostgreSQL:
Generate Prisma Client and apply migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Or push the schema directly:

```bash
npx prisma db push
```

### Local Zero-Config Mode:
If PostgreSQL is not running locally, CRUCION automatically persists all users, organizations, projects, integrations, and audit logs to `crucion-data.json` with identical relational semantics.

---

## 4. Running the Application

### Development:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Production Build:
```bash
npm run build
npm run start
```

---

## 5. Security Architecture

1. **Password Hashing**: Bcrypt with salt rounds = 12.
2. **Session Security**: HttpOnly, SameSite=Lax, Secure in production, cryptographic JWT verification.
3. **API Key Storage**: Third-party API keys (OpenAI, Anthropic, etc.) are encrypted via AES-256-GCM before storage. Only masked key hints (e.g. `sk-proj-...ab12`) are sent to the client.
4. **Rate Limiting**: Sliding window rate limiting on all registration and login attempts to protect against brute force attacks.
5. **Audit Logging**: All security actions (`AUTH_REGISTER`, `AUTH_LOGIN`, `PROJECT_CREATED`, `INTEGRATION_SAVED`) are recorded with timestamps, user IDs, and action details.
