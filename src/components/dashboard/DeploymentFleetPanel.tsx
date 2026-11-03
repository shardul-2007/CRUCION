"use client";

import React from "react";
import {
  Rocket,
  CheckCircle2,
  Clock,
  Activity,
  Cpu,
  Layers,
  ArrowUpRight,
  GitCommit,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function DeploymentFleetPanel() {
  const { deployments, promoteDeployment } = useCrucionStore();

  const getEnvBadge = (env: string) => {
    switch (env) {
      case "production":
        return <Badge variant="emerald" size="sm" dot>Production</Badge>;
      case "staging":
        return <Badge variant="amber" size="sm" dot>Staging</Badge>;
      case "edge-container":
        return <Badge variant="fusion" size="sm" dot>Edge Fleet</Badge>;
      default:
        return <Badge variant="outline" size="sm">{env}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge variant="emerald" size="sm">100% Traffic</Badge>;
      case "rolling_update":
        return <Badge variant="crucible" size="sm">Rolling Update</Badge>;
      case "canary":
        return <Badge variant="amber" size="sm">Canary (20%)</Badge>;
      default:
        return <Badge variant="rose" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111522] p-4 rounded-xl border border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399]">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
              MicroVM Container Fleet & Deployments
              <Badge variant="emerald" size="sm">
                CRUCION DEPLOY
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero-downtime rolling upgrades, anycast edge routing, and automated rollback health checks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="h-2 w-2 rounded-full bg-[#34D399]" />
          <span>Global Anycast: 48 POPs Online</span>
        </div>
      </div>

      {/* Deployments Table / Cards */}
      <div className="space-y-3">
        {deployments.map((dep) => (
          <Card
            key={dep.id}
            className="p-4 bg-[#111522] border-white/[0.08] hover:border-white/15 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Column: Project, Env, Commit */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-white text-sm font-['Space_Grotesk',sans-serif]">
                    {dep.projectName}
                  </span>
                  {getEnvBadge(dep.environment)}
                  {getStatusBadge(dep.status)}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <GitCommit className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono text-slate-400">{dep.commitSha}</span>
                  <span className="text-slate-400 truncate max-w-sm">{dep.commitMsg}</span>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 pt-0.5">
                  <span>Region: {dep.region}</span>
                  <span>Deployed: {dep.deployedAt}</span>
                  <a
                    href={dep.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#22D3EE] hover:underline"
                  >
                    <span>{dep.liveUrl}</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: Performance Telemetry & Promotion Action */}
              <div className="flex items-center justify-between lg:justify-end gap-5 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/[0.06]">
                <div className="flex items-center gap-5 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Latency</div>
                    <span className="text-[#34D399] font-bold">{dep.latencyMs}ms</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">CPU Load</div>
                    <span className="text-slate-200 font-medium">{dep.cpuPercent}%</span>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Memory</div>
                    <span className="text-slate-200 font-medium">{dep.memoryMb}MB</span>
                  </div>
                </div>

                {dep.status === "canary" ? (
                  <Button
                    size="sm"
                    variant="emerald"
                    onClick={() => promoteDeployment(dep.id)}
                    className="shrink-0"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>Promote 100%</span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-[#34D399] font-mono">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Healthy</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
