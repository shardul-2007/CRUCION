"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { CrucionLogo } from "@/components/brand/CrucionLogo";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo matching GuardScale reference */}
        <CrucionLogo size="md" showMotto={false} asLink={true} />

        {/* Desktop Nav Links - simple, clean, minimalist */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="/dashboard" className="hover:text-[#0066cc] transition-colors">
            API
          </Link>
          <Link href="/dashboard" className="hover:text-[#0066cc] transition-colors">
            MCP
          </Link>
          <a href="#architecture" className="hover:text-[#0066cc] transition-colors">
            Architecture
          </a>
          <a href="#pillars" className="hover:text-[#0066cc] transition-colors">
            12 Pillars
          </a>
        </div>

        {/* Auth Navigation: Sign in + Sign up pill button */}
        <div className="hidden sm:flex items-center gap-5">
          <Link
            href="/signin"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <span>Sign up</span>
            <span className="text-slate-400">→</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-lg">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 hover:text-[#0066cc]"
            >
              API Reference
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 hover:text-[#0066cc]"
            >
              MCP Protocol Hub
            </Link>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 hover:text-[#0066cc]"
            >
              Architecture
            </a>
            <a
              href="#pillars"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 hover:text-[#0066cc]"
            >
              12 Pillars
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/signin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-800"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-[#0066cc] text-white text-sm font-medium shadow-sm"
            >
              Sign up →
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
