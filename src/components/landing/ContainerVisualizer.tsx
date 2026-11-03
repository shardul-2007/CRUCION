"use client";

import React, { useState } from "react";
import {
  Container,
  Cpu,
  Layers,
  ShieldCheck,
  Bot,
  Zap,
  Terminal,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function ContainerVisualizer() {
  const [selectedRuntime, setSelectedRuntime] = useState<
    "rust" | "node" | "python" | "go" | "solidity"
  >("rust");

  const runtimes = {
    rust: {
      name: "Rust / LLVM MicroVM",
      motto: "Zero-cost abstractions & deterministic kernel execution",
      bootTime: "180ms",
      memoryOverhead: "4.2 MB",
      toolchains: ["rustc 1.85", "cargo", "tokio", "clippy", "eBPF"],
      codeSnippet: `// CRUCION MicroVM Kernel Native Runtime
#[crucion::container(isolation = "microvm", zero_copy = true)]
pub async fn orchestrate_runtime() -> Result<(), KernelError> {
    let mut ring_buffer = RingBuffer::allocate(MemoryCap::Gigabytes(4))?;
    ring_buffer.bind_ebpf_socket("eth0")?;
    crucion_agent::attach_telemetry(&ring_buffer).await?;
    Ok(())
}`,
    },
    node: {
      name: "Node 24 / V8 MicroVM",
      motto: "Next.js App Router, SSR, and asynchronous event streams",
      bootTime: "240ms",
      memoryOverhead: "14.8 MB",
      toolchains: ["Node 24.18", "TypeScript 6.0", "Next.js 16", "V8 Engine"],
      codeSnippet: `// CRUCION Next.js Container Edge Route
import { defineContainerRoute } from "@crucion/core";

export default defineContainerRoute({
  cluster: "eu-central-edge",
  runtime: "v8-microvm",
  async handler(req) {
    const agent = await crucion.agent.spawn("Aethelgard-7");
    return agent.streamReasoning(req.signal);
  }
});`,
    },
    python: {
      name: "Python 3.12 / PyPy MicroVM",
      motto: "Distributed AI vector embeddings & PyTorch inference",
      bootTime: "310ms",
      memoryOverhead: "22.5 MB",
      toolchains: ["Python 3.12", "PyTorch 2.4", "Milvus", "NumPy", "CUDA"],
      codeSnippet: `# CRUCION Distributed Vector Indexer Container
from crucion import container, AgentOS

@container.microvm(accelerator="gpu-shared", memory="32GB")
def process_embeddings(stream: container.InputStream):
    model = AgentOS.load_reasoning_model("crucion-deepreason-pro")
    for chunk in stream:
        vectors = model.encode_ast(chunk)
        container.vector_bus.sync(vectors)`,
    },
    go: {
      name: "Go 1.23 MicroVM",
      motto: "Ultra-low latency edge router & Envoy proxy termination",
      bootTime: "195ms",
      memoryOverhead: "6.1 MB",
      toolchains: ["Go 1.23", "Envoy", "WireGuard", "gRPC", "Prometheus"],
      codeSnippet: `// CRUCION Anycast Edge Forwarder
package main

import "github.com/crucion/core/microvm"

func main() {
    vm := microvm.InitializeIsolatedPod("edge-router-v2")
    vm.EnableZeroCopySplice()
    vm.ServeAnycastTLS(":443")
}`,
    },
    solidity: {
      name: "Solidity / EVM MicroVM",
      motto: "Cross-chain state verification & Foundry invariant testing",
      bootTime: "210ms",
      memoryOverhead: "8.4 MB",
      toolchains: ["Solc 0.8.28", "Foundry", "Anvil", "ZK-SNARKs"],
      codeSnippet: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { CrucionBridge } from "@crucion/chain/Bridge.sol";

contract QuantumGateway is CrucionBridge {
    function verifyProof(bytes32 stateRoot, bytes calldata proof) external view returns (bool) {
        return crucionShieldVerify(stateRoot, proof);
    }
}`,
    },
  };

  const current = runtimes[selectedRuntime];

  return (
    <section id="architecture" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="crucible" size="md">
            CRUCION CORE ARCHITECTURE
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
            One Container. Every Technology.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
            Eliminate runtime fragmentation. Whether compiling high-speed Rust kernels, running Next.js App Router, or deploying zero-knowledge EVM contracts, each workload executes inside a microVM container with identical telemetry and security.
          </p>
        </div>

        {/* Runtime Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {(Object.keys(runtimes) as (keyof typeof runtimes)[]).map((key) => {
            const rt = runtimes[key];
            const isSelected = selectedRuntime === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedRuntime(key)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#8B5CF6] text-white shadow-[0_0_20px_-3px_rgba(139,92,246,0.6)] font-bold"
                    : "bg-[#111522] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {rt.name.split(" ")[0]}
              </button>
            );
          })}
        </div>

        {/* Interactive Container Shell Visualization */}
        <div className="rounded-2xl bg-[#111522] border border-white/[0.08] shadow-2xl p-6 lg:p-8 relative overflow-hidden">
          {/* Top Bar of the Container Shell */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.07] gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
                <Container className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk',sans-serif]">
                    {current.name}
                  </h3>
                  <Badge variant="emerald" size="sm" dot>
                    Active MicroVM
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{current.motto}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <div>
                <span className="text-slate-500 uppercase text-[10px] block">Cold Boot</span>
                <span className="text-[#34D399] font-bold">{current.bootTime}</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div>
                <span className="text-slate-500 uppercase text-[10px] block">Overhead</span>
                <span className="text-[#22D3EE] font-bold">{current.memoryOverhead}</span>
              </div>
            </div>
          </div>

          {/* Container Interior Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
            {/* Left 5 Cols: Container Layers */}
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider">
                Encapsulated Container Layers
              </div>

              {[
                {
                  title: "CRUCION CORE Kernel",
                  desc: "Firecracker microVM isolation with KVM hardware virtualization.",
                  icon: Cpu,
                  color: "text-[#8B5CF6]",
                },
                {
                  title: "AgentOS Tool Bus",
                  desc: "Direct AST indexing and IPC grounding with autonomous agents.",
                  icon: Bot,
                  color: "text-[#22D3EE]",
                },
                {
                  title: "CRUCION SHIELD",
                  desc: "eBPF zero-trust perimeter, automatic mTLS, and Cosign SBOM attestations.",
                  icon: ShieldCheck,
                  color: "text-rose-400",
                },
                {
                  title: "Edge Anycast Network",
                  desc: "Zero-copy socket splicing with global traffic load distribution.",
                  icon: Zap,
                  color: "text-[#34D399]",
                },
              ].map((layer, idx) => {
                const Icon = layer.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0E121D] border border-white/[0.06] flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[#171C2A] shrink-0 mt-0.5">
                      <Icon className={`h-4 w-4 ${layer.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white font-['Space_Grotesk',sans-serif]">
                        {layer.title}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        {layer.desc}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">
                  Pre-installed Toolchains
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {current.toolchains.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#67E8F9] border border-white/[0.08]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Live Code Execution Preview */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="text-xs font-mono uppercase text-slate-400 font-semibold tracking-wider mb-3">
                Container Manifest & Code Preview
              </div>

              <div className="flex-1 rounded-xl bg-[#080A10] border border-white/10 p-4 font-mono text-xs overflow-x-auto text-slate-300 shadow-inner">
                <pre className="leading-relaxed text-slate-200">
                  <code>{current.codeSnippet}</code>
                </pre>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[#171C2A]/70 border border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-[#34D399]" />
                  <span>crucion run --runtime={selectedRuntime} --isolated</span>
                </span>
                <span className="text-[#34D399]">Ready in &lt;400ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
