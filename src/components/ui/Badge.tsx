import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "blue"
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
    default: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-sky-50 text-[#0284c7] border-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    outline: "bg-transparent text-slate-600 border-slate-300",
    preview: "bg-sky-50 text-[#0284c7] border-sky-200 font-mono text-[9px] uppercase tracking-wider font-semibold",
  };

  const dotColors = {
    default: "bg-slate-400",
    blue: "bg-[#0284c7]",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    outline: "bg-slate-400",
    preview: "bg-[#0284c7]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn("relative inline-flex rounded-full h-1.5 w-1.5", dotColors[variant])}
          />
        </span>
      )}
      {children}
    </span>
  );
}
