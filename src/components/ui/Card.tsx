import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  glow?: "crucible" | "fusion" | "none";
}

export function Card({
  className,
  elevated = false,
  glow = "none",
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    crucible: "hover:border-[#8B5CF6]/50 hover:shadow-[0_0_25px_-5px_rgba(139,92,246,0.3)]",
    fusion: "hover:border-[#22D3EE]/50 hover:shadow-[0_0_25px_-5px_rgba(34,211,238,0.25)]",
    none: "",
  };

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        elevated
          ? "bg-[#171C2A] border-white/[0.09]"
          : "bg-[#111522] border-white/[0.07]",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-5 border-b border-white/[0.05]", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-semibold leading-none tracking-tight text-white font-['Space_Grotesk',sans-serif]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center p-5 pt-0 border-t border-white/[0.04] mt-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
