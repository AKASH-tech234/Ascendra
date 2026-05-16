import { motion } from "framer-motion";
import { Badge } from "./badge";
import type { BadgeVariant } from "./badge";
import { cn } from "../../lib/cn";
import { Skeleton } from "./skeleton";

export type GoalStatus =
  | "On Track"
  | "At Risk"
  | "Off Track"
  | "Completed"
  | "Pending"
  | "Draft";

export type GoalCardProps = {
  title: string;
  status: GoalStatus;
  progress: number;
  dueDate?: string;
  weight?: string;
  category?: string;
  index?: number;
  onClick?: () => void;
  className?: string;
};

const statusConfig: Record<
  GoalStatus,
  { variant: BadgeVariant; label: string }
> = {
  "On Track": { variant: "success", label: "On Track" },
  "At Risk": { variant: "warning", label: "At Risk" },
  "Off Track": { variant: "danger", label: "Off Track" },
  Completed: { variant: "success", label: "Completed" },
  Pending: { variant: "info", label: "Pending" },
  Draft: { variant: "outline", label: "Draft" },
};

function getProgressColor(progress: number): string {
  if (progress >= 75) return "bg-success-500";
  if (progress >= 50) return "bg-warning-500";
  return "bg-danger-500";
}

export function GoalCard({
  title,
  status,
  progress,
  dueDate,
  weight,
  category,
  index = 0,
  onClick,
  className,
}: GoalCardProps) {
  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ scale: onClick ? 1.01 : 1 }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-ink truncate">{title}</h4>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge variant={config.variant}>{config.label}</Badge>
            {category && <Badge variant="outline">{category}</Badge>}
          </div>
        </div>
        <div className="text-right shrink-0">
          {weight && (
            <div className="text-xs font-semibold text-ink-2">
              Weight: {weight}
            </div>
          )}
          {dueDate && (
            <div className="text-xs text-ink-2 mt-0.5">Due {dueDate}</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-ink-2">Progress</span>
          <span className="font-bold text-ink">{progress}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${getProgressColor(progress)}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.8,
              delay: index * 0.08 + 0.2,
              ease: "easeOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function GoalCardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 space-y-3 min-w-0">
          <Skeleton className="h-5 w-2/3 max-w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
        <div className="space-y-2 text-right shrink-0">
          <Skeleton className="h-4 w-16 ml-auto" />
          <Skeleton className="h-3 w-20 ml-auto" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="flex justify-between items-center mb-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}
