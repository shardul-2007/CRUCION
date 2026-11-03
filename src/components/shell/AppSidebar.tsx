"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderGit2,
  Hammer,
  Terminal,
  Bot,
  Cpu,
  GitMerge,
  Network,
  Database,
  FlaskConical,
  Boxes,
  Rocket,
  Activity,
  ShieldCheck,
  PackagePlus,
  Building2,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Plus,
  Radio,
  X,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { NAVIGATION_ITEMS } from "@/lib/mock-data";
import { NavItemId } from "@/types";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { cn } from "@/lib/utils";

// Icon lookup map
const ICON_COMPONENTS: Record<string, React.ElementType> = {
  LayoutDashboard,
  FolderGit2,
  Hammer,
  Terminal,
  Bot,
  Cpu,
  GitMerge,
  Network,
  Database,
  FlaskConical,
  Boxes,
  Rocket,
  Activity,
  ShieldCheck,
  PackagePlus,
  Building2,
  Sliders,
};

export function AppSidebar() {
  const {
    activeNav,
    setActiveNav,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    setIsNewProjectModalOpen,
    telemetry,
  } = useCrucionStore();

  const categories = ["Engineering", "Intelligence", "Operations", "Platform"] as const;

  const handleNavClick = (id: NavItemId) => {
    setActiveNav(id);
    setIsMobileSidebarOpen(false);
  };

  const renderNavContent = () => (
    <div className="flex flex-col h-full bg-[#111522] border-r border-white/[0.08] select-none">
      {/* Top Header / Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.06] shrink-0">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <CrucionLogo size="sm" showMotto={false} asLink={true} />
          </div>
        ) : (
          <div className="mx-auto">
            <CrucionLogo size="sm" showMotto={false} asLink={true} className="gap-0" />
          </div>
        )}

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="hidden md:flex items-center justify-center h-7 w-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Action: New Project Forge */}
      <div className="p-3 border-b border-white/[0.06] shrink-0">
        <button
          type="button"
          onClick={() => setIsNewProjectModalOpen(true)}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#9061fa] hover:to-[#843df7] text-white font-medium text-xs py-2 px-3 shadow-[0_0_15px_-3px_rgba(139,92,246,0.4)] transition-all cursor-pointer active:scale-98",
            isSidebarCollapsed && "px-0"
          )}
          title="Scaffold New Project (Project Forge)"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed && <span>Forge New Project</span>}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-6">
        {categories.map((cat) => {
          const items = NAVIGATION_ITEMS.filter((item) => item.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  {cat}
                </div>
              )}
              {items.map((item) => {
                const Icon = ICON_COMPONENTS[item.iconName] || LayoutDashboard;
                const isActive = activeNav === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    title={`${item.label} (${item.brandModule})`}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative cursor-pointer",
                      isActive
                        ? "bg-[#8B5CF6]/15 text-white border border-[#8B5CF6]/40 shadow-[0_0_15px_-4px_rgba(139,92,246,0.3)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] border border-transparent",
                      isSidebarCollapsed && "justify-center px-0"
                    )}
                  >
                    {/* Active accent pill */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]" />
                    )}

                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-[#8B5CF6]"
                          : "text-slate-400 group-hover:text-slate-200"
                      )}
                    />

                    {!isSidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between text-left truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded font-mono font-medium tracking-tight border shrink-0 ml-1.5",
                              item.isPreview
                                ? "bg-[#22D3EE]/10 text-[#67E8F9] border-[#22D3EE]/30"
                                : isActive
                                ? "bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/40"
                                : "bg-white/[0.06] text-slate-400 border-white/[0.08]"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer System Telemetry Summary */}
      <div className="p-3 border-t border-white/[0.06] bg-[#0E121D] shrink-0">
        {!isSidebarCollapsed ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                <Radio className="h-3 w-3 text-[#34D399] animate-pulse" />
                CRUCION CORE
              </span>
              <span className="text-[#34D399] font-mono text-[10px] font-bold">
                {telemetry.clusterState}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{telemetry.activeContainers} Containers</span>
              <span>p99: {telemetry.p99LatencyMs}ms</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Container Kernel Status: Optimal">
            <div className="relative flex h-3 w-3">
              <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#34D399]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col transition-all duration-300 z-30 shrink-0",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {renderNavContent()}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
}
