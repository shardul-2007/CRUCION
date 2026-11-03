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
      accent: "text-[#8B5CF6]",
      category: "Kernel",
    },
    {
      module: "CRUCION FORGE",
      title: "Zero-Config Scaffolding",
      description: "Instant project templates with pre-configured container profiles, CI/CD, linting, and automated test suites.",
      icon: Hammer,
      accent: "text-amber-400",
      category: "DevOps",
    },
    {
      module: "CRUCION AGENT",
      title: "AgentOS Autonomous Swarms",
      description: "Multi-agent cognitive loops with tool grounding, AST indexing, real-time code refactoring, and test verification.",
      icon: Bot,
      accent: "text-[#22D3EE]",
      category: "Intelligence",
    },
    {
      module: "CRUCION SPACE",
      title: "In-Browser MicroVM IDE",
      description: "Zero-latency cloud workspaces with full language server protocol, eBPF terminal sockets, and shared pair programming.",
      icon: Terminal,
      accent: "text-blue-400",
      category: "Workspace",
    },
    {
      module: "CRUCION DEPLOY",
      title: "Edge Container Deployments",
      description: "Zero-downtime rolling updates, canary distributions, and automated rollback health checks across 48 global anycast POPs.",
      icon: Rocket,
      accent: "text-[#34D399]",
      category: "Operations",
    },
    {
      module: "CRUCION DATA",
      title: "Vector & Relational Fabric",
      description: "Distributed Postgres instances, Kafka streaming pipelines, and HNSW vector embedding stores inside container sandboxes.",
      icon: Database,
      accent: "text-indigo-400",
      category: "Storage",
    },
    {
      module: "CRUCION SHIELD",
      title: "Zero-Trust Security Mesh",
      description: "Cosign cryptographic signatures, CycloneDX SBOM generation, automated dependency vulnerability audits, and mTLS.",
      icon: ShieldCheck,
      accent: "text-rose-400",
      category: "Security",
    },
    {
      module: "CRUCION FLOW",
      title: "Visual Workflow Pipelines",
      description: "Declarative event-driven automation chaining agent actions, test execution, container builds, and deployment promotions.",
      icon: GitMerge,
      accent: "text-purple-400",
      category: "Automation",
    },
    {
      module: "CRUCION PULSE",
      title: "Sub-Millisecond Telemetry",
      description: "Real-time p99 latency heatmaps, container resource telemetry, eBPF network metrics, and OpenTelemetry trace analysis.",
      icon: Activity,
      accent: "text-emerald-400",
      category: "Monitoring",
    },
    {
      module: "CRUCION CHAIN",
      title: "Multi-Chain EVM & ZK Studio",
      description: "Smart contract compilation, Foundry fuzz testing, zero-knowledge circuit verification, and cross-chain messaging bridges.",
      icon: Boxes,
      accent: "text-orange-400",
      category: "Web3",
    },
    {
      module: "CRUCION HUB",
      title: "Universal Extension Registry",
      description: "Curated marketplace of microVM container templates, AgentOS tool plugins, security analyzers, and community modules.",
      icon: PackagePlus,
      accent: "text-teal-400",
      category: "Registry",
    },
    {
      module: "CRUCION TRUST",
      title: "Enterprise Multi-Tenant RBAC",
      description: "Role-based access controls, cryptographic audit logs, enterprise SSO integration, and SOC 2 compliance readiness.",
      icon: Building2,
      accent: "text-sky-400",
      category: "Governance",
    },
  ];

  return (
    <section id="pillars" className="py-20 bg-[#0E121D]/50 border-y border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="fusion" size="md">
            BRAND FOUNDATION
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
            The 12 CRUCION Pillars
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
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
                className="p-5 bg-[#111522] border-white/[0.07] hover:border-white/20 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <BrandBadge module={p.module} size="sm" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {p.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#171C2A] group-hover:scale-105 transition-transform">
                      <Icon className={`h-4.5 w-4.5 ${p.accent}`} />
                    </div>
                    <h3 className="text-sm font-bold text-white font-['Space_Grotesk',sans-serif] group-hover:text-[#8B5CF6] transition-colors">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Architecture Ready</span>
                  <Link
                    href="/dashboard"
                    className="text-[#22D3EE] group-hover:translate-x-1 transition-transform flex items-center"
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
