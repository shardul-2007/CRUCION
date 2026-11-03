"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Terminal,
  ShieldCheck,
  Zap,
  Bot,
  Container,
  Sparkles,
  Server,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-grid-cyber">
      {/* Dynamic Background Radiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#8B5CF6]/20 via-[#22D3EE]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        {/* Release / Motto Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171C2A] border border-[#8B5CF6]/30 shadow-[0_0_20px_-3px_rgba(139,92,246,0.3)] animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
          </span>
          <span className="text-[11px] font-mono font-semibold tracking-wider text-[#C4B5FD] uppercase">
            Official Motto
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs font-mono text-slate-300">
            One Container. Every Technology. From Idea to Enterprise.
          </span>
        </div>

        {/* Main Hero Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif] leading-[1.08]">
            The Universal Software <br />
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#22D3EE] bg-clip-text text-transparent">
              Engineering Ecosystem
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Unify high-performance microVM container orchestration, autonomous AgentOS swarms, zero-downtime canary pipelines, and edge network fabrics in one obsidian command center.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto px-8 py-3.5 text-base shadow-[0_0_30px_-5px_rgba(139,92,246,0.6)] hover:shadow-[0_0_35px_0_rgba(139,92,246,0.8)]"
            >
              <Terminal className="h-4.5 w-4.5" />
              <span>Launch Engineering Console</span>
              <ArrowRight className="h-4.5 w-4.5 ml-1.5" />
            </Button>
          </Link>

          <a href="#architecture" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto px-7 py-3.5 text-base"
            >
              <Container className="h-4.5 w-4.5" />
              <span>Explore MicroVM Container</span>
            </Button>
          </a>
        </div>

        {/* Live Grid Metrics Ticker */}
        <div className="pt-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-2xl bg-[#111522]/80 backdrop-blur-md border border-white/[0.08]">
            <div className="p-3 text-center border-r border-white/[0.06] last:border-r-0">
              <div className="text-2xl font-bold font-['Space_Grotesk',sans-serif] text-white">
                &lt;400ms
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                MicroVM Boot Time
              </div>
            </div>

            <div className="p-3 text-center border-r border-white/[0.06] last:border-r-0">
              <div className="text-2xl font-bold font-['Space_Grotesk',sans-serif] text-[#22D3EE]">
                12 Pillars
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Unified Ecosystem
              </div>
            </div>

            <div className="p-3 text-center border-r border-white/[0.06] last:border-r-0">
              <div className="text-2xl font-bold font-['Space_Grotesk',sans-serif] text-[#34D399]">
                1.2ms
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Anycast p99 Latency
              </div>
            </div>

            <div className="p-3 text-center">
              <div className="text-2xl font-bold font-['Space_Grotesk',sans-serif] text-[#8B5CF6]">
                100%
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Zero-Trust Verification
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
