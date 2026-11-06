"use client";

import React from "react";
import {
  Cpu,
  Hammer,
  Bot,
  Terminal,
  Rocket,
  Database,
  ShieldCheck,
  GitMerge,
  Activity,
  Boxes,
  PackagePlus,
  Building2,
  ArrowRight,
} from "lucide-react";
import { BrandBadge } from "@/components/brand/BrandBadge";
import { BrandModule } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export function EcosystemGrid() {
  const pillars: {
    module: BrandModule;
    title: string;
    description: string;
    icon: React.ElementType;
    accent: string;
    category: string;
  }[] = [
    {
      module: "CRUCION CORE",
      title: "MicroVM Kernel Orchestration",
      description: "Unified high-performance runtime orchestrating isolated Firecracker microVMs with sub-400ms cold starts.",
      icon: Cpu,
      accent: "text-[#0066cc]",
      category: "Kernel",
    },
    {
      module: "CRUCION FORGE",
      title: "Zero-Config Scaffolding",
      description: "Instant project templates with pre-configured container profiles, CI/CD, linting, and automated test suites.",
      icon: Hammer,
      accent: "text-amber-600",
      category: "DevOps",
    },
    {
      module: "CRUCION AGENT",
      title: "AgentOS Autonomous Swarms",
      description: "Multi-agent cognitive loops with tool grounding, AST indexing, real-time code refactoring, and test verification.",
      icon: Bot,
      accent: "text-sky-600",
      category: "Intelligence",
    },
    {
      module: "CRUCION SPACE",
      title: "In-Browser MicroVM IDE",
      description: "Zero-latency cloud workspaces with full language server protocol, eBPF terminal sockets, and shared pair programming.",
      icon: Terminal,
      accent: "text-blue-600",
      category: "Workspace",
    },
    {
      module: "CRUCION DEPLOY",
      title: "Edge Container Deployments",
      description: "Zero-downtime rolling updates, canary distributions, and automated rollback health checks across 48 global anycast POPs.",
      icon: Rocket,
      accent: "text-emerald-600",
      category: "Operations",
    },
    {
      module: "CRUCION DATA",
      title: "Vector & Relational Fabric",
      description: "Distributed Postgres instances, Kafka streaming pipelines, and HNSW vector embedding stores inside container sandboxes.",
      icon: Database,
      accent: "text-indigo-600",
      category: "Storage",
    },
    {
      module: "CRUCION SHIELD",
      title: "Zero-Trust Security Mesh",
      description: "Cosign cryptographic signatures, CycloneDX SBOM generation, automated dependency vulnerability audits, and mTLS.",
      icon: ShieldCheck,
      accent: "text-rose-600",
      category: "Security",
    },
    {
      module: "CRUCION FLOW",
      title: "Visual Workflow Pipelines",
      description: "Declarative event-driven automation chaining agent actions, test execution, container builds, and deployment promotions.",
      icon: GitMerge,
      accent: "text-purple-600",
      category: "Automation",
    },
    {
      module: "CRUCION PULSE",
      title: "Sub-Millisecond Telemetry",
      description: "Real-time p99 latency heatmaps, container resource telemetry, eBPF network metrics, and OpenTelemetry trace analysis.",
      icon: Activity,
      accent: "text-emerald-600",
      category: "Monitoring",
    },
    {
      module: "CRUCION CHAIN",
      title: "Multi-Chain EVM & ZK Studio",
      description: "Smart contract compilation, Foundry fuzz testing, zero-knowledge circuit verification, and cross-chain messaging bridges.",
      icon: Boxes,
      accent: "text-orange-600",
      category: "Web3",
    },
    {
      module: "CRUCION HUB",
      title: "Universal Extension Registry",
      description: "Curated marketplace of microVM container templates, AgentOS tool plugins, security analyzers, and community modules.",
      icon: PackagePlus,
      accent: "text-teal-600",
      category: "Registry",
    },
    {
      module: "CRUCION TRUST",
      title: "Enterprise Multi-Tenant RBAC",
      description: "Role-based access controls, cryptographic audit logs, enterprise SSO integration, and SOC 2 compliance readiness.",
      icon: Building2,
      accent: "text-sky-600",
      category: "Governance",
    },
  ];

  return (
    <section id="pillars" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="blue" size="md">
            BRAND FOUNDATION
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif] tracking-tight">
            The 12 CRUCION Pillars
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            Engineered as a unified modular ecosystem. Every pillar integrates seamlessly into the CRUCION container runtime.
          </p>
        </div>

        {/* 12 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Card
                key={idx}
                className="p-5 bg-white border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <BrandBadge module={p.module} size="sm" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {p.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-slate-100/70 transition-colors">
                      <Icon className={`h-4.5 w-4.5 ${p.accent}`} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk',sans-serif] group-hover:text-[#0066cc] transition-colors">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Architecture Ready</span>
                  <Link
                    href="/dashboard"
                    className="text-[#0066cc] group-hover:translate-x-1 transition-transform flex items-center"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
