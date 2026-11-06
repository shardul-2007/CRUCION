"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  FolderGit2,
  Bot,
  Rocket,
  ShieldCheck,
  Plus,
  Plug,
  ExternalLink,
  Activity,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from "next/link";

export function DashboardOverview() {
  const {
    setActiveNav,
    setIsNewProjectModalOpen,
    projects,
    agents,
    deployments,
    activeCluster,
    telemetry,
  } = useCrucionStore();

  const [userName, setUserName] = useState("Architect");
  const [userOrg, setUserOrg] = useState("Personal Workspace");
  const [integrationsCount, setIntegrationsCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUserName(data.user.name || "Architect");
          setUserOrg(data.user.organization || "Personal Workspace");
          setIntegrationsCount(data.activeIntegrations || 0);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Account Overview Banner (Clean & Light) */}
      <div className="rounded-xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Badge variant="blue" size="sm">
              {userOrg}
            </Badge>
            <Badge variant="emerald" size="sm" dot>
              {activeCluster.split(" ")[0]} Active
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Space_Grotesk',sans-serif]">
            Welcome back, {userName}
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Your unified workspace for microVM container execution, autonomous AgentOS swarms, and zero-downtime edge pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            size="lg"
            variant="primary"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Create New Project</span>
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => setActiveNav("extension-hub")}
          >
            <Plug className="h-4 w-4" />
            <span>Connected Services</span>
          </Button>
        </div>
      </div>

      {/* 2. Key Telemetry & Usage Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-[11px] font-mono text-slate-500 uppercase">Active Projects</div>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-['Space_Grotesk',sans-serif]">
            {projects.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Isolated microVM pods</div>
        </Card>

        <Card className="p-4">
          <div className="text-[11px] font-mono text-slate-500 uppercase">Connected Services</div>
          <div className="text-2xl font-bold text-[#0066cc] mt-1 font-['Space_Grotesk',sans-serif]">
            {integrationsCount > 0 ? `${integrationsCount} Active` : "Setup Required"}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">OpenAI, Gemini, GitHub, etc.</div>
        </Card>

        <Card className="p-4">
          <div className="text-[11px] font-mono text-slate-500 uppercase">p99 Edge Latency</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-['Space_Grotesk',sans-serif]">
            {telemetry.p99LatencyMs}ms
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Global Anycast routing</div>
        </Card>

        <Card className="p-4">
          <div className="text-[11px] font-mono text-slate-500 uppercase">Agent Swarms</div>
          <div className="text-2xl font-bold text-sky-600 mt-1 font-['Space_Grotesk',sans-serif]">
            {agents.filter((a) => a.status === "running").length} Running
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Autonomous task loops</div>
        </Card>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Projects & Deployment Status */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-4 w-4 text-[#0066cc]" />
                  <CardTitle>Recent Projects</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveNav("projects")}
                  className="text-xs text-[#0066cc]"
                >
                  View All ({projects.length})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{proj.name}</span>
                      <Badge variant="blue" size="sm">
                        {proj.containerRuntime}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{proj.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                    <span className="text-slate-400">{proj.cluster}</span>
                    <Badge variant="emerald" size="sm" dot>
                      Optimal
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Deployment Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-emerald-600" />
                  <CardTitle>Deployment Status</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveNav("deployments")}
                  className="text-xs text-emerald-700"
                >
                  Fleet Telemetry
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {deployments.slice(0, 2).map((dep) => (
                  <div
                    key={dep.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium text-xs text-slate-900 flex items-center gap-2">
                        <span>{dep.projectName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{dep.commitSha}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{dep.commitMsg}</div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {dep.latencyMs}ms
                      </span>
                      <a
                        href={dep.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0066cc] hover:underline flex items-center gap-1"
                      >
                        <span>Live URL</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): AI Providers & Agent Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Connected AI Providers Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plug className="h-4 w-4 text-[#0066cc]" />
                  <CardTitle>AI Providers</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveNav("extension-hub")}
                  className="text-xs text-[#0066cc]"
                >
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 space-y-2">
                <div className="text-xs font-semibold text-slate-900">Supported AI Ecosystem:</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-700">
                    OpenAI
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-700">
                    Anthropic
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-700">
                    Google Gemini
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-700">
                    Ollama
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Connect your official API keys with AES-256-GCM encryption to enable autonomous reasoning loops.
              </p>
            </CardContent>
          </Card>

          {/* Recent Agent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-sky-600" />
                  <CardTitle>Recent Agent Swarms</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveNav("agent-os")}
                  className="text-xs text-sky-600"
                >
                  View Swarms
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.slice(0, 2).map((ag) => (
                <div
                  key={ag.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{ag.agentName}</span>
                    <Badge variant={ag.status === "running" ? "emerald" : "outline"} size="sm">
                      {ag.status}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-slate-600">{ag.taskTitle}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Model: {ag.model} · {ag.toolsExecuted} tools executed
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
