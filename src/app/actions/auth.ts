"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import {
  SignupFormSchema,
  SigninFormSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  UpdateProfileSchema,
  ChangePasswordSchema,
  SignupFormState,
  SigninFormState,
  ActionResponse,
} from "@/lib/auth-definitions";
import { createSession, deleteSession, getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { checkRateLimit, generateSecureToken } from "@/lib/crypto";

export async function signup(
  state: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const email = (formData.get("email") as string) || "";
  const normalizedEmail = email.toLowerCase().trim();

  // Rate limit by email
  const rateLimit = checkRateLimit(`signup_${normalizedEmail}`, 5, 60);
  if (!rateLimit.allowed) {
    return {
      message: `Too many registration attempts. Please wait ${rateLimit.retryAfterSeconds} seconds.`,
    };
  }

  const validated = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    organization: formData.get("organization"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, password, organization } = validated.data;

  try {
    const existing = await db.users.findByEmail(normalizedEmail);
    if (existing) {
      return {
        message: "An account with this email address already exists. Please sign in.",
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const { user, organization: org } = await db.users.create({
      email: normalizedEmail,
      name,
      passwordHash,
      organizationName: organization,
    });

    // Generate email verification token
    const verificationToken = generateSecureToken(24);
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.users.setVerificationToken(user.id, verificationToken, verificationExpiry);

    // Audit log
    await db.auditLogs.record({
      userId: user.id,
      organizationId: org.id,
      action: "AUTH_REGISTER",
      details: { email: user.email, name: user.name, organization: org.name },
    });

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: org.name,
      avatarInitials: user.avatarInitials || "CR",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Registration failed";
    return { message: msg };
  }

  redirect("/dashboard");
}

export async function signin(
  state: SigninFormState,
  formData: FormData
): Promise<SigninFormState> {
  const email = (formData.get("email") as string) || "";
  const normalizedEmail = email.toLowerCase().trim();

  // Rate limiting to prevent brute-force attacks
  const rateLimit = checkRateLimit(`login_${normalizedEmail}`, 6, 60);
  if (!rateLimit.allowed) {
    return {
      message: `Too many sign-in attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
    };
  }

  const validated = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { password } = validated.data;

  try {
    const user = await db.users.findByEmail(normalizedEmail);
    if (!user) {
      return {
        message: "Invalid credentials. Please verify your email and password.",
      };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      await db.auditLogs.record({
        userId: user.id,
        action: "AUTH_LOGIN_FAILED",
        details: { email: normalizedEmail, reason: "invalid_password" },
      });
      return {
        message: "Invalid credentials. Please verify your email and password.",
      };
    }

    await db.users.updateLastLogin(user.id);
    const orgs = await db.organizations.getUserOrganizations(user.id);
    const primaryOrg = orgs[0]?.name || "Personal Workspace";

    await db.auditLogs.record({
      userId: user.id,
      action: "AUTH_LOGIN_SUCCESS",
      details: { email: user.email },
    });

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organization: primaryOrg,
      avatarInitials: user.avatarInitials || "CR",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Sign-in error occurred";
    return { message: msg };
  }

  redirect("/dashboard");
}

export async function signout(): Promise<void> {
  const user = await getCurrentUser();
  if (user) {
    await db.auditLogs.record({
      userId: user.id,
      action: "AUTH_LOGOUT",
      details: { email: user.email },
    });
  }
  await deleteSession();
  redirect("/");
}

export async function forgotPassword(formData: FormData): Promise<ActionResponse> {
  const email = (formData.get("email") as string) || "";
  const validated = ForgotPasswordSchema.safeParse({ email });

  if (!validated.success) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const user = await db.users.findByEmail(email);
  if (!user) {
    // Return generic success to prevent email enumeration
    return {
      success: true,
      message: "If an account exists with this email, instructions have been prepared.",
    };
  }

  const resetToken = generateSecureToken(32);
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await db.users.setResetToken(email, resetToken, expiry);

  await db.auditLogs.record({
    userId: user.id,
    action: "AUTH_PASSWORD_RESET_REQUESTED",
    details: { email },
  });

  return {
    success: true,
    message: "Password reset instructions generated successfully.",
    data: { resetToken, resetUrl: `/reset-password?token=${resetToken}` },
  };
}

export async function resetPassword(formData: FormData): Promise<ActionResponse> {
  const token = (formData.get("token") as string) || "";
  const password = (formData.get("password") as string) || "";

  const validated = ResetPasswordSchema.safeParse({ token, password });
  if (!validated.success) {
    return {
      success: false,
      message: "Password does not meet security requirements.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const user = await db.users.findByResetToken(token);
  if (!user) {
    return {
      success: false,
      message: "Invalid or expired password reset link. Please request a new one.",
    };
  }

  const newHash = await bcrypt.hash(password, 12);
  await db.users.updatePassword(user.id, newHash);

  await db.auditLogs.record({
    userId: user.id,
    action: "AUTH_PASSWORD_RESET_COMPLETED",
    details: { email: user.email },
  });

  return {
    success: true,
    message: "Your password has been reset successfully. You can now sign in.",
  };
}

export async function verifyEmail(token: string): Promise<ActionResponse> {
  const user = await db.users.findByVerificationToken(token);
  if (!user) {
    return {
      success: false,
      message: "Invalid or expired email verification link.",
    };
  }

  await db.users.verifyEmail(user.id);
  await db.auditLogs.record({
    userId: user.id,
    action: "AUTH_EMAIL_VERIFIED",
    details: { email: user.email },
  });

  return {
    success: true,
    message: "Email address verified successfully.",
  };
}

export async function updateProfile(formData: FormData): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized. Please sign in." };
  }

  const name = (formData.get("name") as string) || "";
  const validated = UpdateProfileSchema.safeParse({ name });

  if (!validated.success) {
    return {
      success: false,
      message: "Invalid profile data.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  await db.users.updateProfile(user.id, { name });
  await db.auditLogs.record({
    userId: user.id,
    action: "USER_PROFILE_UPDATED",
    details: { name },
  });

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}

export async function changePassword(formData: FormData): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized." };
  }

  const currentPassword = (formData.get("currentPassword") as string) || "";
  const newPassword = (formData.get("newPassword") as string) || "";

  const validated = ChangePasswordSchema.safeParse({ currentPassword, newPassword });
  if (!validated.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const storedUser = await db.users.findById(user.id);
  if (!storedUser) {
    return { success: false, message: "User record not found." };
  }

  const isMatch = await bcrypt.compare(currentPassword, storedUser.passwordHash);
  if (!isMatch) {
    return { success: false, message: "Current password does not match our records." };
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await db.users.updatePassword(user.id, newHash);

  await db.auditLogs.record({
    userId: user.id,
    action: "AUTH_PASSWORD_CHANGED",
    details: { email: user.email },
  });

  return {
    success: true,
    message: "Password changed successfully.",
  };
}

export async function deleteAccount(confirmationText: string): Promise<ActionResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Unauthorized." };
  }

  if (confirmationText !== "DELETE") {
    return {
      success: false,
      message: "Please type DELETE exactly to confirm account deletion.",
    };
  }

  await db.auditLogs.record({
    userId: user.id,
    action: "USER_ACCOUNT_DELETED",
    details: { email: user.email },
  });

  await db.users.deleteAccount(user.id);
  await deleteSession();

  return {
    success: true,
    message: "Your account and all associated workspace data have been permanently deleted.",
  };
}
