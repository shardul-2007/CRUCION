import React from "react";
import { BrandModule } from "@/types";
import { cn } from "@/lib/utils";

interface BrandBadgeProps {
  module: BrandModule;
  className?: string;
  size?: "sm" | "md";
}

export function BrandBadge({ module, className, size = "sm" }: BrandBadgeProps) {
  // Mapping each CRUCION brand pillar to refined cybernetic color highlights
  const brandStyles: Record<BrandModule, { text: string; bg: string; border: string }> = {
    "CRUCION CORE": {
      text: "text-[#C4B5FD]",
      bg: "bg-[#8B5CF6]/10",
      border: "border-[#8B5CF6]/30",
    },
    "CRUCION FORGE": {
      text: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
    "CRUCION AGENT": {
      text: "text-[#67E8F9]",
      bg: "bg-[#22D3EE]/10",
      border: "border-[#22D3EE]/30",
    },
    "CRUCION SPACE": {
      text: "text-blue-300",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
    "CRUCION DEPLOY": {
      text: "text-[#6EE7B7]",
      bg: "bg-[#34D399]/10",
      border: "border-[#34D399]/30",
    },
    "CRUCION DATA": {
      text: "text-indigo-300",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
    },
    "CRUCION SHIELD": {
      text: "text-rose-300",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
    },
    "CRUCION FLOW": {
      text: "text-purple-300",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
    },
    "CRUCION PULSE": {
      text: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    "CRUCION CHAIN": {
      text: "text-orange-300",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
    },
    "CRUCION HUB": {
      text: "text-teal-300",
      bg: "bg-teal-500/10",
      border: "border-teal-500/30",
    },
    "CRUCION TRUST": {
      text: "text-sky-300",
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
    },
  };

  const style = brandStyles[module] || brandStyles["CRUCION CORE"];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px]",
    md: "px-2.5 py-1 text-[11px]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-semibold tracking-wider uppercase rounded border",
        style.text,
        style.bg,
        style.border,
        sizeClasses[size],
        className
      )}
    >
      {module}
    </span>
  );
}
