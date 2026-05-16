// No imports from react here if unneeded
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSubmitCheckIn } from "../hooks";
import { useGoals } from "../../goals/hooks";
import { checkInSchema } from "../types";
import type { CheckInInput } from "../types";

export interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGoalId?: string;
}

const statusOptions = [
  { value: "ON_TRACK", label: "On track" },
  { value: "AT_RISK", label: "At risk" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NOT_STARTED", label: "Not started" },
];

export function CheckInModal({
  isOpen,
  onClose,
  defaultGoalId,
}: CheckInModalProps) {
  const mutation = useSubmitCheckIn();
  const { data: goals, isLoading: goalsLoading } = useGoals();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckInInput>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      goalId: defaultGoalId || "",
      status: "ON_TRACK",
    },
  });

  const selectedGoalId = watch("goalId");
  const selectedGoal = goals?.find((g) => g.id === selectedGoalId);

  const currentValue = watch("currentValue");
  const uomValue = selectedGoal?.uom;
  const numericCurrentValue = Number(currentValue);
  const requiresCurrentValue =
    uomValue !== undefined && uomValue !== "TIMELINE";
  const hasCurrentValue = Number.isFinite(numericCurrentValue);

  const isWithinWindow = useMemo(() => {
    if (!selectedGoal) return true;
    const now = new Date();
    return (
      now >= new Date(selectedGoal.startDate) &&
      now <= new Date(selectedGoal.dueDate)
    );
  }, [selectedGoal]);

  const computedProgress = useMemo(() => {
    if (!selectedGoal) return 0;

    if (selectedGoal.uom === "TIMELINE") {
      const start = new Date(selectedGoal.startDate).getTime();
      const end = new Date(selectedGoal.dueDate).getTime();
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        return 0;
      }
      const now = Date.now();
      return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
    }

    const numeric = Number(currentValue);
    if (!Number.isFinite(numeric)) return 0;

    if (selectedGoal.uom === "ZERO") {
      if (selectedGoal.targetValue <= 0) {
        return numeric <= 0 ? 100 : 0;
      }
      return Math.min(
        100,
        Math.max(0, (1 - numeric / selectedGoal.targetValue) * 100),
      );
    }

    if (selectedGoal.targetValue <= 0) return 0;
    return Math.min(
      100,
      Math.max(0, (numeric / selectedGoal.targetValue) * 100),
    );
  }, [selectedGoal, currentValue]);

  const onSubmit = (values: CheckInInput) => {
    if (!selectedGoal) {
      toast.error("Select a goal to continue.");
      return;
    }

    if (
      selectedGoal.uom !== "TIMELINE" &&
      !Number.isFinite(values.currentValue)
    ) {
      toast.error("Enter a valid current value for this goal.");
      return;
    }

    if (!isWithinWindow) {
      toast.error("Check-ins are only allowed within the goal timeline.");
      return;
    }

    mutation.mutate(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-surface p-6 shadow-lift"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-ink">
                Submit Progress Check-in
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-surface-2 transition-colors text-ink-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">
                  Select Goal
                </label>
                <select
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                    errors.goalId ? "border-danger-500" : "border-line"
                  }`}
                  disabled={goalsLoading || mutation.isPending}
                  {...register("goalId")}
                >
                  <option value="">Choose an active goal...</option>
                  {goals
                    ?.filter(
                      (g) =>
                        g.status === "APPROVED" || g.status === "SUBMITTED",
                    )
                    .map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.title} ({goal.progress}%)
                      </option>
                    ))}
                </select>
                {errors.goalId && (
                  <p className="text-xs text-danger-500">
                    {errors.goalId.message}
                  </p>
                )}

                {selectedGoal && (
                  <div className="mt-2 flex items-center gap-2 p-3 bg-surface-2/50 rounded-xl border border-line text-sm text-ink-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span>
                      Current Progress:{" "}
                      <strong className="text-ink">
                        {selectedGoal.progress}%
                      </strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-ink">
                    Calculated Progress
                  </label>
                  <span className="text-sm font-bold text-accent">
                    {Math.round(computedProgress)}%
                  </span>
                </div>
                <progress
                  className="w-full"
                  value={Math.min(computedProgress, 100)}
                  max={100}
                />
                {!isWithinWindow && (
                  <p className="text-xs text-danger-500">
                    Check-ins are only allowed between the start and due dates.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">
                    Status
                  </label>
                  <select
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.status ? "border-danger-500" : "border-line"
                    }`}
                    {...register("status")}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">
                    {uomValue === "ZERO"
                      ? "Current Value (lower is better)"
                      : "Current Value"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={uomValue === "TIMELINE"}
                    className="w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none disabled:bg-surface-2"
                    {...register("currentValue", { valueAsNumber: true })}
                  />
                  {requiresCurrentValue && !hasCurrentValue && (
                    <p className="text-xs text-danger-500">
                      Enter the latest metric to compute progress.
                    </p>
                  )}
                </div>
              </div>

              {uomValue === "TIMELINE" && (
                <p className="text-xs text-ink-2">
                  Timeline goals use the start and due dates to compute
                  progress.
                </p>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">
                  Comments & Context
                </label>
                <textarea
                  placeholder="What specifically changed? Share wins or major steps."
                  rows={3}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none resize-none ${
                    errors.comments ? "border-danger-500" : "border-line"
                  }`}
                  {...register("comments")}
                />
                {errors.comments && (
                  <p className="text-xs text-danger-500">
                    {errors.comments.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">
                  Current Blockers (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Need help from design team..."
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none"
                  {...register("blockers")}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-line">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-ink-2 hover:bg-surface-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    mutation.isPending ||
                    isSubmitting ||
                    !isWithinWindow ||
                    (requiresCurrentValue && !hasCurrentValue)
                  }
                  className="px-6 py-2 rounded-xl bg-accent text-sm font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-accent-3 transition-colors disabled:opacity-70"
                >
                  {mutation.isPending ? "Submitting..." : "Submit Check-in"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
