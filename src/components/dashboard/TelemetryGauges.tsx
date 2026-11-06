"use client";

import React from "react";
import {
  Cpu,
  Layers,
  Container,
  Bot,
  Activity,
  Server,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function TelemetryGauges() {
  const { telemetry, activeCluster } = useCrucionStore();

  const metrics = [
    {
      label: "Container Fleet",
      value: `${telemetry.activeContainers} MicroVMs`,
      detail: "Firecracker v1.9 isolation",
      icon: Container,
      accent: "text-[#0066cc]",
      badge: "Optimal",
      badgeVariant: "emerald" as const,
    },
    {
      label: "Autonomous Agents",
      value: `${telemetry.activeAgents} Swarms`,
      detail: "Cognitive task loops",
      icon: Bot,
      accent: "text-sky-600",
      badge: "Autonomous",
      badgeVariant: "blue" as const,
    },
    {
      label: "Cluster CPU Load",
      value: `${telemetry.cpuLoadPercent}%`,
      detail: `Cluster: ${activeCluster.split(" ")[0]}`,
      icon: Cpu,
      accent: "text-amber-600",
      badge: "Healthy",
      badgeVariant: "emerald" as const,
    },
    {
      label: "Memory Utilization",
      value: `${telemetry.memoryUsedGb} / ${telemetry.memoryTotalGb} GB`,
      detail: "ZFS zero-copy cache",
      icon: Layers,
      accent: "text-indigo-600",
      badge: "Normal",
      badgeVariant: "outline" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card key={idx} className="p-4 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${m.accent}`} />
                <span className="text-xs font-mono text-slate-500 uppercase">{m.label}</span>
              </div>
              <Badge variant={m.badgeVariant} size="sm" dot>
                {m.badge}
              </Badge>
            </div>

            <div>
              <div className="text-2xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
                {m.value}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{m.detail}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
