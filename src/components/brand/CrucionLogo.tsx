import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CrucionLogoProps {
  size?: "sm" | "md" | "lg";
  showMotto?: boolean;
  asLink?: boolean;
  className?: string;
}

export function CrucionLogo({
  size = "md",
  showMotto = false,
  asLink = true,
  className,
}: CrucionLogoProps) {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-base tracking-wider",
    md: "text-xl tracking-widest",
    lg: "text-3xl tracking-widest",
  };

  const content = (
    <div className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* Universal Container Geometric Icon */}
      <div className={cn("relative flex items-center justify-center shrink-0", iconSizes[size])}>
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/40 to-[#22D3EE]/30 blur-md group-hover:blur-lg transition-all" />
        
        {/* Container Hexagon / Cube core */}
        <div className="relative h-full w-full rounded-xl bg-[#171C2A] border border-[#8B5CF6]/40 p-1.5 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]"
          >
            {/* Outer container facet */}
            <path
              d="M16 2L28 8.9282V23.0718L16 30L4 23.0718V8.9282L16 2Z"
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Internal container convergence */}
            <path
              d="M16 2V16M16 16L28 23.0718M16 16L4 23.0718"
              stroke="#22D3EE"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Central energy nucleus */}
            <circle cx="16" cy="16" r="2.5" fill="#34D399" />
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-bold text-white font-['Space_Grotesk',sans-serif] tracking-wider",
              textSizes[size]
            )}
          >
            CRUCION
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE] inline-block shadow-[0_0_8px_#22D3EE]" />
        </div>
        {showMotto && (
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium -mt-0.5">
            One Container. Every Technology.
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
