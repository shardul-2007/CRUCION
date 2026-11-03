"use client";

import React, { useState } from "react";
import {
  Activity,
  Bot,
  Rocket,
  Hammer,
  ShieldCheck,
  Server,
  Filter,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function LiveActivityStream() {
  const { activities } = useCrucionStore();
  const [filter, setFilter] = useState<string>("all");

  const filterOptions = [
    { id: "all", label: "All Events" },
    { id: "agent", label: "AgentOS" },
    { id: "deploy", label: "Deployments" },
    { id: "build", label: "Forge/Build" },
    { id: "security", label: "Security" },
  ];

  const filtered = activities.filter(
    (act) => filter === "all" || act.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "agent":
        return <Bot className="h-4 w-4 text-[#22D3EE]" />;
      case "deploy":
        return <Rocket className="h-4 w-4 text-[#34D399]" />;
      case "build":
        return <Hammer className="h-4 w-4 text-amber-400" />;
      case "security":
        return <ShieldCheck className="h-4 w-4 text-rose-400" />;
      default:
        return <Server className="h-4 w-4 text-[#8B5CF6]" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "success":
        return <Badge variant="emerald" size="sm">Success</Badge>;
      case "warning":
        return <Badge variant="amber" size="sm">Warning</Badge>;
      case "fault":
        return <Badge variant="rose" size="sm">Fault</Badge>;
      default:
        return <Badge variant="fusion" size="sm">Info</Badge>;
    }
  };

  return (
    <Card className="bg-[#111522] border-white/[0.08] overflow-hidden">
      {/* Header with Filters */}
      <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#8B5CF6]" />
          <h4 className="font-semibold text-white text-sm font-['Space_Grotesk',sans-serif]">
            Real-time Execution & Telemetry Log
          </h4>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                filter === opt.id
                  ? "bg-[#8B5CF6]/20 text-white font-medium border border-[#8B5CF6]/40"
                  : "bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stream list */}
      <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-3.5 hover:bg-white/[0.02] transition-colors flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-[#171C2A] border border-white/10 shrink-0 mt-0.5">
              {getTypeIcon(item.type)}
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200 text-xs truncate">
                    {item.title}
                  </span>
                  {getSeverityBadge(item.severity)}
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {item.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono pt-0.5">
                <span>Actor: {item.actor}</span>
                <span>•</span>
                <span className="uppercase">{item.type}</span>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-500">
            No events match the selected filter.
          </div>
        )}
      </div>
    </Card>
  );
}
