import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "crucible"
    | "fusion"
    | "emerald"
    | "amber"
    | "rose"
    | "outline"
    | "preview";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-white/[0.07] text-slate-300 border-white/10",
    crucible:
      "bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/30 shadow-[0_0_12px_-2px_rgba(139,92,246,0.3)]",
    fusion:
      "bg-[#22D3EE]/15 text-[#67E8F9] border-[#22D3EE]/30 shadow-[0_0_12px_-2px_rgba(34,211,238,0.25)]",
    emerald:
      "bg-[#34D399]/15 text-[#6EE7B7] border-[#34D399]/30 shadow-[0_0_12px_-2px_rgba(52,211,153,0.25)]",
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    outline: "bg-transparent text-slate-400 border-white/15",
    preview:
      "bg-gradient-to-r from-[#8B5CF6]/20 to-[#22D3EE]/20 text-[#E0E7FF] border-[#8B5CF6]/40 uppercase tracking-widest text-[9px] font-bold font-mono",
  };

  const dotColors = {
    default: "bg-slate-400",
    crucible: "bg-[#8B5CF6]",
    fusion: "bg-[#22D3EE]",
    emerald: "bg-[#34D399]",
    amber: "bg-amber-400",
    rose: "bg-rose-400",
    outline: "bg-slate-400",
    preview: "bg-[#22D3EE]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {variant === "emerald" && (
            <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
          )}
          <span
            className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColors[variant])}
          />
        </span>
      )}
      {children}
    </span>
  );
}
