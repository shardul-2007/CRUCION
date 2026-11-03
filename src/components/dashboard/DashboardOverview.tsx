"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  FolderGit2,
  Bot,
  Rocket,
  ShieldCheck,
  Terminal,
  Server,
  Layers,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { TelemetryGauges } from "./TelemetryGauges";
import { ProjectCardsGrid } from "./ProjectCardsGrid";
import { AgentOSPanel } from "./AgentOSPanel";
import { DeploymentFleetPanel } from "./DeploymentFleetPanel";
import { LiveActivityStream } from "./LiveActivityStream";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function DashboardOverview() {
  const {
    setActiveNav,
    setIsNewProjectModalOpen,
    projects,
    agents,
    deployments,
    activeCluster,
  } = useCrucionStore();

  return (
    <div className="space-y-6">
      {/* Hero Command Center Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#171C2A] via-[#111522] to-[#171C2A] border border-white/[0.08] p-6 lg:p-8 overflow-hidden shadow-2xl">
        {/* Glow Accent Circles */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-[#22D3EE]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="crucible" size="md">
                CRUCION CORE v2.4.0
              </Badge>
              <Badge variant="fusion" size="md">
                Active Cluster: {activeCluster.split(" ")[0]}
              </Badge>
              <Badge variant="emerald" size="md" dot>
                Global Grid Online
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
              Engineering Command Center
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Universal software engineering ecosystem. Multi-agent autonomous swarms, microVM container orchestration, zero-downtime canary pipelines, and edge fabric.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              size="lg"
              variant="primary"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Forge Project</span>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setActiveNav("agent-os")}
            >
              <Bot className="h-4 w-4" />
              <span>Inspect AgentOS</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Metrics Gauges */}
      <TelemetryGauges />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width on desktop): Projects & Agents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects Header & Quick Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-[#8B5CF6]" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk',sans-serif]">
                  Active Workspaces & Projects
                </h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveNav("projects")}
                className="text-xs text-[#22D3EE] hover:text-[#67E8F9]"
              >
                <span>View All ({projects.length})</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>

            <ProjectCardsGrid />
          </div>

          {/* Autonomous AgentOS Swarm */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#22D3EE]" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk',sans-serif]">
                  Autonomous AgentOS Swarms
                </h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveNav("agent-os")}
                className="text-xs text-[#22D3EE] hover:text-[#67E8F9]"
              >
                <span>Full Swarm Telemetry</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>

            <AgentOSPanel />
          </div>

          {/* Deployments Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-[#34D399]" />
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk',sans-serif]">
                  MicroVM Container Deployments
                </h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setActiveNav("deployments")}
                className="text-xs text-[#34D399] hover:text-[#6EE7B7]"
              >
                <span>Fleet Overview</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>

            <DeploymentFleetPanel />
          </div>
        </div>

        {/* Right Column (1/3 width on desktop): Live Activity Stream & Security Card */}
        <div className="space-y-6">
          {/* CRUCION SHIELD Card */}
          <Card className="p-5 bg-[#111522] border-white/[0.08] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-bold text-xs uppercase font-mono tracking-wider">
                  CRUCION SHIELD
                </span>
              </div>
              <Badge variant="emerald" size="sm" dot>
                Zero-Trust Active
              </Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated cryptographic SBOM attestations, eBPF sandbox policy verification, and weekly mTLS key rotation.
            </p>
            <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
              <div>Vulnerabilities: 0</div>
              <div>Attestations: 100%</div>
            </div>
          </Card>

          {/* Live Activity Stream */}
          <LiveActivityStream />

          {/* Quick System Diagnostics */}
          <Card className="p-4 bg-[#111522] border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Kernel Nodes
              </span>
              <span className="text-xs font-mono text-[#34D399]">3/3 Synced</span>
            </div>
            <div className="space-y-2 text-xs font-mono text-slate-400">
              <div className="flex justify-between p-2 rounded bg-[#0E121D]">
                <span>us-east-metal</span>
                <span className="text-[#34D399]">Leader (1.2ms)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0E121D]">
                <span>eu-central-edge</span>
                <span className="text-[#34D399]">Follower (2.1ms)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0E121D]">
                <span>ap-south-gpu</span>
                <span className="text-[#34D399]">Follower (4.6ms)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
