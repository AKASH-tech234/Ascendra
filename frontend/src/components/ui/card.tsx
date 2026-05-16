import * as React from "react";
import { cn } from "../../lib/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function Card({ className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-6 shadow-card transition-all duration-300",
        hover && "hover:shadow-card-hover hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}
