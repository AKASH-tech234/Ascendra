import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateGoal } from "../hooks";
import { goalSchema } from "../types";
import type { GoalInput } from "../types";

export interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGoalModal({ isOpen, onClose }: CreateGoalModalProps) {
  const mutation = useCreateGoal();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      weight: 10,
    },
  });

  const onSubmit = (values: GoalInput) => {
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
                <label className="text-sm font-semibold text-ink">Goal Title</label>
                <input
                  type="text"
                  placeholder="Increase Q3 pipeline conversion"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                    errors.title ? "border-danger-500" : "border-line"
                  }`}
                  {...register("title")}
                />
                {errors.title && <p className="text-xs text-danger-500">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">Department</label>
                  <select
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.department ? "border-danger-500" : "border-line"
                    }`}
                    {...register("department")}
                  >
                    <option value="">Select...</option>
                    <option value="Growth">Growth</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="Design">Design</option>
                  </select>
                  {errors.department && (
                    <p className="text-xs text-danger-500">{errors.department.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">Target Date</label>
                  <input
                    type="date"
                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                      errors.targetDate ? "border-danger-500" : "border-line"
                    }`}
                    {...register("targetDate")}
                  />
                  {errors.targetDate && (
                    <p className="text-xs text-danger-500">{errors.targetDate.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">Goal Weight (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                    errors.weight ? "border-danger-500" : "border-line"
                  }`}
                  {...register("weight", { valueAsNumber: true })}
                />
                {errors.weight && <p className="text-xs text-danger-500">{errors.weight.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">Description (Optional)</label>
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
                  disabled={mutation.isPending || isSubmitting}
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
