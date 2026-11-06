"use client";

import React, { useState, useEffect } from "react";
import {
  Plug,
  Check,
  AlertCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  upsertIntegrationAction,
  deleteIntegrationAction,
} from "@/app/actions/workspace";

interface ServiceItem {
  id: string;
  name: string;
  provider: string;
  description: string;
  keyPrefix: string;
  docsUrl: string;
}

const SUPPORTED_SERVICES: ServiceItem[] = [
  {
    id: "OPENAI",
    name: "OpenAI",
    provider: "OPENAI",
    description: "GPT-4o, o3-mini, and text embedding models",
    keyPrefix: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "ANTHROPIC",
    name: "Anthropic",
    provider: "ANTHROPIC",
    description: "Claude 3.7 Sonnet, Claude 3.5 Haiku reasoning swarms",
    keyPrefix: "sk-ant-...",
    docsUrl: "https://console.anthropic.com/",
  },
  {
    id: "GOOGLE_GEMINI",
    name: "Google Gemini AI",
    provider: "GOOGLE_GEMINI",
    description: "Gemini 2.5 Pro & Flash multimodal developer models",
    keyPrefix: "AIzaSy...",
    docsUrl: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "GITHUB",
    name: "GitHub",
    provider: "GITHUB",
    description: "Personal Access Token for repository synchronization & pull requests",
    keyPrefix: "ghp_...",
    docsUrl: "https://github.com/settings/tokens",
  },
  {
    id: "VERCEL",
    name: "Vercel",
    provider: "VERCEL",
    description: "Production edge deployment token and project automation",
    keyPrefix: "Bearer token",
    docsUrl: "https://vercel.com/account/tokens",
  },
  {
    id: "OLLAMA",
    name: "Ollama (Local Models)",
    provider: "OLLAMA",
    description: "Local microVM daemon for DeepSeek, Llama 3, and Qwen",
    keyPrefix: "http://localhost:11434",
    docsUrl: "https://ollama.ai/",
  },
];

interface ConnectedIntegration {
  id: string;
  provider: string;
  name: string;
  keyHint: string;
  status: string;
  lastValidatedAt?: string;
}

export function ConnectedServicesPanel() {
  const [integrations, setIntegrations] = useState<ConnectedIntegration[]>([]);
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);
  const [secretInput, setSecretInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchIntegrations = async () => {
    try {
      const res = await fetch("/api/integrations");
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data.integrations || []);
      }
    } catch {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSaveSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalService || !secretInput.trim()) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("provider", activeModalService.provider);
    formData.append("name", activeModalService.name);
    formData.append("secretKey", secretInput.trim());

    const res = await upsertIntegrationAction(formData);
    setLoading(false);

    if (res.success) {
      setMessage({ text: res.message, type: "success" });
      setSecretInput("");
      setActiveModalService(null);
      await fetchIntegrations();
    } else {
      setMessage({ text: res.message, type: "error" });
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    if (!confirm("Are you sure you want to disconnect this integration? The secret will be immediately purged.")) {
      return;
    }

    const res = await deleteIntegrationAction(integrationId);
    if (res.success) {
      setMessage({ text: res.message, type: "success" });
      await fetchIntegrations();
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
            Connected Services & Ecosystem
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Connect your AI providers, hosting targets, and code repositories to your Crucion account.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0">
          <ShieldCheck className="h-4 w-4" />
          <span>AES-256-GCM Encrypted at Rest</span>
        </div>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid of supported services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SUPPORTED_SERVICES.map((srv) => {
          const connected = integrations.find(
            (i) => i.provider.toUpperCase() === srv.provider.toUpperCase()
          );

          return (
            <Card key={srv.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{srv.name}</span>
                  {connected ? (
                    <Badge variant="emerald" size="sm" dot>
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" size="sm">
                      Not Connected
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {srv.description}
                </p>

                {connected && (
                  <div className="pt-1 text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between">
                    <span>Key Hint:</span>
                    <span className="font-bold text-slate-900">{connected.keyHint}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={srv.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#0066cc] hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Get Key</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                {connected ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveModalService(srv);
                        setSecretInput("");
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDisconnect(connected.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setActiveModalService(srv);
                      setSecretInput("");
                    }}
                  >
                    <Plug className="h-3.5 w-3.5" />
                    <span>Connect</span>
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Secret Configuration Dialog */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setActiveModalService(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 font-['Space_Grotesk',sans-serif]">
                Connect {activeModalService.name}
              </h3>
              <button
                onClick={() => setActiveModalService(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSecret} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Secret API Key or Endpoint Token
                </label>
                <Input
                  type="password"
                  placeholder={activeModalService.keyPrefix}
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  icon={<KeyRound className="h-4 w-4" />}
                  required
                  autoFocus
                />
                <p className="text-[11px] text-slate-500">
                  Your credential is encrypted with AES-256-GCM before storage and never returned to the browser.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveModalService(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                >
                  Save & Validate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
