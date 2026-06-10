import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "muted";
}

const variants = {
  default: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-white/10",
  success: "bg-emerald-500/15 text-emerald-700 border border-emerald-500/20 dark:text-emerald-300",
  warning: "bg-amber-500/15 text-amber-700 border border-amber-500/20 dark:text-amber-300",
  danger: "bg-rose-500/15 text-rose-700 border border-rose-500/20 dark:text-rose-300",
  muted: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-slate-700",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
