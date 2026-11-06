"use client";

import React, { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/actions/auth";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    resetUrl?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("email", email);
    const res = await forgotPassword(formData);
    setLoading(false);

    const dataObj = res.data as { resetUrl?: string } | undefined;
    setResult({
      success: res.success,
      message: res.message,
      resetUrl: dataObj?.resetUrl,
    });
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
              Reset your password
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Enter the work email associated with your Crucion account.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm overflow-hidden p-6 sm:p-8">
            {result?.success ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Reset Token Issued</span>
                  </div>
                  <p>{result.message}</p>
                </div>

                {result.resetUrl && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                    <span className="font-mono text-slate-500 text-[11px] block">
                      Local Development Direct Link:
                    </span>
                    <Link
                      href={result.resetUrl}
                      className="text-[#0066cc] font-mono break-all hover:underline font-semibold"
                    >
                      Click here to reset your password →
                    </Link>
                  </div>
                )}

                <Link href="/signin" className="block pt-2">
                  <Button size="md" variant="secondary" className="w-full">
                    Return to Sign In
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
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    icon={<Mail className="h-4 w-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={loading}
                  disabled={loading}
                >
                  <span>{loading ? "Sending..." : "Send Reset Instructions"}</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
