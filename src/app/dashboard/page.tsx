"use client";

import React from "react";
import { AppSidebar } from "@/components/shell/AppSidebar";
import { TopNavBar } from "@/components/shell/TopNavBar";
import { CommandSearchModal } from "@/components/shell/CommandSearchModal";
import { NewProjectModal } from "@/components/dashboard/NewProjectModal";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ProjectCardsGrid } from "@/components/dashboard/ProjectCardsGrid";
import { AgentOSPanel } from "@/components/dashboard/AgentOSPanel";
import { DeploymentFleetPanel } from "@/components/dashboard/DeploymentFleetPanel";
import { LiveActivityStream } from "@/components/dashboard/LiveActivityStream";
import { TelemetryGauges } from "@/components/dashboard/TelemetryGauges";
import { ModulePreviewView } from "@/components/dashboard/ModulePreviewView";
import { useCrucionStore } from "@/lib/store";
import { NAVIGATION_ITEMS } from "@/lib/mock-data";

export default function DashboardPage() {
  const { activeNav } = useCrucionStore();

  const currentNavConfig = NAVIGATION_ITEMS.find((item) => item.id === activeNav);

  const renderActiveViewport = () => {
    switch (activeNav) {
      case "overview":
        return <DashboardOverview />;

      case "projects":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif]">
                Workspaces & Projects
              </h2>
              <p className="text-xs text-slate-400">
                Manage containerized environments, assigned agent swarms, and Git branches across clusters.
              </p>
            </div>
            <ProjectCardsGrid />
          </div>
        );

      case "project-forge":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif]">
                CRUCION FORGE — Project Scaffolding
              </h2>
              <p className="text-xs text-slate-400">
                Instant containerized scaffolding with pre-configured toolchains, tests, and CI/CD pipelines.
              </p>
            </div>
            <ProjectCardsGrid />
          </div>
        );

      case "agent-os":
      case "agent-runs":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif]">
                AgentOS — Autonomous Cognitive Workforces
              </h2>
              <p className="text-xs text-slate-400">
                Inspect active swarms, monitor token budgets, trigger automated toolchains, and view execution traces.
              </p>
            </div>
            <AgentOSPanel />
          </div>
        );

      case "deployments":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif]">
                Deployments & Container Fleet
              </h2>
              <p className="text-xs text-slate-400">
                Manage multi-cloud microVM rollouts, canary traffic distributions, and edge anycast routing.
              </p>
            </div>
            <DeploymentFleetPanel />
          </div>
        );

      case "monitoring":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif]">
                CRUCION PULSE — Live Telemetry & Observability
              </h2>
              <p className="text-xs text-slate-400">
                Sub-millisecond latency heatmaps, container resource telemetry, and distributed traces.
              </p>
            </div>
            <TelemetryGauges />
            <LiveActivityStream />
          </div>
        );

      default:
        // Dedicated high-fidelity module preview view for preview modules
        return <ModulePreviewView moduleId={activeNav} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0D14] text-slate-100 overflow-hidden">
      {/* Persistent Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Persistent Top Navigation Bar */}
        <TopNavBar />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-grid-cyber bg-radial-vignette">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveViewport()}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CommandSearchModal />
      <NewProjectModal />
    </div>
  );
}
