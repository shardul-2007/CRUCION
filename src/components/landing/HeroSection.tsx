"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowDown } from "lucide-react";

interface AccessLog {
  id: string;
  type: string;
  method: string;
  target: string;
  status: number;
  durationMs: number;
}

const INITIAL_LOGS: AccessLog[] = [
  { id: "1", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
  { id: "2", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
  { id: "3", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 1082 },
  { id: "4", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 1845 },
  { id: "5", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
  { id: "6", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
  { id: "7", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
  { id: "8", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
  { id: "9", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
  { id: "10", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
  { id: "11", type: "ACCESS", method: "GET", target: "[request redacted]", status: 200, durationMs: 0 },
];

export function HeroSection() {
  const [logs, setLogs] = useState<AccessLog[]>(INITIAL_LOGS);
  const [isPaused, setIsPaused] = useState(false);

  // Live streaming effect for access logs
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const latencies = [0, 0, 12, 45, 120, 240, 1150, 0, 0];
      const randomLatency = latencies[Math.floor(Math.random() * latencies.length)];

      const newLog: AccessLog = {
        id: Date.now().toString(),
        type: "ACCESS",
        method: Math.random() > 0.85 ? "POST" : "GET",
        target: "[request redacted]",
        status: 200,
        durationMs: randomLatency,
      };

      setLogs((prev) => [...prev.slice(1), newLog]);
    }, 2400);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Headline & Direct Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Kicker tag uppercase */}
            <div className="text-[11px] font-mono font-semibold tracking-wider text-[#0066cc] uppercase">
              PROTECT THE ORIGIN. UNDERSTAND THE INCIDENT.
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.1] font-['Space_Grotesk',sans-serif]">
              A swarm can look human. <br />
              <span className="text-[#0066cc]">See the pressure behind it.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
              Crucion brings infrastructure signals, bounded evidence, and incident review into one
              workspace. Understand coordinated traffic and application failures at the origin—without
              blaming a browser, country, or single IP.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0066cc] hover:bg-[#0052a3] text-white font-medium text-sm sm:text-base shadow-sm transition-all"
              >
                <span>Create your workspace</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <a
                href="#architecture"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium text-sm sm:text-base shadow-sm transition-all"
              >
                <span>See how it works</span>
                <ArrowDown className="h-4 w-4 text-slate-500" />
              </a>
            </div>

            {/* Subtext info */}
            <div className="text-xs text-slate-500 font-normal pt-2">
              Organization-scoped fleets · Redacted evidence · Human-controlled response
            </div>
          </div>

          {/* Right Column: Live Access Log Feed matching GuardScale screenshot */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-xl border border-slate-100 bg-[#fbfcfd] p-4 sm:p-6 shadow-sm">
              {/* Access Logs Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <span>Signal Stream</span>
                <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>

              {/* Streaming Table Rows */}
              <div className="divide-y divide-slate-100/80 font-mono text-xs py-1 select-none">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="grid grid-cols-12 py-1.5 items-center hover:bg-slate-50/70 transition-colors"
                  >
                    <span className="col-span-2 text-sky-600 font-medium text-[11px]">
                      {log.type}
                    </span>
                    <span className="col-span-2 text-sky-700 font-medium text-[11px]">
                      {log.method}
                    </span>
                    <span className="col-span-5 text-sky-500/80 text-[11px] truncate">
                      {log.target}
                    </span>
                    <span className="col-span-1 text-slate-400 text-right text-[11px]">
                      {log.status}
                    </span>
                    <span className="col-span-2 text-sky-600/90 text-right text-[11px]">
                      {log.durationMs} ms
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Control Bar */}
              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0066cc]" />
                  <span className="font-medium text-slate-700">Streaming live</span>
                  <span className="hidden sm:inline">· across organizations · real requests</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] transition-colors shrink-0 shadow-2xs"
                >
                  {isPaused ? "Resume logs" : "Pause logs"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
