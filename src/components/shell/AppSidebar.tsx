"use client";

import React from "react";
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
  Plug,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { NAVIGATION_ITEMS } from "@/lib/mock-data";
import { NavItemId } from "@/types";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { cn } from "@/lib/utils";

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
  Plug,
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
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Top Header / Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
        {!isSidebarCollapsed ? (
          <CrucionLogo size="sm" showMotto={false} asLink={true} />
        ) : (
          <div className="mx-auto">
            <CrucionLogo size="sm" showMotto={false} asLink={true} className="gap-0" />
          </div>
        )}

        {/* Desktop collapse toggle */}
        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className="hidden md:flex items-center justify-center h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="md:hidden flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Action: New Project Forge */}
      <div className="p-3 border-b border-slate-100 shrink-0">
        <button
          type="button"
          onClick={() => setIsNewProjectModalOpen(true)}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg bg-[#0066cc] hover:bg-[#0052a3] text-white font-medium text-xs py-2 px-3 shadow-sm transition-all cursor-pointer active:scale-98",
            isSidebarCollapsed && "px-0"
          )}
          title="Scaffold New Project"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!isSidebarCollapsed && <span>New Project</span>}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        {categories.map((cat) => {
          const items = NAVIGATION_ITEMS.filter((item) => item.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
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
                        ? "bg-sky-50 text-[#0066cc] border border-sky-200/90 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent",
                      isSidebarCollapsed && "justify-center px-0"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-[#0066cc]"
                          : "text-slate-400 group-hover:text-slate-700"
                      )}
                    />

                    {!isSidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between text-left truncate">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "text-[9px] px-1.5 py-0.5 rounded font-mono font-medium tracking-tight border shrink-0 ml-1.5",
                              isActive
                                ? "bg-sky-100 text-[#0066cc] border-sky-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
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
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 shrink-0">
        {!isSidebarCollapsed ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600 font-mono">
                <Radio className="h-3 w-3 text-emerald-600 animate-pulse" />
                CRUCION CORE
              </span>
              <span className="text-emerald-700 font-mono text-[10px] font-bold">
                {telemetry.clusterState}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{telemetry.activeContainers} Containers</span>
              <span>p99: {telemetry.p99LatencyMs}ms</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Optimal">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col transition-all duration-200 z-30 shrink-0",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-xl z-10 animate-in slide-in-from-left duration-150">
            {renderNavContent()}
          </div>
        </div>
      )}
    </>
  );
}
