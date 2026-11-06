"use client";

import React from "react";
import {
  Rocket,
  CheckCircle2,
  Clock,
  Activity,
  Cpu,
  Layers,
  ExternalLink,
  ShieldCheck,
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
        return <Badge variant="blue" size="sm" dot>Edge Fleet</Badge>;
      default:
        return <Badge variant="outline" size="sm">{env}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge variant="emerald" size="sm">100% Traffic</Badge>;
      case "rolling_update":
        return <Badge variant="blue" size="sm">Rolling Update</Badge>;
      case "canary":
        return <Badge variant="amber" size="sm">Canary (20%)</Badge>;
      default:
        return <Badge variant="rose" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 font-['Space_Grotesk',sans-serif] flex items-center gap-2">
              <span>CRUCION DEPLOY — Global MicroVM Fleets</span>
            </h3>
            <p className="text-xs text-slate-500">
              Zero-downtime rolling updates, canary distributions, and sub-5ms anycast POPs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="sm" dot>
            48 Edge POPs Active
          </Badge>
        </div>
      </div>

      {/* Deployment Cards List */}
      <div className="space-y-3">
        {deployments.map((dep) => (
          <Card key={dep.id} className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-slate-900">{dep.projectName}</span>
                {getEnvBadge(dep.environment)}
                {getStatusBadge(dep.status)}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Deployed {dep.deployedAt}</span>
                <a
                  href={dep.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066cc] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>{dep.liveUrl}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Commit and Performance stats */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-7 space-y-1">
                <div className="text-xs font-mono text-slate-700 flex items-center gap-2">
                  <span className="text-slate-400">Commit:</span>
                  <span className="font-bold">{dep.commitSha}</span>
                  <span className="text-slate-500">· {dep.commitMsg}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Region: {dep.region} · Verification: 100% Cosign Signed
                </div>
              </div>

              <div className="sm:col-span-5 flex items-center justify-between sm:justify-end gap-3 text-xs font-mono">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-slate-400 text-[10px]">Latency</div>
                  <div className="text-emerald-700 font-bold">{dep.latencyMs}ms</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-slate-400 text-[10px]">CPU</div>
                  <div className="text-slate-900 font-bold">{dep.cpuPercent}%</div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-center">
                  <div className="text-slate-400 text-[10px]">Memory</div>
                  <div className="text-slate-900 font-bold">{dep.memoryMb}MB</div>
                </div>

                {dep.status === "canary" && (
                  <Button
                    size="sm"
                    variant="emerald"
                    onClick={() => promoteDeployment(dep.id)}
                  >
                    Promote 100%
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
