"use client";

import React, { useState } from "react";
import {
  Bot,
  Play,
  Pause,
  Terminal,
  Cpu,
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
  const [model, setModel] = useState("Claude 3.7 Sonnet (Hybrid Reasoning)");

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
          <Badge variant="blue" size="sm" dot>
            Running
          </Badge>
        );
      case "executing_tool":
        return (
          <Badge variant="blue" size="sm" dot>
            Executing Tool
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="emerald" size="sm" dot>
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" size="sm">
            Idle / Suspended
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-50 text-[#0066cc]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-['Space_Grotesk',sans-serif]">
              Autonomous AgentOS Swarms
            </h3>
            <p className="text-xs text-slate-500">
              Cognitive loops operating inside isolated microVM sandboxes.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsDispatchModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Dispatch Agent</span>
        </Button>
      </div>

      {/* Agents List */}
      <div className="space-y-3">
        {agents.map((ag) => {
          const isExpanded = expandedAgentId === ag.id;

          return (
            <Card key={ag.id} className="overflow-hidden">
              <div
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                onClick={() => setExpandedAgentId(isExpanded ? null : ag.id)}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Radio className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{ag.agentName}</span>
                      <span className="text-[11px] font-mono text-slate-400">({ag.role})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{ag.taskTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  <span className="text-slate-500 hidden md:inline">{ag.model}</span>
                  {getStatusBadge(ag.status)}

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleAgentState(ag.id)}
                      className="h-7 px-2.5 text-xs"
                    >
                      {ag.status === "running" || ag.status === "executing_tool" ? (
                        <>
                          <Pause className="h-3 w-3 mr-1" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          <span>Resume</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <div className="text-slate-400 text-[10px]">Tokens Bounded</div>
                      <div className="font-bold text-slate-900 mt-0.5">{ag.tokenUsage.toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <div className="text-slate-400 text-[10px]">Tool Executions</div>
                      <div className="font-bold text-slate-900 mt-0.5">{ag.toolsExecuted}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <div className="text-slate-400 text-[10px]">Execution Time</div>
                      <div className="font-bold text-slate-900 mt-0.5">{ag.durationSeconds}s</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                      <div className="text-slate-400 text-[10px]">Sandbox Runtime</div>
                      <div className="font-bold text-[#0066cc] mt-0.5">MicroVM v8/wasm</div>
                    </div>
                  </div>

                  {/* Terminal Execution Log */}
                  <div className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-200 space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                      <span>Execution Trace</span>
                      <span className="text-sky-400">{ag.currentAction}</span>
                    </div>
                    {(ag.logPreview || []).map((log, idx) => (
                      <div key={idx} className="text-sky-300">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Dispatch Agent Modal */}
      <Modal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        title="Dispatch Cognitive Agent Swarm"
        description="Assign an autonomous engineering agent to inspect code, fix compiler diagnostics, or generate tests inside your container."
      >
        <form onSubmit={handleDispatch} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Task Objective
            </label>
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Audit API route inputs and generate Zod validation schemas"
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Agent Role Specialization
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
            >
              <option value="Codebase Refactoring Specialist">Codebase Refactoring Specialist</option>
              <option value="Zero-Trust Security Auditor">Zero-Trust Security Auditor</option>
              <option value="eBPF Performance Engineer">eBPF Performance Engineer</option>
              <option value="Foundry Smart Contract Invariant Tester">Foundry Smart Contract Invariant Tester</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Reasoning Model Engine
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
            >
              <option value="Claude 3.7 Sonnet (Hybrid Reasoning)">Claude 3.7 Sonnet (Anthropic)</option>
              <option value="GPT-4o (Omni Architecture)">GPT-4o (OpenAI)</option>
              <option value="Gemini 2.5 Pro (Multimodal)">Gemini 2.5 Pro (Google)</option>
              <option value="DeepSeek Coder (Local MicroVM)">DeepSeek Coder (Local Ollama)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDispatchModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Dispatch to Container
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
