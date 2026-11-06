"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { signin } from "@/app/actions/auth";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";

export default function SigninPage() {
  const [state, action, pending] = useActionState(signin, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#0066cc]/15 selection:text-slate-900">
      {/* Navigation */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between max-w-7xl mx-auto border-b border-slate-100">
        <CrucionLogo size="md" showMotto={false} asLink={true} />
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 hidden sm:inline">
            Don&apos;t have an account?
          </span>
          <Link href="/signup">
            <Button size="sm" variant="secondary">
              <span>Create Account</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
              Sign in to Crucion
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Access your engineering workspaces and autonomous AgentOS swarms.
            </p>
          </div>

          {/* Sign In Form Card */}
          <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden p-6 sm:p-8">
            <form action={action} className="space-y-4">
              {/* Error message */}
              {state?.message && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{state.message}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Work Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  icon={<Mail className="h-4 w-4" />}
                  autoComplete="email"
                  required
                />
                {state?.errors?.email && (
                  <p className="text-[11px] text-rose-600 font-mono">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-[#0066cc] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    icon={<Lock className="h-4 w-4" />}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {state?.errors?.password && (
                  <p className="text-[11px] text-rose-600 font-mono">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                variant="primary"
                className="w-full mt-2"
                isLoading={pending}
                disabled={pending}
              >
                <span>{pending ? "Signing in..." : "Sign In"}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </div>

          {/* Bottom Security Info */}
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500">
              New to Crucion?{" "}
              <Link
                href="/signup"
                className="text-[#0066cc] hover:underline font-medium"
              >
                Create your workspace →
              </Link>
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Zero-Trust Active
              </span>
              <span>·</span>
              <span>AES-256 Encrypted</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
