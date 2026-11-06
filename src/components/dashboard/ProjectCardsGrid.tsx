"use client";

import React, { useState } from "react";
import {
  FolderGit2,
  GitBranch,
  Bot,
  ExternalLink,
  Plus,
  Search,
  Trash2,
  HardDrive,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { deleteProjectAction } from "@/app/actions/workspace";

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

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This will terminate its microVM container.`)) {
      return;
    }
    const res = await deleteProjectAction(projectId);
    if (res.success) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter projects by name or stack..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066cc]"
          />
        </div>

        {/* Runtime Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {runtimes.map((rt) => (
            <button
              key={rt}
              type="button"
              onClick={() => setSelectedRuntime(rt)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                selectedRuntime === rt
                  ? "bg-[#0066cc] text-white font-bold"
                  : "bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {rt.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* New Project Button */}
        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </Button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 space-y-3">
          <FolderGit2 className="h-8 w-8 mx-auto text-slate-300" />
          <h3 className="font-bold text-slate-700 text-sm">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No projects matched your criteria. You can create a new microVM project right now.
          </p>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="blue" size="sm">
                    {project.containerRuntime}
                  </Badge>
                  <Badge variant="emerald" size="sm" dot>
                    {project.health}
                  </Badge>
                </div>

                <CardTitle className="text-base text-slate-900 truncate">
                  {project.name}
                </CardTitle>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {project.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-50 text-slate-700 border border-slate-200/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* MicroVM Pod Details */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <HardDrive className="h-3 w-3 text-slate-400" />
                    <span>{project.cluster}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <GitBranch className="h-3 w-3 text-slate-400" />
                    <span>{project.gitBranch}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Bot className="h-3.5 w-3.5 text-[#0066cc]" />
                  <span>{project.agentsAssigned} agents active</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <Button size="sm" variant="secondary">
                    <span>Inspect</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
