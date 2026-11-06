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
import { ArrowRight, Terminal } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#0066cc]/15 selection:text-slate-900">
      {/* Persistent Navigation Bar */}
      <LandingNavbar />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section matching GuardScale reference */}
        <HeroSection />

        {/* Container Architecture Visualizer */}
        <ContainerVisualizer />

        {/* 12 Brand Pillars */}
        <EcosystemGrid />

        {/* Feature Showcase: AgentOS & Deployments */}
        <FeatureShowcase />

        {/* Final CTA Banner */}
        <section className="py-20 relative bg-slate-50 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Space_Grotesk',sans-serif] tracking-tight">
              One Container. Every Technology. <br />
              <span className="text-[#0066cc]">From Idea to Enterprise.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Launch your isolated microVM container, assign autonomous AgentOS swarms, and orchestrate global production deployments.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto px-8 py-3.5 shadow-sm"
                >
                  <Terminal className="h-4.5 w-4.5" />
                  <span>Create your workspace</span>
                  <ArrowRight className="h-4.5 w-4.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <CrucionLogo size="md" showMotto={true} asLink={true} />

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-mono">
              <Link href="/dashboard" className="hover:text-[#0066cc] transition-colors">
                Command Center
              </Link>
              <a href="#architecture" className="hover:text-[#0066cc] transition-colors">
                Container Kernel
              </a>
              <a href="#pillars" className="hover:text-[#0066cc] transition-colors">
                12 Brand Pillars
              </a>
              <a href="#agent-os" className="hover:text-[#0066cc] transition-colors">
                AgentOS
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div>
              © 2026 CRUCION Universal Software Engineering Ecosystem. All rights reserved.
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Zero-Trust Security Mesh Active
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
