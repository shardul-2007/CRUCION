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
  Sparkles,
  Server,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function FeatureShowcase() {
  return (
    <section id="agent-os" className="py-20 relative space-y-24">
      {/* Feature 1: Autonomous AgentOS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="fusion" size="md">
                CRUCION AGENT
              </Badge>
              <span className="text-xs font-mono text-slate-400">AgentOS Swarm Protocol</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
              Autonomous AI Agents with Direct Container Grounding
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              AgentOS isn’t a superficial chatbot—it is an autonomous engineering workforce. Agents operate directly inside container workspaces, executing cargo commands, analyzing ASTs, fixing bugs, and triggering test suites with strict isolation.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "AST-level code comprehension with cross-file symbol indexing",
                "Subagent delegation for parallelized research and security checks",
                "Deterministic tool execution loop with automated rollback on test failure",
                "Multi-model routing (Crucion DeepReason Pro & FastLane Ultra)",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/dashboard">
                <Button size="md" variant="secondary">
                  <Bot className="h-4 w-4" />
                  <span>Inspect Active Swarms</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive Agent Terminal Visualizer */}
          <div className="rounded-2xl bg-[#0B0D14] border border-white/10 shadow-2xl p-5 font-mono text-xs text-slate-300 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-400 text-[11px]">agent-os://aethelgard-7@crucion</span>
              </div>
              <Badge variant="emerald" size="sm" dot>
                Loop Active
              </Badge>
            </div>

            <div className="space-y-2 text-[11px] leading-relaxed">
              <p className="text-slate-500">// Task: Refactor eBPF memory buffers in container runtime kernel</p>
              <p className="text-[#22D3EE]">[15:52:10] AST Indexed: 42 modules, 1,280 symbols parsed in 82ms</p>
              <p className="text-[#8B5CF6]">[15:52:14] Invoking tool: cargo clippy --all-targets -- -D warnings</p>
              <p className="text-[#34D399]">[15:52:19] Optimization: Replaced 14 raw pointers with zero-copy RingBufferRef</p>
              <p className="text-slate-300">[15:52:25] Fuzzing benchmarks: L1 cache miss reduced by 34.2%</p>
              <p className="text-[#34D399] font-bold">[15:52:29] Verified: All 48 container unit and invariant tests passing</p>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-400">
              <span>Token Usage: 142.8k</span>
              <span>Tools Run: 28</span>
              <span>Duration: 7m 12s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 2: MicroVM Fleet & Zero-Downtime Deployment */}
      <div id="microvm" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Visual Metrics Card */}
          <div className="order-2 lg:order-1 rounded-2xl bg-[#111522] border border-white/[0.08] p-6 lg:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-[#34D399]" />
                <span className="font-bold text-white text-sm font-['Space_Grotesk',sans-serif]">
                  CRUCION DEPLOY — Global Canary Mesh
                </span>
              </div>
              <Badge variant="emerald" size="sm">
                48 POPs Live
              </Badge>
            </div>

            <div className="space-y-3">
              {[
                {
                  region: "us-east-metal (Virginia)",
                  env: "Production",
                  traffic: "100%",
                  ping: "1.2ms",
                  status: "Healthy",
                },
                {
                  region: "eu-central-edge (Frankfurt)",
                  env: "Canary",
                  traffic: "20%",
                  ping: "2.1ms",
                  status: "Synchronized",
                },
                {
                  region: "ap-south-gpu (Mumbai)",
                  env: "Staging",
                  traffic: "100%",
                  ping: "4.6ms",
                  status: "Healthy",
                },
              ].map((cluster, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#0E121D] border border-white/[0.06] flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="font-bold text-white">{cluster.region}</div>
                    <div className="text-[10px] text-slate-400">{cluster.env} • Traffic: {cluster.traffic}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#34D399] font-bold">{cluster.ping}</span>
                    <span className="text-[10px] text-slate-500 block">{cluster.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Automatic rollback threshold: p99 &gt; 15ms</span>
              <span className="text-[#34D399]">0 Failovers</span>
            </div>
          </div>

          {/* Right Column: Copy */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Badge variant="emerald" size="md">
                CRUCION DEPLOY
              </Badge>
              <span className="text-xs font-mono text-slate-400">Multi-Cloud MicroVM Fleet</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
              Microsecond Anycast Deployment & Instant Rollback
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Deploy containers across bare-metal microVM instances worldwide. Canary distributions shift traffic gradually while automated telemetry probes verify error budgets, memory saturation, and p99 latency in real time.
            </p>

            <div className="space-y-3 pt-2">
              {[
                "Firecracker microVM isolation with hardware memory protection",
                "Automated progressive traffic promotion (10% → 50% → 100%)",
                "Instant zero-downtime rollbacks if error budget spikes",
                "Zero-copy socket splicing with Anycast BGP routing",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-[#34D399] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href="/dashboard">
                <Button size="md" variant="primary">
                  <span>Enter Fleet Console</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
