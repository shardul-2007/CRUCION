"use client";

import React, { useState } from "react";
import { Container, Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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
    <section id="architecture" className="py-20 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <Badge variant="blue" size="md">
            CRUCION CONTAINER RUNTIME
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif] tracking-tight">
            One Container. Every Technology.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
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
                className={`px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-[#0066cc] text-white shadow-sm font-semibold"
                    : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {rt.name.split(" ")[0]}
              </button>
            );
          })}
        </div>

        {/* Interactive Container Shell Visualization */}
        <div className="rounded-xl bg-white border border-slate-200/90 shadow-sm p-6 lg:p-8">
          {/* Top Bar of the Container Shell */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[#0066cc]">
                <Container className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
                    {current.name}
                  </h3>
                  <Badge variant="emerald" size="sm" dot>
                    Verified
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{current.motto}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200/60">
                <span className="text-slate-400">Boot:</span>
                <span className="text-slate-900 font-bold">{current.bootTime}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200/60">
                <span className="text-slate-400">RAM:</span>
                <span className="text-slate-900 font-bold">{current.memoryOverhead}</span>
              </div>
            </div>
          </div>

          {/* Grid: Code preview + Toolchain details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
            {/* Code Box */}
            <div className="lg:col-span-8 rounded-lg bg-slate-900 p-4 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-700" />
                  <span>runtime.spec</span>
                </div>
                <span>Isolated microVM sandbox</span>
              </div>
              <pre className="text-sky-300">
                <code>{current.codeSnippet}</code>
              </pre>
            </div>

            {/* Toolchain capabilities */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-xs font-mono font-semibold uppercase text-slate-500 tracking-wider">
                Integrated Toolchain
              </div>
              <div className="space-y-2">
                {current.toolchains.map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs font-mono"
                  >
                    <span className="text-slate-800 font-medium">{tool}</span>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
