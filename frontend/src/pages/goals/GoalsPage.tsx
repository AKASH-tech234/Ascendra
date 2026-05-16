import { useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card } from "../../components/ui/card";
import { StatCard } from "../../components/ui/stat-card";
import { GoalCard, GoalCardSkeleton } from "../../components/ui/goal-card";
import { buttonStyles } from "../../components/ui/button";
import { useGoals } from "../../features/goals/hooks";
import { useAuthStore } from "../../features/auth/store";
import type { Goal, GoalStatus } from "../../features/goals/types";
import {
  CreateGoalModal,
  GoalDetailDrawer,
} from "../../features/goals/components";

const statusMap: Record<
  GoalStatus,
  "On Track" | "At Risk" | "Off Track" | "Completed" | "Pending" | "Draft"
> = {
  DRAFT: "Draft",
  SUBMITTED: "Pending",
  APPROVED: "On Track",
  REJECTED: "Off Track",
  COMPLETED: "Completed",
};

export function GoalsPage() {
  const { data: goals, isLoading, isError } = useGoals();
  const role = useAuthStore((state) => state.user?.role);
  const dashboardHref =
    role === "ADMIN"
      ? "/app/admin"
      : role === "MANAGER"
        ? "/app/manager"
        : "/app/employee";

  const nav = [
    { label: "Dashboard", href: dashboardHref },
    ...(role === "MANAGER" || role === "ADMIN" ? [{ label: "Approvals", href: "/app/approvals" }] : []),
    { label: "Goals", href: "/app/goals" },
    { label: "Check-ins", href: "/app/checkins" },
  ];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const draftCount =
    goals?.filter((goal) => goal.status === "DRAFT").length || 0;
  const submittedCount =
    goals?.filter((goal) => goal.status === "SUBMITTED").length || 0;
  const approvedCount =
    goals?.filter((goal) => goal.status === "APPROVED").length || 0;

  return (
    <AppShell title="Goals" subtitle="Goal management" nav={nav} active="Goals">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total goals"
          value={goals?.length.toString() || "0"}
          helper="Q3 2026"
        />
        <StatCard
          label="Drafts"
          value={draftCount.toString()}
          helper="Not submitted"
          trend={draftCount > 0 ? "neutral" : "up"}
        />
        <StatCard
          label="Approved"
          value={approvedCount.toString()}
          helper={`${submittedCount} pending`}
          trend="up"
        />
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-ink">Goal portfolio</h3>
          <p className="text-sm text-ink-2">
            Track progress, status, and approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className={buttonStyles({ size: "sm" })}
          >
            <Plus className="h-4 w-4" />
            New goal
          </button>
        </div>
      </section>

      <section className="grid gap-4">
        {isLoading && (
          <>
            <GoalCardSkeleton />
            <GoalCardSkeleton />
            <GoalCardSkeleton />
          </>
        )}
        {isError && (
          <Card hover={false}>
            <div className="py-10 text-center text-sm text-danger-500">
              Failed to load goals. Please try again.
            </div>
          </Card>
        )}
        {goals?.map((goal, index) => (
          <GoalCard
            key={goal.id}
            title={goal.title}
            status={statusMap[goal.status]}
            progress={goal.progress}
            dueDate={goal.dueDate}
            weight={`${goal.weight}%`}
            category={goal.categoryId}
            index={index}
            onClick={() => setSelectedGoal(goal)}
          />
        ))}
        {goals?.length === 0 && !isLoading && !isError ? (
          <Card
            hover={false}
            className="flex flex-col items-center justify-center gap-2 py-10 text-center"
          >
            <p className="text-sm font-semibold text-ink">No goals yet</p>
            <p className="text-sm text-ink-2">
              Create your first goal to start the cycle.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className={buttonStyles({ size: "sm" })}
            >
              Create goal
            </button>
          </Card>
        ) : null}
      </section>

      <CreateGoalModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <GoalDetailDrawer
        goal={selectedGoal}
        isOpen={Boolean(selectedGoal)}
        onClose={() => setSelectedGoal(null)}
      />
    </AppShell>
  );
}
