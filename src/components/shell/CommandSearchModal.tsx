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
          <Search className="absolute left-3.5 h-4 w-4 text-[#8B5CF6]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, modules, containers, or projects..."
            className="w-full rounded-xl border border-white/10 bg-[#0E121D] py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Quick Actions
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCommandPaletteOpen(false);
              setIsNewProjectModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs text-left text-slate-200 hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Plus className="h-4 w-4 text-[#8B5CF6]" />
              <span className="font-medium">Forge New Project with Container Profile</span>
            </div>
            <span className="text-[10px] font-mono text-[#8B5CF6]">CRUCION FORGE</span>
          </button>
        </div>

        {/* Modules Navigation */}
        <div className="space-y-1">
          <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Platform Modules ({filteredNav.length})
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectNav(item.id)}
                className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-left text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-slate-400">›</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{item.brandModule}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Matching Projects */}
        {filteredProjects.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-white/[0.06]">
            <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Active Projects ({filteredProjects.length})
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActiveNav("projects");
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-left hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-white text-[12px]">{p.name}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{p.description}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#22D3EE]">{p.containerRuntime}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
