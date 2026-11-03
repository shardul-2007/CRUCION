"use client";

import React, { useState } from "react";
import {
  Bot,
  Play,
  Pause,
  Terminal,
  Cpu,
  Zap,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Plus,
  Radio,
  FileCode,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export function AgentOSPanel() {
  const { agents, dispatchAgentTask, toggleAgentState } = useCrucionStore();
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>("agent-01");
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // New task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [role, setRole] = useState("Codebase Refactoring Specialist");
  const [model, setModel] = useState("Crucion DeepReason (Pro)");

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    dispatchAgentTask(taskTitle, role, model);
    setTaskTitle("");
    setIsDispatchModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge variant="crucible" size="sm" dot>
            Running
          </Badge>
        );
      case "executing_tool":
        return (
          <Badge variant="fusion" size="sm" dot>
            Executing Tool
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="emerald" size="sm" dot>
            Completed
          </Badge>
        );
      case "idle":
        return (
          <Badge variant="outline" size="sm">
            Standby
          </Badge>
        );
      default:
        return (
          <Badge variant="amber" size="sm">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Quick Dispatch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111522] p-4 rounded-xl border border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
              AgentOS Swarm Telemetry
              <Badge variant="fusion" size="sm">
                CRUCION AGENT
              </Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Autonomous cognitive loops, real-time tool grounding, and container execution.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsDispatchModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Dispatch Agent Task</span>
        </Button>
      </div>

      {/* Agents Run Cards */}
      <div className="space-y-3">
        {agents.map((agent) => {
          const isExpanded = expandedAgentId === agent.id;

          return (
            <Card
              key={agent.id}
              className="bg-[#111522] border-white/[0.08] hover:border-white/15 transition-all overflow-hidden"
            >
              {/* Main Agent Row */}
              <div className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Agent Info */}
                <div className="flex items-start gap-3 flex-1">
                  <div className="relative mt-0.5">
                    <div className="h-9 w-9 rounded-lg bg-[#171C2A] border border-white/10 flex items-center justify-center text-[#8B5CF6]">
                      <Cpu className="h-4.5 w-4.5" />
                    </div>
                    {agent.status === "running" || agent.status === "executing_tool" ? (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34D399]" />
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm font-mono">
                        {agent.agentName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">({agent.role})</span>
                      {getStatusBadge(agent.status)}
                    </div>

                    <p className="text-xs text-slate-200 font-medium">{agent.taskTitle}</p>

                    {agent.currentAction && (
                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#67E8F9] pt-0.5">
                        <Terminal className="h-3 w-3 shrink-0" />
                        <span className="truncate">{agent.currentAction}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics & Controls */}
                <div className="flex items-center justify-between lg:justify-end gap-3 lg:gap-5 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/[0.06]">
                  {/* Token Usage & Tools */}
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Tokens</div>
                      <span className="text-slate-200 font-semibold">
                        {(agent.tokenUsage / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Tools Run</div>
                      <span className="text-slate-200 font-semibold">{agent.toolsExecuted}</span>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Elapsed</div>
                      <span className="text-slate-200 font-semibold">
                        {Math.floor(agent.durationSeconds / 60)}m {agent.durationSeconds % 60}s
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleAgentState(agent.id)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 transition-colors"
                      title={agent.status === "idle" ? "Resume Agent" : "Pause Agent"}
                    >
                      {agent.status === "idle" ? (
                        <Play className="h-3.5 w-3.5 text-[#34D399]" />
                      ) : (
                        <Pause className="h-3.5 w-3.5 text-amber-400" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedAgentId(isExpanded ? null : agent.id)
                      }
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                      title={isExpanded ? "Collapse Logs" : "View Logs"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Live Execution Logs */}
              {isExpanded && agent.logPreview && (
                <div className="border-t border-white/[0.06] bg-[#0A0D15] p-3 text-[11px] font-mono space-y-1">
                  <div className="text-[10px] uppercase text-slate-500 tracking-wider font-semibold pb-1">
                    Live Stream Telemetry & Tool Invocations
                  </div>
                  {agent.logPreview.map((log, index) => (
                    <div key={index} className="text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-[#8B5CF6] select-none">›</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Dispatch Modal */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#22D3EE]" />
            <span>Dispatch Autonomous Agent Run</span>
          </div>
        }
        description="Launch an isolated subagent inside the container runtime with real-time tool grounding."
      >
        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-300 font-medium">
              Task Objective
            </label>
            <Input
              required
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Profile microVM memory allocator and eliminate zero-copy overhead"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-300 font-medium">
              Agent Persona & Role
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. SRE Automation Specialist, Code Reviewer, Security Auditor"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-slate-300 font-medium">
              Reasoning Engine Model
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Crucion DeepReason (Pro)", "Crucion FastLane (Ultra)"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-mono ${
                    model === m
                      ? "bg-[#8B5CF6]/15 border-[#8B5CF6] text-white"
                      : "bg-[#0E121D] border-white/10 text-slate-400"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDispatchModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary">
              <Zap className="h-4 w-4" />
              <span>Launch Agent</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
