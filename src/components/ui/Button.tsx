import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "emerald";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D14] disabled:pointer-events-none disabled:opacity-45 rounded-lg active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-[0_0_20px_-3px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_0_rgba(139,92,246,0.55)] focus-visible:ring-[#8B5CF6]",
      secondary:
        "bg-[#171C2A] text-[#22D3EE] border border-[#22D3EE]/30 hover:bg-[#1E2538] hover:border-[#22D3EE]/60 shadow-[0_0_15px_-4px_rgba(34,211,238,0.25)] focus-visible:ring-[#22D3EE]",
      outline:
        "bg-transparent text-slate-200 border border-white/10 hover:bg-white/[0.05] hover:text-white hover:border-white/20 focus-visible:ring-slate-400",
      ghost:
        "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/[0.06] focus-visible:ring-slate-400",
      emerald:
        "bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 hover:bg-[#34D399]/25 hover:border-[#34D399]/50 focus-visible:ring-[#34D399]",
      danger:
        "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 focus-visible:ring-rose-500",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9.5 px-4 text-sm gap-2",
      lg: "h-11 px-6 text-base gap-2.5 font-semibold",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
