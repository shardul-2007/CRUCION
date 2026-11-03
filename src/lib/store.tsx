"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  NavItemId,
  ProjectItem,
  AgentRun,
  DeploymentItem,
  ActivityEvent,
  SystemTelemetry,
} from "@/types";
import {
  INITIAL_PROJECTS,
  INITIAL_AGENTS,
  INITIAL_DEPLOYMENTS,
  INITIAL_ACTIVITIES,
  INITIAL_TELEMETRY,
} from "./mock-data";

interface CrucionStoreContextType {
  // Navigation & View
  activeNav: NavItemId;
  setActiveNav: (nav: NavItemId) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  
  // Search & Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Selected Cluster
  activeCluster: string;
  setActiveCluster: (cluster: string) => void;

  // Telemetry
  telemetry: SystemTelemetry;

  // Projects
  projects: ProjectItem[];
  addProject: (newProject: Omit<ProjectItem, "id" | "lastDeployed" | "health" | "agentsAssigned" | "gitBranch">) => void;
  filterQuery: string;
  setFilterQuery: (query: string) => void;

  // Project Creation Modal
  isNewProjectModalOpen: boolean;
  setIsNewProjectModalOpen: (open: boolean) => void;

  // Agents
  agents: AgentRun[];
  dispatchAgentTask: (taskTitle: string, role: string, model: string) => void;
  toggleAgentState: (agentId: string) => void;

  // Deployments
  deployments: DeploymentItem[];
  promoteDeployment: (deploymentId: string) => void;

  // Activity Stream
  activities: ActivityEvent[];
  addActivity: (activity: Omit<ActivityEvent, "id" | "timestamp">) => void;
}

const CrucionStoreContext = createContext<CrucionStoreContextType | null>(null);

export function CrucionStoreProvider({ children }: { children: React.ReactNode }) {
  const [activeNav, setActiveNav] = useState<NavItemId>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeCluster, setActiveCluster] = useState("us-east-metal (Primary)");

  const [telemetry, setTelemetry] = useState<SystemTelemetry>(INITIAL_TELEMETRY);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [filterQuery, setFilterQuery] = useState("");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const [agents, setAgents] = useState<AgentRun[]>(INITIAL_AGENTS);
  const [deployments, setDeployments] = useState<DeploymentItem[]>(INITIAL_DEPLOYMENTS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  // Keyboard shortcut for Cmd/Ctrl+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Add Project
  const addProject: CrucionStoreContextType["addProject"] = (newProj) => {
    const created: ProjectItem = {
      ...newProj,
      id: `cru-${Date.now().toString(36)}`,
      lastDeployed: "Just now",
      health: "optimal",
      agentsAssigned: 1,
      gitBranch: "main@init",
    };
    setProjects((prev) => [created, ...prev]);

    // Add activity log
    addActivity({
      title: `Project Created: ${created.name}`,
      description: `Initialized container workspace with ${created.containerRuntime} on ${created.cluster}.`,
      type: "build",
      severity: "success",
      actor: "Operator",
    });

    // Update telemetry
    setTelemetry((prev) => ({
      ...prev,
      activeContainers: prev.activeContainers + 1,
    }));
  };

  // Dispatch Agent Task
  const dispatchAgentTask = (taskTitle: string, role: string, model: string) => {
    const newAgent: AgentRun = {
      id: `agent-${Date.now().toString(36)}`,
      agentName: `CrucionBot-${Math.floor(100 + Math.random() * 900)}`,
      role,
      taskTitle,
      status: "running",
      model,
      tokenUsage: 1200,
      toolsExecuted: 1,
      durationSeconds: 15,
      startedAt: "Just now",
      currentAction: "Initializing container environment and indexing AST",
      logPreview: [
        `[${new Date().toLocaleTimeString()}] Container sandbox assigned`,
        `[${new Date().toLocaleTimeString()}] Parsing AST and loading repository context`,
      ],
    };
    setAgents((prev) => [newAgent, ...prev]);

    addActivity({
      title: `Agent Dispatched: ${newAgent.agentName}`,
      description: `Task: ${taskTitle} assigned to ${role}.`,
      type: "agent",
      severity: "info",
      actor: "AgentOS",
    });

    setTelemetry((prev) => ({
      ...prev,
      activeAgents: prev.activeAgents + 1,
    }));
  };

  // Toggle Agent State
  const toggleAgentState = (agentId: string) => {
    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id !== agentId) return ag;
        const newStatus = ag.status === "running" || ag.status === "executing_tool" ? "idle" : "running";
        return {
          ...ag,
          status: newStatus,
          currentAction: newStatus === "idle" ? "Suspended by operator" : "Resumed active loop",
        };
      })
    );
  };

  // Promote Deployment
  const promoteDeployment = (deploymentId: string) => {
    setDeployments((prev) =>
      prev.map((dep) => {
        if (dep.id !== deploymentId) return dep;
        return {
          ...dep,
          status: "live",
          deployedAt: "Just now",
        };
      })
    );

    addActivity({
      title: `Deployment Promoted to 100% Traffic`,
      description: `Zero-downtime traffic shift confirmed across all cluster edge nodes.`,
      type: "deploy",
      severity: "success",
      actor: "CRUCION DEPLOY",
    });
  };

  // Add Activity
  const addActivity = (act: Omit<ActivityEvent, "id" | "timestamp">) => {
    const newAct: ActivityEvent = {
      ...act,
      id: `act-${Date.now().toString(36)}`,
      timestamp: "Just now",
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  return (
    <CrucionStoreContext.Provider
      value={{
        activeNav,
        setActiveNav,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        activeCluster,
        setActiveCluster,
        telemetry,
        projects,
        addProject,
        filterQuery,
        setFilterQuery,
        isNewProjectModalOpen,
        setIsNewProjectModalOpen,
        agents,
        dispatchAgentTask,
        toggleAgentState,
        deployments,
        promoteDeployment,
        activities,
        addActivity,
      }}
    >
      {children}
    </CrucionStoreContext.Provider>
  );
}

export function useCrucionStore() {
  const context = useContext(CrucionStoreContext);
  if (!context) {
    throw new Error("useCrucionStore must be used within a CrucionStoreProvider");
  }
  return context;
}
