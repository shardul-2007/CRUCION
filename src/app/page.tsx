"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ContainerVisualizer } from "@/components/landing/ContainerVisualizer";
import { EcosystemGrid } from "@/components/landing/EcosystemGrid";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Terminal, Shield, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0D14] text-slate-100 flex flex-col selection:bg-[#8B5CF6]/30 selection:text-white">
      {/* Persistent Navigation Bar */}
      <LandingNavbar />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section with Live Telemetry */}
        <HeroSection />

        {/* Container Architecture Visualizer */}
        <ContainerVisualizer />

        {/* 12 Brand Pillars */}
        <EcosystemGrid />

        {/* Feature Showcase: AgentOS & Deployments */}
        <FeatureShowcase />

        {/* Final CTA Banner */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-transparent via-[#111522] to-[#0B0D14] border-t border-white/[0.06]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk',sans-serif] tracking-tight">
              One Container. Every Technology. <br />
              <span className="text-[#22D3EE]">From Idea to Enterprise.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Launch your isolated microVM container, assign autonomous AgentOS swarms, and orchestrate global production deployments.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-3.5 shadow-[0_0_25px_0_rgba(139,92,246,0.5)]"
                >
                  <Terminal className="h-4.5 w-4.5" />
                  <span>Launch CRUCION Console</span>
                  <ArrowRight className="h-4.5 w-4.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#0E121D] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <CrucionLogo size="md" showMotto={true} asLink={true} />

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-mono">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Command Center
              </Link>
              <a href="#architecture" className="hover:text-white transition-colors">
                Container Kernel
              </a>
              <a href="#pillars" className="hover:text-white transition-colors">
                12 Brand Pillars
              </a>
              <a href="#agent-os" className="hover:text-white transition-colors">
                AgentOS
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div>
              © 2026 CRUCION Universal Software Engineering Ecosystem. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#34D399]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
                Zero-Trust Security Mesh Active
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
