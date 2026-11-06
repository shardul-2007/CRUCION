"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a letter", met: /[a-zA-Z]/.test(password) },
    { label: "Contains a number", met: /[0-9]/.test(password) },
    { label: "Contains a special character", met: /[^a-zA-Z0-9]/.test(password) },
  ];

  const strengthCount = passwordChecks.filter((c) => c.met).length;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#0066cc]/15 selection:text-slate-900">
      {/* Navigation */}
      <nav className="w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between max-w-7xl mx-auto border-b border-slate-100">
        <CrucionLogo size="md" showMotto={false} asLink={true} />
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500 hidden sm:inline">
            Already have an account?
          </span>
          <Link href="/signin">
            <Button size="sm" variant="secondary">
              <span>Sign In</span>
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
              Create your workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Start building with isolated microVM containers and autonomous AgentOS swarms.
            </p>
          </div>

          {/* Form Card */}
          <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden p-6 sm:p-8">
            <form action={action} className="space-y-4">
              {/* Error message */}
              {state?.message && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{state.message}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Sarah Connor"
                  icon={<User className="h-4 w-4" />}
                  autoComplete="name"
                  required
                />
                {state?.errors?.name && (
                  <p className="text-[11px] text-rose-600 font-mono">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              {/* Email */}
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
                  placeholder="sarah@enterprise.io"
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

              {/* Organization */}
              <div className="space-y-1.5">
                <label
                  htmlFor="organization"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Organization Name{" "}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <Input
                  id="organization"
                  name="organization"
                  type="text"
                  placeholder="Cyberdyne Systems"
                  icon={<Building2 className="h-4 w-4" />}
                  autoComplete="organization"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    icon={<Lock className="h-4 w-4" />}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                {/* Password Strength Checklist */}
                {password.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            strengthCount >= step
                              ? strengthCount <= 2
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                              : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                      {passwordChecks.map((chk) => (
                        <div
                          key={chk.label}
                          className={`flex items-center gap-1.5 ${
                            chk.met ? "text-emerald-700" : "text-slate-400"
                          }`}
                        >
                          <Check className={`h-3 w-3 ${chk.met ? "opacity-100" : "opacity-30"}`} />
                          <span>{chk.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                <span>{pending ? "Creating Workspace..." : "Create Workspace"}</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </form>
          </div>

          {/* Bottom Security Info */}
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-[#0066cc] hover:underline font-medium"
              >
                Sign in to console →
              </Link>
            </p>
            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Zero-Trust Active
              </span>
              <span>·</span>
              <span>Organization Multi-Tenancy</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
