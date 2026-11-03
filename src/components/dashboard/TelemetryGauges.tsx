"use client";

import React from "react";
import {
  Cpu,
  Layers,
  Container,
  Bot,
  Activity,
  Zap,
  ShieldCheck,
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
      detail: "Isolation: Firecracker v1.9",
      icon: Container,
      accent: "text-[#8B5CF6]",
      bgGlow: "rgba(139, 92, 246, 0.15)",
      badge: "Optimal",
      badgeVariant: "emerald" as const,
    },
    {
      label: "Autonomous Agents",
      value: `${telemetry.activeAgents} Active Swarms`,
      detail: "Model: Crucion DeepReason",
      icon: Bot,
      accent: "text-[#22D3EE]",
      bgGlow: "rgba(34, 211, 238, 0.15)",
      badge: "Autonomous",
      badgeVariant: "fusion" as const,
    },
    {
      label: "Cluster CPU Load",
      value: `${telemetry.cpuLoadPercent}%`,
      detail: `Cluster: ${activeCluster.split(" ")[0]}`,
      icon: Cpu,
      accent: "text-amber-400",
      bgGlow: "rgba(251, 191, 36, 0.12)",
      badge: "Healthy",
      badgeVariant: "emerald" as const,
    },
    {
      label: "Memory Utilization",
      value: `${telemetry.memoryUsedGb} / ${telemetry.memoryTotalGb} GB`,
      detail: "ZFS zero-copy cache",
      icon: Layers,
      accent: "text-purple-400",
      bgGlow: "rgba(168, 85, 247, 0.12)",
      badge: "36.5% Used",
      badgeVariant: "outline" as const,
    },
    {
      label: "Network Throughput",
      value: `${telemetry.networkThroughputMbps} Mbps`,
      detail: "eBPF low-latency bypass",
      icon: Zap,
      accent: "text-[#34D399]",
      bgGlow: "rgba(52, 211, 153, 0.15)",
      badge: "Line Rate",
      badgeVariant: "emerald" as const,
    },
    {
      label: "Edge p99 Latency",
      value: `${telemetry.p99LatencyMs} ms`,
      detail: "Global anycast SLA: <5ms",
      icon: Activity,
      accent: "text-[#67E8F9]",
      bgGlow: "rgba(34, 211, 238, 0.15)",
      badge: "Sub-2ms",
      badgeVariant: "fusion" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card
            key={idx}
            className="p-4 bg-[#111522] border-white/[0.07] hover:border-white/15 transition-all relative overflow-hidden group"
          >
            {/* Ambient subtle glow background */}
            <div
              className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity"
              style={{ background: m.bgGlow }}
            />

            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-400 font-mono uppercase tracking-wider">
                {m.label}
              </span>
              <Icon className={`h-4 w-4 ${m.accent} shrink-0`} />
            </div>

            <div className="space-y-1">
              <div className="text-xl font-bold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
                {m.value}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 font-mono truncate max-w-[110px]">
                  {m.detail}
                </span>
                <Badge variant={m.badgeVariant} size="sm">
                  {m.badge}
                </Badge>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
