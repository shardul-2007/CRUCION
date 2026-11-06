"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCrucionStore } from "@/lib/store";
import { createProjectAction } from "@/app/actions/workspace";
import { Hammer, Sparkles, Box, Server, Check } from "lucide-react";

export function NewProjectModal() {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, addProject } = useCrucionStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [runtime, setRuntime] = useState<"Rust / LLVM" | "Node 24 / V8" | "Python 3.12 / PyPy" | "Go 1.23" | "Solidity / EVM">("Node 24 / V8");
  const [gitRepoUrl, setGitRepoUrl] = useState("");
  const [cluster, setCluster] = useState<"us-east-metal" | "eu-central-edge" | "ap-south-gpu">("us-east-metal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const runtimes = [
    {
      id: "Node 24 / V8" as const,
      label: "Node 24 / V8",
      desc: "Next.js App Router, TypeScript, ultra-fast asynchronous event loops.",
    },
    {
      id: "Rust / LLVM" as const,
      label: "Rust / LLVM",
      desc: "MicroVM native, zero-cost abstractions, extreme memory safety.",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("containerRuntime", runtime);
    formData.append("cluster", cluster);
    if (gitRepoUrl.trim()) {
      formData.append("gitRepoUrl", gitRepoUrl.trim());
    }

    // Call real server action with DB persistence
    const res = await createProjectAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      addProject({
        name: name.toLowerCase().replace(/\s+/g, "-"),
        description: description || "Containerized workspace provisioned on CRUCION microVM cluster.",
        containerRuntime: runtime,
        stack: [runtime.split(" ")[0], "MicroVM", "eBPF"],
        status: "active",
        cluster,
      });

      setSuccessMsg(res.message);
      setTimeout(() => {
        setIsNewProjectModalOpen(false);
        setName("");
        setDescription("");
        setGitRepoUrl("");
        setSuccessMsg("");
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <Modal
      isOpen={isNewProjectModalOpen}
      onClose={() => setIsNewProjectModalOpen(false)}
      title="Create New Project"
      description="Scaffold an isolated microVM workspace with automated toolchains, git synchronization, and zero-downtime deploy hooks."
      maxWidth="xl"
    >
      {successMsg ? (
        <div className="py-8 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <Check className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
            {successMsg}
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Provisioned in cluster: {cluster}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Project Identifier
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. origin-sentinel-v2"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Description
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. High-throughput edge traffic classifier and proxy"
            />
          </div>

          {/* Container Runtime Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Container Runtime & Toolchain
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {runtimes.map((rt) => {
                const isSelected = runtime === rt.id;
                return (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => setRuntime(rt.id)}
                    className={`p-3 rounded-lg text-left transition-all border cursor-pointer ${
                      isSelected
                        ? "border-[#0066cc] bg-sky-50 text-slate-900 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{rt.label}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#0066cc]" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{rt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cluster Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Target MicroVM Cluster
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: "us-east-metal" as const, label: "us-east-metal", ping: "1.2ms" },
                { id: "eu-central-edge" as const, label: "eu-central-edge", ping: "2.1ms" },
                { id: "ap-south-gpu" as const, label: "ap-south-gpu", ping: "4.6ms" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCluster(c.id)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    cluster === c.id
                      ? "border-[#0066cc] bg-sky-50 text-[#0066cc] font-bold"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  <div>{c.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{c.ping}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Git Sync (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              GitHub Repository Sync (Optional)
            </label>
            <Input
              value={gitRepoUrl}
              onChange={(e) => setGitRepoUrl(e.target.value)}
              placeholder="https://github.com/organization/repo.git"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNewProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              <span>Provision MicroVM Project</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
