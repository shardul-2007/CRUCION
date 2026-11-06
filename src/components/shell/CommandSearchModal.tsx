"use client";

import React, { useState } from "react";
import {
  Search,
  LayoutDashboard,
  FolderGit2,
  Hammer,
  Bot,
  Rocket,
  ShieldCheck,
  Activity,
  Terminal,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useCrucionStore } from "@/lib/store";
import { NAVIGATION_ITEMS } from "@/lib/mock-data";
import { NavItemId } from "@/types";

export function CommandSearchModal() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveNav,
    projects,
    setIsNewProjectModalOpen,
  } = useCrucionStore();

  const [query, setQuery] = useState("");

  const filteredNav = NAVIGATION_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.brandModule.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.stack.some((s) => s.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelectNav = (id: NavItemId) => {
    setActiveNav(id);
    setIsCommandPaletteOpen(false);
    setQuery("");
  };

  return (
    <Modal
      isOpen={isCommandPaletteOpen}
      onClose={() => setIsCommandPaletteOpen(false)}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Search input field */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 h-4 w-4 text-[#0066cc]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, module name, or project to search..."
            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0066cc]"
            autoFocus
          />
        </div>

        {/* Quick action: Create new project */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-sky-50/50 border border-sky-100 text-xs">
          <span className="text-slate-600 font-medium">Quick Provision:</span>
          <button
            type="button"
            onClick={() => {
              setIsCommandPaletteOpen(false);
              setIsNewProjectModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0066cc] text-white font-medium hover:bg-[#0052a3] transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>Forge Project</span>
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-80 overflow-y-auto space-y-4 pr-1 divide-y divide-slate-100">
          {/* Projects matched */}
          {filteredProjects.length > 0 && (
            <div className="space-y-1 pt-2 first:pt-0">
              <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2">
                Workspaces & Projects
              </div>
              {filteredProjects.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectNav("projects")}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderGit2 className="h-4 w-4 text-[#0066cc] shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">{p.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({p.containerRuntime})</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {/* Navigation Items matched */}
          <div className="space-y-1 pt-2">
            <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold px-2">
              Command Modules
            </div>
            {filteredNav.slice(0, 6).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectNav(item.id)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left transition-colors text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">({item.brandModule})</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{item.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
