"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { verifyEmail } from "@/app/actions/auth";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = use(searchParams);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleVerify = async () => {
    if (!token) return;
    setLoading(true);
    const res = await verifyEmail(token);
    setLoading(false);
    setResult(res);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#0066cc]/15 selection:text-slate-900">
      <nav className="w-full px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between max-w-7xl mx-auto border-b border-slate-100">
        <CrucionLogo size="md" showMotto={false} asLink={true} />
        <Link href="/dashboard">
          <Button size="sm" variant="secondary">
            <span>Command Center</span>
          </Button>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
            Email Verification
          </h1>

          <div className="rounded-xl border border-slate-200/90 bg-white shadow-sm p-6 sm:p-8 space-y-4">
            {!token ? (
              <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-2">
                <ShieldAlert className="h-5 w-5 mx-auto text-rose-600" />
                <p>Missing email verification token.</p>
              </div>
            ) : result?.success ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-2">
                  <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-600" />
                  <p className="font-semibold text-sm">Email Address Verified!</p>
                  <p>{result.message}</p>
                </div>
                <Link href="/dashboard" className="block pt-2">
                  <Button size="md" variant="primary" className="w-full">
                    Go to Workspace Dashboard
                  </Button>
                </Link>
              </div>
            ) : result?.success === false ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  <p>{result.message}</p>
                </div>
                <Link href="/dashboard" className="block">
                  <Button size="md" variant="secondary" className="w-full">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Click the button below to confirm and verify your enterprise email address.
                </p>
                <Button
                  onClick={handleVerify}
                  size="lg"
                  variant="primary"
                  className="w-full"
                  isLoading={loading}
                >
                  Confirm & Verify Email
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
