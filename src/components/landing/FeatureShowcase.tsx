"use client";

import React from "react";
import Link from "next/link";
import {
  Bot,
  Terminal,
  Cpu,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Server,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function FeatureShowcase() {
  return (
    <section id="agent-os" className="py-20 bg-slate-50/70 space-y-24 border-b border-slate-100">
      {/* Feature 1: Autonomous AgentOS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="blue" size="md">
                CRUCION AGENT
              </Badge>
              <span className="text-xs font-mono text-slate-500">AgentOS Swarm Protocol</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif] tracking-tight">
              Autonomous AI Agents with Direct Container Grounding
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              AgentOS isn’t a superficial chatbot—it is an autonomous engineering workforce. Agents operate directly inside container workspaces, executing cargo commands, analyzing ASTs, fixing bugs, and triggering test suites with strict isolation.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "AST-level code comprehension with cross-file symbol indexing",
                "Subagent delegation for parallelized research and security checks",
                "Deterministic tool execution loop with automated rollback on test failure",
                "Multi-model routing (Claude 3.7, GPT-4o, Gemini 2.5, local Ollama)",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/dashboard">
                <Button size="md" variant="secondary">
                  <Bot className="h-4 w-4" />
                  <span>Open AgentOS Console</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Agent Simulation Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">
                  Agent Swarm: CrucionBot-742
                </span>
              </div>
              <Badge variant="emerald" size="sm">
                Running in MicroVM
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs font-mono text-slate-700">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Active Objective</div>
                <div className="text-slate-900 font-medium mt-1">
                  Optimize memory layout in eBPF socket listener and run zero-copy tests
                </div>
              </div>

              {/* Execution Trace */}
              <div className="rounded-lg bg-slate-900 p-3.5 text-xs font-mono text-slate-300 space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                  <span>Execution Log</span>
                  <span className="text-emerald-400">Step 3 of 4</span>
                </div>
                <div className="text-sky-400">[00:01.2] Indexed 42 AST symbols across 8 modules</div>
                <div className="text-sky-400">[00:02.8] Applied memory alignment in src/kernel/socket.rs</div>
                <div className="text-emerald-400">[00:04.1] Cargo test suite passed: 18 passed; 0 failed</div>
                <div className="text-slate-400 animate-pulse">[00:05.0] Verifying TLS termination latency...</div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                <span>Tokens: 1,420</span>
                <span>Latency: 1.2ms</span>
                <span className="text-emerald-600 font-medium">State: Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: Deployments */}
      <div id="microvm" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-[#0066cc]" />
                <span className="text-xs font-mono font-bold text-slate-900">
                  Global Canary Traffic Distribution
                </span>
              </div>
              <Badge variant="blue" size="sm">
                48 Edge POPs
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600">Canary Fleet (v2.1.0)</span>
                  <span className="text-[#0066cc] font-bold">10%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#0066cc] rounded-full w-[10%]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-600">Baseline Production Fleet (v2.0.4)</span>
                  <span className="text-slate-700 font-bold">90%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full w-[90%]" />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center justify-between">
                <span>Automated Rollback Criteria:</span>
                <span className="font-bold">Error rate &lt; 0.01%</span>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="emerald" size="md">
                CRUCION DEPLOY
              </Badge>
              <span className="text-xs font-mono text-slate-500">Zero-Downtime Rollouts</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif] tracking-tight">
              Instant Global Deployments with Atomic Canary Shifts
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Ship updates in milliseconds without taking traffic down. CRUCION manages fractional traffic shifts, verifies latency heatmaps across worldwide regions, and instantly rolls back if anomalies are detected.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Anycast routing to the nearest microVM cluster in under 5ms",
                "Sub-second container warm starts via pre-allocated kernel caches",
                "Full cryptographic signature verification on every image layer",
                "Automated SSL/TLS certificate lifecycle management",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/dashboard">
                <Button size="md" variant="primary">
                  <Rocket className="h-4 w-4" />
                  <span>Inspect Deployment Fleets</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
