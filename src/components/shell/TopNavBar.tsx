"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Server,
  Bell,
  Cpu,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CrucionLogo } from "@/components/brand/CrucionLogo";

export function TopNavBar() {
  const {
    setIsMobileSidebarOpen,
    setIsCommandPaletteOpen,
    setIsNewProjectModalOpen,
    activeCluster,
    setActiveCluster,
    telemetry,
    activities,
  } = useCrucionStore();

  const [isClusterDropdownOpen, setIsClusterDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  const clusterOptions = [
    { id: "us-east-metal (Primary)", label: "us-east-metal (Primary)", region: "Virginia", ping: "1.2ms" },
    { id: "eu-central-edge", label: "eu-central-edge", region: "Frankfurt", ping: "2.1ms" },
    { id: "ap-south-gpu", label: "ap-south-gpu", region: "Mumbai", ping: "4.6ms" },
  ];

  return (
    <header className="h-16 bg-[#111522]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left side: Mobile menu toggle + Logo + Cluster selector */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="md:hidden">
          <CrucionLogo size="sm" showMotto={false} asLink={true} />
        </div>

        {/* Cluster Selector Dropdown */}
        <div className="relative hidden sm:block">
          <button
            type="button"
            onClick={() => setIsClusterDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#171C2A] border border-white/10 hover:border-[#8B5CF6]/50 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34D399]" />
            </div>
            <Server className="h-3.5 w-3.5 text-[#22D3EE]" />
            <span className="font-mono text-[11px] font-medium">{activeCluster}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isClusterDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#171C2A] border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-slate-400 font-semibold border-b border-white/[0.06]">
                Select Active MicroVM Cluster
              </div>
              <div className="mt-1 space-y-1">
                {clusterOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setActiveCluster(opt.id);
                      setIsClusterDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left hover:bg-white/[0.08] transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white">{opt.label}</div>
                      <div className="text-[10px] text-slate-400">{opt.region}</div>
                    </div>
                    <span className="text-[10px] font-mono text-[#34D399]">{opt.ping}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Command Search Bar (interactive palette launcher) */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#0E121D] border border-white/10 hover:border-[#8B5CF6]/50 text-xs text-slate-400 hover:text-slate-300 transition-all cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-[#8B5CF6]" />
            <span>Search containers, agents, pipelines, symbols...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-white/15 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Telemetry Pill + Quick Action + Notifications + Org/Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
          aria-label="Search"
        >
          <Search className="h-4 w-4 text-[#8B5CF6]" />
        </button>

        {/* Live Telemetry Pill */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#0E121D] border border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Cpu className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>CPU: {telemetry.cpuLoadPercent}%</span>
          </div>
          <div className="h-3 w-[1px] bg-white/10" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="h-3.5 w-3.5 text-[#22D3EE]" />
            <span>RAM: {telemetry.memoryUsedGb}/{telemetry.memoryTotalGb}GB</span>
          </div>
        </div>

        {/* Quick Project Forge Button */}
        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="hidden sm:inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>New Project</span>
        </Button>

        {/* Notifications & Activity Stream Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifDropdownOpen((prev) => !prev)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            aria-label="Recent Activity Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#8B5CF6] ring-2 ring-[#111522]" />
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#171C2A] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
                <span className="font-semibold text-xs text-white">Live Event Stream</span>
                <Badge variant="crucible" size="sm">
                  {activities.length} Events
                </Badge>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="p-3 hover:bg-white/[0.04] transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-200">{act.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span>By: {act.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User / Organization Profile */}
        <div className="flex items-center gap-2 pl-1 border-l border-white/[0.08]">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#22D3EE] p-[1px] cursor-pointer">
            <div className="h-full w-full rounded-lg bg-[#111522] flex items-center justify-center font-bold text-xs text-white font-mono">
              CR
            </div>
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 leading-tight">
              Enterprise Hub
            </span>
            <span className="text-[10px] text-[#22D3EE] font-mono leading-tight">
              Crucion Architect
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
