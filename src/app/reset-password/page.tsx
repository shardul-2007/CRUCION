"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/actions/auth";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = use(searchParams);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);

    const res = await resetPassword(formData);
    setLoading(false);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#0066cc]/15 selection:text-slate-900">
      <nav className="w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between max-w-7xl mx-auto border-b border-slate-100">
        <CrucionLogo size="md" showMotto={false} asLink={true} />
        <Link href="/signin">
          <Button size="sm" variant="secondary">
            <span>Back to Sign In</span>
          </Button>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
              Set new password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Create a secure, authenticated password for your workspace.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden p-6 sm:p-8">
            {!token ? (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-3">
                <p>Invalid or missing password reset token.</p>
                <Link href="/forgot-password" className="block">
                  <Button size="sm" variant="secondary" className="w-full">
                    Request New Reset Link
                  </Button>
                </Link>
              </div>
            ) : result?.success ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Password Updated</span>
                  </div>
                  <p>{result.message}</p>
                </div>
                <Link href="/signin" className="block pt-2">
                  <Button size="md" variant="primary" className="w-full">
                    Proceed to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {result?.message && (
                  <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>{result.message}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      icon={<Lock className="h-4 w-4" />}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Must be at least 8 characters with letters, numbers, and symbols.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={loading}
                  disabled={loading}
                >
                  <span>{loading ? "Updating..." : "Update Password"}</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
