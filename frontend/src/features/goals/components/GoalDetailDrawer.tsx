import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Flag, Hash, Target, X } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import type { Goal, GoalStatus } from "../types";
import { toast } from "sonner";
import { useGoals, useUpdateGoalStatus } from "../hooks";

const statusBadge: Record<
  GoalStatus,
  {
    label: string;
    variant: "success" | "warning" | "danger" | "info" | "outline";
  }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SUBMITTED: { label: "Submitted", variant: "info" },
  APPROVED: { label: "Approved", variant: "success" },
  REJECTED: { label: "Rejected", variant: "danger" },
  COMPLETED: { label: "Completed", variant: "success" },
};

export type GoalDetailDrawerProps = {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
};

export function GoalDetailDrawer({
  goal,
  isOpen,
  onClose,
}: GoalDetailDrawerProps) {
  const { data: goals } = useGoals();
  const statusMutation = useUpdateGoalStatus();

  const statusInfo = goal ? statusBadge[goal.status] : null;
  const categoryLabel = goal?.categoryId
    ? goal.categoryId.charAt(0).toUpperCase() + goal.categoryId.slice(1)
    : "";
  const dueDate = goal?.dueDate;
  const showSubmit = goal?.status === "DRAFT";
  const uomLabel = goal
    ? {
        MIN_MAX: "Min/Max",
        TIMELINE: "Timeline",
        ZERO: "Zero-based",
      }[goal.uom]
    : "";

  const activeGoals = useMemo(
    () =>
      goals?.filter(
        (item) => item.status !== "REJECTED" && item.status !== "COMPLETED",
      ) ?? [],
    [goals],
  );

  const totalWeight = useMemo(
    () => activeGoals.reduce((sum, item) => sum + (item.weight || 0), 0),
    [activeGoals],
  );

  const handleSubmitForApproval = () => {
    if (!goal) return;
    if (Math.abs(totalWeight - 100) > 0.01) {
      toast.error(
        `Total goal weight must be 100%. Current total: ${totalWeight.toFixed(1)}%.`,
      );
      return;
    }
    statusMutation.mutate(
      { id: goal.id, status: "SUBMITTED" },
      { onSuccess: onClose },
    );
  };

  return (
    <AnimatePresence>
      {isOpen && goal ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-surface shadow-2xl"
            aria-label="Goal details"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-2">
                  Goal details
                </div>
                <h3 className="text-xl font-bold text-ink">{goal.title}</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-ink-2 transition-colors hover:bg-surface-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="flex flex-wrap items-center gap-3">
                {statusInfo ? (
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                ) : null}
                <Badge variant="outline">Weight {goal.weight}%</Badge>
                {categoryLabel ? (
                  <Badge variant="outline">{categoryLabel}</Badge>
                ) : null}
              </div>

              <div className="rounded-2xl border border-line bg-surface-2/60 p-4">
                <div className="flex items-center gap-3 text-sm text-ink-2">
                  <Target className="h-4 w-4 text-accent" />
                  Progress
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">
                      {goal.progress}% complete
                    </span>
                    <span className="text-ink-2">Target</span>
                  </div>
                  <progress
                    className="mt-2 w-full"
                    value={Math.min(goal.progress, 100)}
                    max={100}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-2">
                    <Calendar className="h-4 w-4" />
                    Start date
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink">
                    {new Date(goal.startDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-2">
                    <Calendar className="h-4 w-4" />
                    Due date
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink">
                    {dueDate
                      ? new Date(dueDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-2">
                    <Target className="h-4 w-4" />
                    Target value
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink">
                    {goal.targetValue} {uomLabel}
                  </div>
                </div>
                <div className="rounded-xl border border-line bg-white p-4 sm:col-span-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-2">
                    <Hash className="h-4 w-4" />
                    Goal ID
                  </div>
                  <div className="mt-2 text-sm font-semibold text-ink">
                    {goal.id}
                  </div>
                </div>
              </div>

              {goal.description ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-2">
                    Description
                  </div>
                  <p className="text-sm text-ink-2">{goal.description}</p>
                </div>
              ) : null}

              {goal.status === "APPROVED" ? (
                <div className="rounded-xl border border-success-100 bg-success-50 px-4 py-3 text-sm text-success-700">
                  Approved goals are locked for the current cycle.
                </div>
              ) : null}

              <div className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink-2">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-accent" />
                  Manager review required before final lock-in.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line px-6 py-5">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
              {showSubmit ? (
                <Button
                  onClick={handleSubmitForApproval}
                  disabled={statusMutation.isPending}
                >
                  {statusMutation.isPending
                    ? "Submitting..."
                    : "Submit for approval"}
                </Button>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
