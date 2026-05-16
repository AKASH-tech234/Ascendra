import * as React from "react";
import { cn } from "../../lib/cn";

export type BadgeVariant = "soft" | "outline" | "success" | "warning" | "danger" | "info";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  soft: "bg-primary-50 text-primary-700",
  outline: "border border-line text-ink-2",
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
  info: "bg-primary-50 text-primary-600",
};

export function Badge({ variant = "soft", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
