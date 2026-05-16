import { useMemo, useState } from "react";
import { FileText, Calendar } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card } from "../../components/ui/card";
import { StatCard } from "../../components/ui/stat-card";
import { Badge } from "../../components/ui/badge";
import { buttonStyles } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useCheckIns } from "../../features/checkins/hooks";
import { useGoals } from "../../features/goals/hooks";
import { useAuthStore } from "../../features/auth/store";
import { CheckInModal } from "../../features/checkins/components";

export function CheckInsPage() {
  const { data: checkins, isLoading, isError } = useCheckIns();
  const { data: goals } = useGoals();
  const role = useAuthStore((state) => state.user?.role);
  const dashboardHref =
    role === "ADMIN"
      ? "/app/admin"
      : role === "MANAGER"
        ? "/app/manager"
        : "/app/employee";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nav = [
    { label: "Dashboard", href: dashboardHref },
    ...(role === "MANAGER" || role === "ADMIN" ? [{ label: "Approvals", href: "/app/approvals" }] : []),
    { label: "Goals", href: "/app/goals" },
    { label: "Check-ins", href: "/app/checkins" },
  ];

  const goalLookup = useMemo(() => {
    const map = new Map<string, string>();
    goals?.forEach((goal) => map.set(goal.id, goal.title));
    return map;
  }, [goals]);

  const avgProgress = useMemo(() => {
    if (!checkins || checkins.length === 0) return 0;
    const total = checkins.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(total / checkins.length);
  }, [checkins]);

  return (
    <AppShell
      title="Check-ins"
      subtitle="Quarterly progress"
      nav={nav}
      active="Check-ins"
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total check-ins"
          value={checkins?.length.toString() || "0"}
          helper="This quarter"
        />
        <StatCard
          label="Average progress"
          value={`${avgProgress}%`}
          helper="Across active goals"
          trend="up"
        />
        <StatCard
          label="Next cadence"
          value="Sep 30"
          helper="Q3 final review"
        />
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-ink">Recent check-ins</h3>
          <p className="text-sm text-ink-2">
            Capture progress against approved goals.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={buttonStyles({ size: "sm" })}
        >
          <FileText className="h-4 w-4" />
          Submit check-in
        </button>
      </section>

      <section>
        <Card hover={false}>
          {isLoading && (
            <div className="divide-y divide-line px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {isError && (
            <div className="py-10 text-center text-sm text-danger-500">
              Failed to load check-ins.
            </div>
          )}
          {checkins && checkins.length > 0 ? (
            <div className="divide-y divide-line">
              {checkins.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-ink">
                      {goalLookup.get(checkin.goalId) || "Goal"}
                    </div>
                    <div className="mt-1 text-xs text-ink-2">
                      {checkin.comments}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink-2">
                    <Badge variant="outline">{checkin.progress}%</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(checkin.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {checkins && checkins.length === 0 && !isLoading && !isError ? (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-ink">No check-ins yet</p>
              <p className="text-sm text-ink-2">
                Submit your first update for this cycle.
              </p>
            </div>
          ) : null}
        </Card>
      </section>

      <CheckInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AppShell>
  );
}
