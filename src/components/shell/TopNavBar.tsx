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
  Plus,
  Layers,
  Settings,
  LogOut,
  Sliders,
  Building2,
  Plug,
} from "lucide-react";
import { useCrucionStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { signout } from "@/app/actions/auth";

export function TopNavBar() {
  const {
    setIsMobileSidebarOpen,
    setIsCommandPaletteOpen,
    setIsNewProjectModalOpen,
    activeCluster,
    setActiveCluster,
    telemetry,
    activities,
    setActiveNav,
  } = useCrucionStore();

  const [isClusterDropdownOpen, setIsClusterDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const clusterOptions = [
    { id: "us-east-metal (Primary)", label: "us-east-metal (Primary)", region: "Virginia", ping: "1.2ms" },
    { id: "eu-central-edge", label: "eu-central-edge", region: "Frankfurt", ping: "2.1ms" },
    { id: "ap-south-gpu", label: "ap-south-gpu", region: "Mumbai", ping: "4.6ms" },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
      {/* Left side: Mobile menu toggle + Logo + Cluster selector */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs text-slate-700 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
          >
            <div className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </div>
            <Server className="h-3.5 w-3.5 text-[#0066cc]" />
            <span className="font-mono text-[11px] font-medium">{activeCluster}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isClusterDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-slate-500 font-semibold border-b border-slate-100">
                Active MicroVM Cluster
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
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{opt.label}</div>
                      <div className="text-[10px] text-slate-500">{opt.region}</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 font-medium">{opt.ping}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Command Search Bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <Search className="h-4 w-4 text-[#0066cc]" />
            <span>Search containers, agents, pipelines, symbols...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Telemetry + New Project + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Search"
        >
          <Search className="h-4 w-4 text-[#0066cc]" />
        </button>

        {/* Live Telemetry Pill */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-mono shadow-2xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Cpu className="h-3.5 w-3.5 text-[#0066cc]" />
            <span>CPU: {telemetry.cpuLoadPercent}%</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-1.5 text-slate-600">
            <Layers className="h-3.5 w-3.5 text-sky-600" />
            <span>RAM: {telemetry.memoryUsedGb}/{telemetry.memoryTotalGb}GB</span>
          </div>
        </div>

        {/* Quick New Project Button */}
        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="hidden sm:inline-flex"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Project</span>
        </Button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifDropdownOpen((prev) => !prev)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#0066cc] ring-2 ring-white" />
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-900">Activity Stream</span>
                <Badge variant="blue" size="sm">
                  {activities.length} Events
                </Badge>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-900">{act.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Settings Menu */}
        <div className="relative pl-1 border-l border-slate-200">
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="h-8 w-8 rounded-lg bg-[#0066cc] text-white flex items-center justify-center font-bold text-xs font-mono shadow-xs">
              CR
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                Enterprise Hub
              </span>
              <span className="text-[10px] text-[#0066cc] font-mono leading-tight">
                Verified Account
              </span>
            </div>
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-medium text-xs text-slate-900">CRUCION Account</div>
                <div className="text-[10px] text-slate-500 font-mono">Authenticated Session</div>
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav("settings");
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-500" />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveNav("organization");
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                >
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  <span>Organization & Team</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveNav("extension-hub");
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg text-left"
                >
                  <Plug className="h-3.5 w-3.5 text-slate-500" />
                  <span>Connected Services</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={async () => {
                    await signout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg text-left font-medium"
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
