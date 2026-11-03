"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Menu, X, Sparkles, Layers } from "lucide-react";
import { CrucionLogo } from "@/components/brand/CrucionLogo";
import { Button } from "@/components/ui/Button";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0B0D14]/85 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo with Motto */}
        <CrucionLogo size="md" showMotto={true} asLink={true} />

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          <a href="#architecture" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#pillars" className="hover:text-white transition-colors">
            12 Pillars
          </a>
          <a href="#agent-os" className="hover:text-white transition-colors">
            AgentOS
          </a>
          <a href="#microvm" className="hover:text-white transition-colors">
            MicroVM Fleet
          </a>
        </div>

        {/* CTA to Command Center */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/dashboard">
            <Button size="md" variant="primary" className="shadow-[0_0_20px_-3px_rgba(139,92,246,0.5)]">
              <span>Enter Command Center</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111522] border-b border-white/10 p-4 space-y-3">
          <a
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1"
          >
            Architecture
          </a>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1"
          >
            12 Pillars
          </a>
          <a
            href="#agent-os"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1"
          >
            AgentOS
          </a>
          <a
            href="#microvm"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-slate-300 hover:text-white py-1"
          >
            MicroVM Fleet
          </a>
          <div className="pt-2 border-t border-white/10">
            <Link href="/dashboard" className="block w-full">
              <Button size="md" variant="primary" className="w-full justify-center">
                <span>Enter Command Center</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
