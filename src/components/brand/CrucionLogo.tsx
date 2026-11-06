import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CrucionLogoProps {
  size?: "sm" | "md" | "lg";
  showMotto?: boolean;
  asLink?: boolean;
  className?: string;
  theme?: "light" | "dark" | "auto";
}

export function CrucionLogo({
  size = "md",
  showMotto = false,
  asLink = true,
  className,
}: CrucionLogoProps) {
  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-2xl tracking-tight",
  };

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 select-none group", className)}>
      {/* Precision Shield Icon matching GuardScale/Enterprise reference */}
      <div className={cn("relative flex items-center justify-center shrink-0", iconSizes[size])}>
        <div className="relative h-full w-full rounded-lg bg-gradient-to-b from-[#0284c7] to-[#005bb5] p-1 flex items-center justify-center shadow-sm group-hover:shadow transition-all">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full text-white"
          >
            {/* Enterprise Security & Orchestration Shield */}
            <path
              d="M12 2L4 5V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5L12 2Z"
              fill="currentColor"
              fillOpacity="0.15"
              stroke="white"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Central convergence node */}
            <path
              d="M12 7V17M8 12L12 17L16 12"
              stroke="white"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "font-bold text-slate-900 font-['Space_Grotesk',sans-serif]",
              textSizes[size]
            )}
          >
            Crucion
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7] inline-block shadow-sm" />
        </div>
        {showMotto && (
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-medium -mt-0.5">
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
