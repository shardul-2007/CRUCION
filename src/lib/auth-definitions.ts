import { z } from "zod";

// --- SIGN UP SCHEMA ---
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name must be less than 100 characters." })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid work email address." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .trim(),
  organization: z
    .string()
    .max(100, { message: "Organization name must be less than 100 characters." })
    .optional(),
});

// --- SIGN IN SCHEMA ---
export const SigninFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .trim(),
});

// --- FORGOT PASSWORD SCHEMA ---
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .trim()
    .toLowerCase(),
});

// --- RESET PASSWORD SCHEMA ---
export const ResetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Reset token is required." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Must contain at least one special character.",
    })
    .trim(),
});

// --- PROFILE UPDATE SCHEMA ---
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(100, { message: "Name must be less than 100 characters." })
    .trim(),
});

// --- PASSWORD CHANGE SCHEMA ---
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z
    .string()
    .min(8, { message: "New password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Must contain at least one special character.",
    })
    .trim(),
});

// --- PROJECT CREATION SCHEMA ---
export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Project name must be at least 2 characters." })
    .max(80, { message: "Project name must be less than 80 characters." })
    .trim(),
  description: z.string().max(500).optional(),
  containerRuntime: z
    .enum([
      "Node 24 / V8",
      "Rust / LLVM",
      "Python 3.12 / PyPy",
      "Go 1.23",
      "Solidity / EVM",
    ])
    .default("Node 24 / V8"),
  cluster: z.string().default("us-east-metal"),
  gitRepoUrl: z.string().url().optional().or(z.literal("")),
});

// --- INTEGRATION SCHEMA ---
export const UpsertIntegrationSchema = z.object({
  provider: z.enum([
    "OPENAI",
    "ANTHROPIC",
    "GOOGLE_GEMINI",
    "OPENROUTER",
    "OLLAMA",
    "GITHUB",
    "VERCEL",
    "ANTIGRAVITY",
  ]),
  name: z.string().min(2).max(100),
  secretKey: z.string().min(1, { message: "API key or secret is required." }),
});

// --- ORGANIZATION MEMBER SCHEMA ---
export const InviteMemberSchema = z.object({
  email: z.string().email({ message: "Valid email is required." }).trim().toLowerCase(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});

// --- TYPES ---
export type SignupFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    organization?: string[];
  };
  message?: string;
  success?: boolean;
} | undefined;

export type SigninFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
} | undefined;

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: unknown;
};

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  organization: string;
  avatarInitials: string;
  expiresAt: Date;
}

export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organization: string;
  avatarInitials: string;
  createdAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
  emailVerified: boolean;
}
