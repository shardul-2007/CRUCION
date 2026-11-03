export type NavItemId =
  | "overview"
  | "projects"
  | "project-forge"
  | "codespace"
  | "agent-os"
  | "agent-runs"
  | "workflows"
  | "api-studio"
  | "database-studio"
  | "testing-lab"
  | "blockchain-studio"
  | "deployments"
  | "monitoring"
  | "security-center"
  | "extension-hub"
  | "organization"
  | "settings";

export type BrandModule =
  | "CRUCION CORE"
  | "CRUCION FORGE"
  | "CRUCION AGENT"
  | "CRUCION SPACE"
  | "CRUCION DEPLOY"
  | "CRUCION DATA"
  | "CRUCION SHIELD"
  | "CRUCION FLOW"
  | "CRUCION PULSE"
  | "CRUCION CHAIN"
  | "CRUCION HUB"
  | "CRUCION TRUST";

export interface NavItemConfig {
  id: NavItemId;
  label: string;
  brandModule: BrandModule;
  iconName: string;
  badge?: string;
  isPreview?: boolean;
  category: "Engineering" | "Intelligence" | "Operations" | "Platform";
}

export type ProjectStatus = "active" | "building" | "deployed" | "idle" | "error";

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  containerRuntime: "Node 24 / V8" | "Rust / LLVM" | "Python 3.12 / PyPy" | "Go 1.23" | "Solidity / EVM";
  stack: string[];
  status: ProjectStatus;
  health: "optimal" | "degraded" | "standby";
  agentsAssigned: number;
  lastDeployed: string;
  cluster: "us-east-metal" | "eu-central-edge" | "ap-south-gpu";
  gitBranch: string;
}

export type AgentStatus = "running" | "idle" | "executing_tool" | "completed" | "error";

export interface AgentRun {
  id: string;
  agentName: string;
  role: string;
  taskTitle: string;
  status: AgentStatus;
  model: string;
  tokenUsage: number;
  toolsExecuted: number;
  durationSeconds: number;
  startedAt: string;
  currentAction?: string;
  logPreview?: string[];
}

export type DeploymentStatus = "live" | "rolling_update" | "canary" | "failed";

export interface DeploymentItem {
  id: string;
  projectName: string;
  environment: "production" | "staging" | "edge-container";
  commitSha: string;
  commitMsg: string;
  status: DeploymentStatus;
  latencyMs: number;
  cpuPercent: number;
  memoryMb: number;
  region: string;
  deployedAt: string;
  liveUrl: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: "agent" | "deploy" | "build" | "security" | "system";
  severity: "info" | "success" | "warning" | "fault";
  actor: string;
}

export interface SystemTelemetry {
  clusterState: "Optimal" | "Degraded" | "Synchronizing";
  cpuLoadPercent: number;
  memoryUsedGb: number;
  memoryTotalGb: number;
  activeContainers: number;
  activeAgents: number;
  networkThroughputMbps: number;
  p99LatencyMs: number;
}
