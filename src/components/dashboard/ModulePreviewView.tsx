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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
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
      brand: "CRUCION CORE",
      features: [
        "Auto-generate TypeScript & Rust SDK clients from protobuf contracts",
        "Instant mock container generation with realistic synthetic payloads",
        "mTLS cryptographic endpoint verification and rate-limiting testing",
        "Integrated latency benchmarking with automated p99 degradation alerts",
      ],
      cliPreview: "$ crucion api mock --schema ./proto/kernel_service.proto --port 8080\nMock container running at http://localhost:8080\nAuto-generated 14 RPC handlers with schema validation",
      runtimeSpecs: ["Protocol: HTTP/3 & gRPC", "mTLS: v1.3 Required", "OpenAPI: 3.1.0 Strict", "Telemetry: OTLP 1.2"],
    },
    "database-studio": {
      title: "CRUCION DATA — Vector & Relational Fabric",
      desc: "Unified data plane bridging distributed Postgres instances, Kafka event queues, and HNSW vector embedding stores in isolated containers.",
      brand: "CRUCION DATA",
      features: [
        "Schema migrations with zero-downtime shadow table verification",
        "Vector index benchmarking with Milvus and pgvector accelerators",
        "Automated cryptographic backup snapshots to S3-compatible immutable storage",
        "Query latency profiling and index optimization recommendations",
      ],
      cliPreview: "$ crucion data migrate --cluster us-east-metal --dry-run\nValidating 12 migration scripts against shadow schema...\nNo backward incompatible column drops detected. Status: CLEAR",
      runtimeSpecs: ["Engine: Distributed PG 17 + Vector", "IOPS: 80,000", "Replication: Multi-Region Raft", "Encryption: AES-256-GCM"],
    },
    "testing-lab": {
      title: "CRUCION TRUST — Autonomous Test Matrix",
      desc: "Distributed fuzzing, invariant checking, end-to-end integration validation, and AI-driven regression scenario generation.",
      brand: "CRUCION TRUST",
      features: [
        "Parallelized test execution across 64 containerized worker pods",
        "Automated flaky test detection with Bayesian regression scoring",
        "Mutation testing to verify code coverage test quality",
        "Formal invariant proofs for critical state transitions",
      ],
      cliPreview: "$ crucion test matrix --workers 32 --fuzz-invariants 10000\nRunning 10,000 fuzz test permutations...\nAll assertions valid. 0 invariant failures detected.",
      runtimeSpecs: ["Workers: 32 Pods", "Fuzz Engine: LibFuzzer & Foundry", "Coverage: 98.4%", "Deterministic Seeds: Enabled"],
    },
    "blockchain-studio": {
      title: "CRUCION CHAIN — Multi-Chain EVM & ZK Studio",
      desc: "Smart contract compilation, formal verification, Foundry fuzzing, and local zero-knowledge rollup container node bridging.",
      brand: "CRUCION CHAIN",
      features: [
        "Sub-second compilation and static analysis with Slither and Mythril",
        "Integrated anvil local testnet container with state forking",
        "Cross-chain messaging relayer verification and gas profiling",
        "Zero-knowledge circuit compilation (Circom, Noir) with prover verification",
      ],
      cliPreview: "$ crucion chain verify --contract BridgeGateway.sol --foundry\nRunning Foundry invariant suite...\nGas optimization suggestions: 14% savings identified in _dispatchToken()",
      runtimeSpecs: ["Compiler: Solc 0.8.28", "Fuzz Runs: 25,000", "ZK Prover: Halo2 / Plonky3", "Chain IDs: 1, 10, 8453, 42161"],
    },
    "extension-hub": {
      title: "CRUCION HUB — Universal Extension & Tool Registry",
      desc: "Curated ecosystem of microVM containers, AgentOS tool plugins, security analyzers, and custom CI/CD pipelines.",
      brand: "CRUCION HUB",
      features: [
        "One-click tool grounding installation into AgentOS swarms",
        "OCI-compliant container packaging for instant runtime distribution",
        "Cryptographically signed extensions with Cosign and Sigstore attestations",
        "Community & enterprise private registry support",
      ],
      cliPreview: "$ crucion hub install @crucion/ext-deep-fuzzer\nDownloaded 14MB OCI image layer\nAttestation signature verified by Crucion Shield",
      runtimeSpecs: ["Format: OCI Spec 1.1", "Signature: Cosign Ed25519", "Registry: hub.crucion.internal", "Sandboxing: Strict gVisor"],
    },
  };

  const details = previewDetails[moduleId] || {
    title: `${itemConfig?.label || moduleId} — Architecture View`,
    desc: `The ${itemConfig?.label} capability is part of the ${itemConfig?.brandModule} pillar, engineered for enterprise reliability and container isolation.`,
    brand: itemConfig?.brandModule || "CRUCION CORE",
    features: [
      "Integrated microVM container isolation",
      "Real-time event streaming and telemetry",
      "Unified role-based access control and zero-trust policies",
    ],
    cliPreview: `$ crucion ${moduleId} status\nModule: ${itemConfig?.label}\nStatus: Architectural Prototype Phase 1`,
    runtimeSpecs: ["Status: Phase 1 Preview", "Engine: MicroVM v2.4", "Security: Zero-Trust", "API: REST & gRPC"],
  };

  return (
    <div className="space-y-5">
      {/* Module Title Card */}
      <Card className="p-6 bg-[#111522] border-white/[0.08] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <Layers className="h-40 w-40 text-[#8B5CF6]" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <BrandBadge module={details.brand} size="md" />
            <Badge variant="preview" size="md">
              Architecture Preview
            </Badge>
          </div>

          <h2 className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
            {details.title}
          </h2>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {details.desc}
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Core Capabilities */}
        <Card className="p-5 bg-[#111522] border-white/[0.08]">
          <h3 className="text-sm font-semibold text-white font-['Space_Grotesk',sans-serif] mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
            Core Architectural Capabilities
          </h3>

          <ul className="space-y-2.5">
            {details.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] mt-1.5 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <div className="text-[11px] font-mono uppercase text-slate-500 mb-2 font-semibold">
              Container Specifications
            </div>
            <div className="grid grid-cols-2 gap-2">
              {details.runtimeSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-[#0E121D] border border-white/5 text-[10px] font-mono text-slate-300"
                >
                  {spec}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* CLI & Orchestration Simulator */}
        <Card className="p-5 bg-[#111522] border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white font-['Space_Grotesk',sans-serif] flex items-center gap-2">
                <Code2 className="h-4 w-4 text-[#22D3EE]" />
                CRUCION CLI Interaction Simulation
              </h3>
              <span className="text-[10px] font-mono text-slate-500">v2.4.0-preview</span>
            </div>

            <div className="rounded-lg bg-[#080A10] border border-white/10 p-3.5 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
              <pre className="text-[#34D399] leading-relaxed whitespace-pre-wrap">{details.cliPreview}</pre>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Module available for early container orchestration trials.
            </span>
            <Button size="sm" variant="outline">
              <span>View OCI Spec</span>
              <ExternalLink className="h-3 w-3 ml-1.5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
