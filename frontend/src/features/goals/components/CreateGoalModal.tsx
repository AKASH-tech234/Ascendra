import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateGoal, useGoals } from "../hooks";
import { goalSchema } from "../types";
import type { GoalInput } from "../types";

export interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories = [
  { id: "growth", label: "Growth" },
  { id: "engineering", label: "Engineering" },
  { id: "sales", label: "Sales" },
  { id: "design", label: "Design" },
  { id: "customer", label: "Customer Success" },
];

const uomOptions = [
  { value: "percent", label: "Percent" },
  { value: "number", label: "Number" },
  { value: "currency", label: "Currency" },
  { value: "score", label: "Score" },
];

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  const mutation = useCreateGoal();
  const { data: goals } = useGoals();

  const activeGoals = useMemo(
    () =>
      goals?.filter(
        (goal) => goal.status !== "REJECTED" && goal.status !== "COMPLETED",
      ) ?? [],
    [goals],
  );

  const totalWeight = useMemo(
    () => activeGoals.reduce((sum, goal) => sum + (goal.weight || 0), 0),
    [activeGoals],
  );

  const remainingWeight = Math.max(0, 100 - totalWeight);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      weight: 10,
      uom: "percent",
    },
  });

  const weightValue = watch("weight") ?? 0;
  const projectedTotal =
    totalWeight + (Number.isFinite(weightValue) ? weightValue : 0);
  const projectedRemaining = Math.max(0, 100 - projectedTotal);
  const projectedOverLimit = projectedTotal > 100.01;
  const maxGoalsReached = activeGoals.length >= 8;

  const onSubmit = (values: GoalInput) => {
    if (maxGoalsReached) {
      toast.error("You can only have up to 8 active goals per cycle.");
      return;
    }

    const proposedTotal = totalWeight + values.weight;
    if (proposedTotal > 100.01) {
      toast.error(
        `Total goal weight cannot exceed 100%. You have ${remainingWeight.toFixed(1)}% remaining.`,
      );
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-surface p-6 shadow-lift"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-ink">Create New Goal</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-surface-2 transition-colors text-ink-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="Increase Q3 pipeline conversion"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                    errors.title ? "border-danger-500" : "border-line"
                  }`}
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-danger-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">
                    Category
                  </label>
                  <select
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.categoryId ? "border-danger-500" : "border-line"
                    }`}
                    {...register("categoryId")}
                  >
                    <option value="">Select...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-xs text-danger-500">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.startDate ? "border-danger-500" : "border-line"
                    }`}
                    {...register("startDate")}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-danger-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.dueDate ? "border-danger-500" : "border-line"
                    }`}
                    {...register("dueDate")}
                  />
                  {errors.dueDate && (
                    <p className="text-xs text-danger-500">
                      {errors.dueDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">
                    Target Value
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.targetValue ? "border-danger-500" : "border-line"
                    }`}
                    {...register("targetValue", { valueAsNumber: true })}
                  />
                  {errors.targetValue && (
                    <p className="text-xs text-danger-500">
                      {errors.targetValue.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">
                    Unit of Measure
                  </label>
                  <select
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.uom ? "border-danger-500" : "border-line"
                    }`}
                    {...register("uom")}
                  >
                    {uomOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.uom && (
                    <p className="text-xs text-danger-500">
                      {errors.uom.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">
                    Goal Weight (%)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.weight ? "border-danger-500" : "border-line"
                    }`}
                    {...register("weight", { valueAsNumber: true })}
                  />
                  {errors.weight && (
                    <p className="text-xs text-danger-500">
                      {errors.weight.message}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={`rounded-xl border px-4 py-3 text-xs ${
                  projectedOverLimit
                    ? "border-danger-200 bg-danger-50 text-danger-700"
                    : "border-line bg-surface-2/60 text-ink-2"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Current total weight</span>
                  <span className="font-semibold text-ink">
                    {totalWeight.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span>After this goal</span>
                  <span
                    className={`font-semibold ${
                      projectedOverLimit ? "text-danger-600" : "text-ink"
                    }`}
                  >
                    {projectedTotal.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-1">
                  Remaining: {projectedRemaining.toFixed(1)}% (target 100%)
                </div>
                {maxGoalsReached && (
                  <div className="mt-2 font-semibold text-danger-600">
                    Max 8 active goals per cycle reached.
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Add qualitative targets or context..."
                  rows={3}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none resize-none"
                  {...register("description")}
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
                    maxGoalsReached ||
                    projectedOverLimit
                  }
                  className="px-6 py-2 rounded-xl bg-accent text-sm font-semibold text-white shadow-lg shadow-primary-500/20 hover:bg-accent-3 transition-colors disabled:opacity-70"
                >
                  {mutation.isPending ? "Creating..." : "Create Goal"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
