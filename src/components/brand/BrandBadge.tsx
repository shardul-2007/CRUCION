import React from "react";
import { BrandModule } from "@/types";
import { cn } from "@/lib/utils";

interface BrandBadgeProps {
  module: BrandModule;
  className?: string;
  size?: "sm" | "md";
}

export function BrandBadge({ module, className, size = "sm" }: BrandBadgeProps) {
  const brandStyles: Record<BrandModule, { text: string; bg: string; border: string }> = {
    "CRUCION CORE": {
      text: "text-[#0066cc]",
      bg: "bg-sky-50",
      border: "border-sky-200",
    },
    "CRUCION FORGE": {
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    "CRUCION AGENT": {
      text: "text-sky-700",
      bg: "bg-sky-50",
      border: "border-sky-200",
    },
    "CRUCION SPACE": {
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    "CRUCION DEPLOY": {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    "CRUCION DATA": {
      text: "text-indigo-700",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
    },
    "CRUCION SHIELD": {
      text: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-200",
    },
    "CRUCION FLOW": {
      text: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    "CRUCION PULSE": {
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    "CRUCION CHAIN": {
      text: "text-orange-700",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
    "CRUCION HUB": {
      text: "text-teal-700",
      bg: "bg-teal-50",
      border: "border-teal-200",
    },
    "CRUCION TRUST": {
      text: "text-sky-700",
      bg: "bg-sky-50",
      border: "border-sky-200",
    },
  };

  const style = brandStyles[module] || {
    text: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono font-bold tracking-wider rounded border select-none",
        style.text,
        style.bg,
        style.border,
        sizeStyles[size],
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current opacity-80" />
      <span>{module}</span>
    </span>
  );
}
