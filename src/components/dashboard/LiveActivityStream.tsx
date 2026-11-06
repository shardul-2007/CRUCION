"use client";

import React, { useState } from "react";
import {
  Activity,
  Bot,
  Rocket,
  Hammer,
  ShieldCheck,
  Server,
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
    { id: "build", label: "Builds" },
    { id: "security", label: "Security" },
  ];

  const filtered = activities.filter(
    (act) => filter === "all" || act.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "agent":
        return <Bot className="h-4 w-4 text-sky-600" />;
      case "deploy":
        return <Rocket className="h-4 w-4 text-emerald-600" />;
      case "build":
        return <Hammer className="h-4 w-4 text-amber-600" />;
      case "security":
        return <ShieldCheck className="h-4 w-4 text-rose-600" />;
      default:
        return <Server className="h-4 w-4 text-[#0066cc]" />;
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
        return <Badge variant="blue" size="sm">Info</Badge>;
    }
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#0066cc]" />
          <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-slate-800">
            Live Audit & Event Stream
          </h3>
        </div>
        <Badge variant="blue" size="sm">
          {filtered.length} Events
        </Badge>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-mono">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setFilter(opt.id)}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              filter === opt.id
                ? "bg-[#0066cc] text-white font-medium"
                : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-2 max-h-96 overflow-y-auto divide-y divide-slate-100 pr-1">
        {filtered.map((act) => (
          <div key={act.id} className="pt-2.5 first:pt-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(act.type)}
                <span className="font-semibold text-xs text-slate-900 line-clamp-1">
                  {act.title}
                </span>
              </div>
              {getSeverityBadge(act.severity)}
            </div>

            <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
              {act.description}
            </p>

            <div className="flex items-center justify-between pl-6 text-[10px] text-slate-400 font-mono">
              <span>Actor: {act.actor}</span>
              <span>{act.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
