"use client";

import React, { useState } from "react";
import {
  FolderGit2,
  Cpu,
  GitBranch,
  Bot,
  ExternalLink,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HardDrive,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ProjectCardsGrid() {
  const { projects, setIsNewProjectModalOpen } = useCrucionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRuntime, setSelectedRuntime] = useState<string>("All");

  const runtimes = ["All", "Rust / LLVM", "Node 24 / V8", "Python 3.12 / PyPy", "Go 1.23", "Solidity / EVM"];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRuntime =
      selectedRuntime === "All" || project.containerRuntime === selectedRuntime;

    return matchesSearch && matchesRuntime;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111522] p-3 rounded-xl border border-white/[0.07]">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects by name, stack, or keyword..."
            className="w-full bg-[#0E121D] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6]"
          />
        </div>

        {/* Runtime Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {runtimes.map((rt) => (
            <button
              key={rt}
              type="button"
              onClick={() => setSelectedRuntime(rt)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedRuntime === rt
                  ? "bg-[#8B5CF6] text-white font-semibold shadow-[0_0_12px_-2px_rgba(139,92,246,0.5)]"
                  : "bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {rt}
            </button>
          ))}
        </div>

        {/* Forge Project CTA */}
        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Forge Project</span>
        </Button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            glow="crucible"
            className="flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Top Container Runtime & Health bar */}
            <div className="p-4 pb-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/30 px-2 py-0.5 rounded">
                  {project.containerRuntime}
                </span>
                <Badge
                  variant={
                    project.health === "optimal"
                      ? "emerald"
                      : project.health === "degraded"
                      ? "amber"
                      : "outline"
                  }
                  size="sm"
                  dot
                >
                  {project.health}
                </Badge>
              </div>

              <span className="text-[10px] font-mono text-slate-400">
                {project.cluster}
              </span>
            </div>

            {/* Title & Description */}
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-[#8B5CF6] shrink-0" />
                <h4 className="font-semibold text-white text-sm font-['Space_Grotesk',sans-serif] group-hover:text-[#8B5CF6] transition-colors truncate">
                  {project.name}
                </h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Pills */}
            <div className="px-4 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.07]"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Meta & Metrics Footer */}
            <div className="mt-4 p-4 border-t border-white/[0.06] bg-[#0E121D]/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-1.5" title="Git Branch & Commit">
                <GitBranch className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-slate-300 truncate max-w-[120px]">{project.gitBranch}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[#67E8F9]" title="Assigned Agents">
                  <Bot className="h-3 w-3" />
                  {project.agentsAssigned}
                </span>
                <span className="flex items-center gap-1 text-slate-500" title="Last Deployed">
                  <Clock className="h-3 w-3" />
                  {project.lastDeployed}
                </span>
              </div>
            </div>
          </Card>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-12 text-center bg-[#111522] rounded-xl border border-white/[0.08]">
            <FolderGit2 className="h-10 w-10 text-slate-600 mx-auto mb-2" />
            <div className="text-sm text-slate-300 font-medium">No projects match the current filter</div>
            <p className="text-xs text-slate-500 mt-1">Try refining your search keyword or runtime filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
