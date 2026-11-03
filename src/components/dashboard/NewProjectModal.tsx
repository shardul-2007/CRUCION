"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCrucionStore } from "@/lib/store";
import { Hammer, Sparkles, Box, Server, Check } from "lucide-react";

export function NewProjectModal() {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, addProject } = useCrucionStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [runtime, setRuntime] = useState<"Rust / LLVM" | "Node 24 / V8" | "Python 3.12 / PyPy" | "Go 1.23" | "Solidity / EVM">("Rust / LLVM");
  const [stackInput, setStackInput] = useState("Rust, Tokio, WASM");
  const [cluster, setCluster] = useState<"us-east-metal" | "eu-central-edge" | "ap-south-gpu">("us-east-metal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const runtimes = [
    {
      id: "Rust / LLVM" as const,
      label: "Rust / LLVM",
      desc: "MicroVM native, zero-cost abstractions, extreme memory safety.",
    },
    {
      id: "Node 24 / V8" as const,
      label: "Node 24 / V8",
      desc: "Next.js App Router, TypeScript, ultra-fast asynchronous event loops.",
    },
    {
      id: "Python 3.12 / PyPy" as const,
      label: "Python 3.12 / PyPy",
      desc: "Distributed AI embeddings, PyTorch vector compute pipelines.",
    },
    {
      id: "Go 1.23" as const,
      label: "Go 1.23",
      desc: "High-concurrency microservices, eBPF & Envoy edge routing.",
    },
    {
      id: "Solidity / EVM" as const,
      label: "Solidity / EVM",
      desc: "Smart contracts, Foundry fuzzing, and zero-knowledge rollups.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const stack = stackInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      addProject({
        name: name.toLowerCase().replace(/\s+/g, "-"),
        description: description || "Containerized workspace provisioned on CRUCION microVM cluster.",
        containerRuntime: runtime,
        stack: stack.length > 0 ? stack : ["Crucion Core", "Container"],
        status: "active",
        cluster,
      });

      setIsSubmitting(false);
      setSuccessMsg(`Project "${name}" forged successfully!`);
      setTimeout(() => {
        setSuccessMsg("");
        setIsNewProjectModalOpen(false);
        setName("");
        setDescription("");
      }, 1000);
    }, 600);
  };

  return (
    <Modal
      isOpen={isNewProjectModalOpen}
      onClose={() => setIsNewProjectModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Hammer className="h-5 w-5 text-[#8B5CF6]" />
          <span>CRUCION FORGE — Scaffold Project</span>
        </div>
      }
      description="Provision an isolated container workspace with optimized memory limits, tool sandbox, and deployment pipeline."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {successMsg && (
          <div className="p-3 rounded-lg bg-[#34D399]/15 border border-[#34D399]/30 text-[#34D399] text-xs flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Project Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase text-slate-300 font-medium">
            Project Identifier
          </label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. quantum-gateway or telemetry-agent"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase text-slate-300 font-medium">
            Project Scope & Objective
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Low-latency edge service with automatic container failover."
          />
        </div>

        {/* Container Runtime Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase text-slate-300 font-medium">
            Container Runtime Architecture
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {runtimes.map((rt) => (
              <button
                key={rt.id}
                type="button"
                onClick={() => setRuntime(rt.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  runtime === rt.id
                    ? "bg-[#8B5CF6]/15 border-[#8B5CF6] shadow-[0_0_15px_-4px_rgba(139,92,246,0.3)]"
                    : "bg-[#0E121D] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-white">{rt.label}</span>
                  {runtime === rt.id && <Check className="h-3.5 w-3.5 text-[#8B5CF6]" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{rt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Stack Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase text-slate-300 font-medium">
            Tech Stack Tags (Comma Separated)
          </label>
          <Input
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            placeholder="e.g. Rust, Tokio, eBPF, gRPC"
          />
        </div>

        {/* Target Cluster */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase text-slate-300 font-medium">
            Target MicroVM Cluster
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "us-east-metal" as const, label: "us-east-metal", ping: "1.2ms" },
              { id: "eu-central-edge" as const, label: "eu-central-edge", ping: "2.1ms" },
              { id: "ap-south-gpu" as const, label: "ap-south-gpu", ping: "4.6ms" },
            ].map((cl) => (
              <button
                key={cl.id}
                type="button"
                onClick={() => setCluster(cl.id)}
                className={`p-2 rounded-lg border text-center font-mono text-xs cursor-pointer ${
                  cluster === cl.id
                    ? "bg-[#22D3EE]/15 border-[#22D3EE] text-[#67E8F9]"
                    : "bg-[#0E121D] border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <div>{cl.label}</div>
                <div className="text-[9px] text-[#34D399]">{cl.ping}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsNewProjectModalOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            <Sparkles className="h-4 w-4" />
            <span>Forge Project</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
