"use client";

import React from "react";
import {
  Terminal,
  Network,
  Database,
  FlaskConical,
  Boxes,
  PackagePlus,
  ShieldCheck,
  Building2,
  Sliders,
  Sparkles,
  ExternalLink,
  Code2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { NavItemId } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BrandBadge } from "@/components/brand/BrandBadge";
import { NAVIGATION_ITEMS } from "@/lib/mock-data";

interface ModulePreviewViewProps {
  moduleId: NavItemId;
}

export function ModulePreviewView({ moduleId }: ModulePreviewViewProps) {
  const itemConfig = NAVIGATION_ITEMS.find((item) => item.id === moduleId);

  const previewDetails: Record<
    string,
    {
      title: string;
      desc: string;
      brand: any;
      features: string[];
      cliPreview: string;
      runtimeSpecs: string[];
    }
  > = {
    codespace: {
      title: "CRUCION SPACE — In-Browser MicroVM IDE",
      desc: "Instant cloud-isolated developer environments running on dedicated Firecracker microVMs with native terminal, LSP, and GPU passthrough.",
      brand: "CRUCION SPACE",
      features: [
        "Ephemeral container boot in <400ms with zero state leakage",
        "Full language server protocol (LSP) for Rust, Go, Python, TypeScript",
        "Direct socket connection to Crucion AgentOS swarm for in-editor pair programming",
        "Pre-configured toolchains with zero local dependencies needed",
      ],
      cliPreview: "$ crucion space attach --container microvm-4829\nConnected to CRUCION MicroVM Kernel v2.4.0 (us-east-metal)\nIsolated namespace mounted at /workspace/crucion\nLSP server initialized for Rust 1.85 / LLVM",
      runtimeSpecs: ["MicroVM RAM: 16 GB", "vCPU: 4 Dedicated", "NVMe IOPS: 120,000", "eBPF Sandboxed"],
    },
    "api-studio": {
      title: "CRUCION API Studio — Contract & Endpoint Mesh",
      desc: "Declarative API contract design, automated OpenAPI/gRPC schema generation, mock container servers, and real-time latency inspection.",
      brand: "CRUCION FLOW",
      features: [
        "Schema-first TypeScript/Rust API client code generation",
        "Instant mock edge endpoints running inside isolated containers",
        "Latency profiling with sub-millisecond p99 telemetry",
        "Zero-trust API token authentication and rate limiting presets",
      ],
      cliPreview: "$ crucion api test --spec ./openapi.yaml --cluster us-east-metal\nGenerated 14 contract test invariants\nExecuted 14 requests: 100% passed (p99 latency 1.1ms)",
      runtimeSpecs: ["Envoy Proxy 1.30", "HTTP/3 & gRPC", "mTLS Enabled", "OpenAPI v3.1"],
    },
    "database-studio": {
      title: "CRUCION DATA — Vector & Relational Fabric",
      desc: "Zero-latency database sandboxes with automated migrations, vector embeddings indexing, and direct Prisma ORM integration.",
      brand: "CRUCION DATA",
      features: [
        "Integrated PostgreSQL with pgvector extension enabled",
        "Instant ephemeral test database branch creation in <500ms",
        "Automated schema diffing and Prisma migration generation",
        "AES-256 encrypted credential storage and connection pooling",
      ],
      cliPreview: "$ crucion db migrate --schema ./prisma/schema.prisma\nConnecting to isolated PostgreSQL instance (us-east-metal)\nApplied migration: 0_init (12 tables, 18 indexes)",
      runtimeSpecs: ["PostgreSQL 17", "pgvector 0.7", "Connection Pooling", "Continuous WAL"],
    },
    "testing-lab": {
      title: "CRUCION Testing Lab — Invariant & Fuzz Harness",
      desc: "Isolated containerized testing pipelines executing unit tests, integration suites, and Foundry smart contract invariant harnesses.",
      brand: "CRUCION CORE",
      features: [
        "Parallel test runner across isolated microVM cores",
        "Deterministic mocking of external HTTP/gRPC APIs",
        "Coverage heatmaps with branch verification",
        "Automated regression bisect on Git commit histories",
      ],
      cliPreview: "$ crucion test run --parallel --coverage\nRunning 4 test suites across 4 dedicated microVMs...\nAll tests passed in 1.42s (98.4% branch coverage)",
      runtimeSpecs: ["Cargo test", "Vitest / Jest", "Pytest", "Foundry / Forge"],
    },
    "blockchain-studio": {
      title: "CRUCION CHAIN — EVM & ZK-Rollup Studio",
      desc: "Multi-chain smart contract development environment with Foundry compilation, fuzzing, and zero-knowledge circuit verification.",
      brand: "CRUCION CHAIN",
      features: [
        "Solidity 0.8.28 compiler with integrated optimizer passes",
        "Anvil local testnet with state fork capabilities",
        "Circom / Halo2 ZK proof verification harness",
        "Multi-chain deployment scripts with ledger hardware signers",
      ],
      cliPreview: "$ crucion chain compile --contract QuantumGateway.sol\nCompiled with Solc 0.8.28 in 210ms\nRunning 8 invariant tests... 8 passed",
      runtimeSpecs: ["Foundry Anvil", "Solc 0.8.28", "ZK-SNARK Verifier", "EVM P2P"],
    },
    "security-center": {
      title: "CRUCION SHIELD — Zero-Trust Security Center",
      desc: "Continuous security audit scanning, SBOM CycloneDX generation, eBPF container syscall policy enforcement, and dependency alerts.",
      brand: "CRUCION SHIELD",
      features: [
        "Automated software bill of materials (SBOM) generation",
        "eBPF-enforced container kernel sandbox policies",
        "Cosign cryptographic image signing on every build",
        "Continuous vulnerability scanning against OSV & CVE databases",
      ],
      cliPreview: "$ crucion shield scan --container workspace-root\nScanning 340 dependency packages...\nZero critical vulnerabilities detected (Score: 100/100)",
      runtimeSpecs: ["eBPF Tetragon", "Cosign v2", "CycloneDX 1.6", "mTLS Mesh"],
    },
    workflows: {
      title: "CRUCION FLOW — Visual Event-Driven Automation",
      desc: "Declarative orchestration chaining GitHub webhooks, AgentOS code refactoring, container test suites, and canary deployments.",
      brand: "CRUCION FLOW",
      features: [
        "Visual workflow builder with real-time execution graphs",
        "Trigger pipelines on Git push, webhook, or cron schedule",
        "Conditional branching with automated rollback actions",
        "Encrypted environment secret injection per step",
      ],
      cliPreview: "$ crucion flow trigger --pipeline build-and-deploy\nPipeline execution started: run_849204\nStep 1: Container build (complete)\nStep 2: Security scan (complete)\nStep 3: Canary deploy (10% traffic)",
      runtimeSpecs: ["Event Mesh", "Cron Engine", "Webhook Gateway", "State Machine"],
    },
  };

  const details = previewDetails[moduleId] || {
    title: itemConfig?.label || "CRUCION Module",
    desc: `Integrated engineering capability powered by ${itemConfig?.brandModule || "CRUCION Ecosystem"}.`,
    brand: itemConfig?.brandModule || "CRUCION CORE",
    features: [
      "Dedicated microVM container runtime",
      "Sub-second state initialization and synchronization",
      "Unified telemetry and audit trail logging",
      "Enterprise RBAC and secret encryption",
    ],
    cliPreview: `$ crucion ${moduleId} status\nModule: ${itemConfig?.brandModule}\nState: Optimal\nIsolation: MicroVM Verified`,
    runtimeSpecs: ["Dedicated Pod", "eBPF Sandboxed", "Anycast Routed", "Zero-Trust Mesh"],
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <BrandBadge module={details.brand} size="md" />
          <Badge variant="emerald" size="sm" dot>
            Architecture Ready
          </Badge>
          <Badge variant="blue" size="sm">
            Integrated Runtime
          </Badge>
        </div>

        <div className="space-y-1.5 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif] tracking-tight">
            {details.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            {details.desc}
          </p>
        </div>
      </div>

      {/* Grid: Capabilities + CLI Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Capabilities list */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-slate-900">
                Core Architectural Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {details.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                >
                  <span className="text-[#0066cc] font-bold">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* CLI Terminal Preview */}
        <div className="lg:col-span-6 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-slate-900 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-[#0066cc]" />
                  <span>Interactive Terminal Session</span>
                </CardTitle>
                <span className="text-[10px] font-mono text-slate-400">bash / zsh</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner leading-relaxed">
                <pre className="text-sky-300">
                  <code>{details.cliPreview}</code>
                </pre>
              </div>

              {/* Hardware / Container Specs */}
              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-500">
                {details.runtimeSpecs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
