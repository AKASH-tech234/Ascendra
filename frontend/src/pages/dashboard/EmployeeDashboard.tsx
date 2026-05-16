import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Users } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card } from "../../components/ui/card";
import { StatCard } from "../../components/ui/stat-card";
import { GoalCard } from "../../components/ui/goal-card";
import { GoalProgressChart } from "../../components/ui/charts";
import { Badge } from "../../components/ui/badge";
import { useGoals } from "../../features/goals/hooks";
import { CreateGoalModal } from "../../features/goals/components";
import { CheckInModal } from "../../features/checkins/components";

const nav = [
  { label: "Summary", href: "#summary" },
  { label: "My goals", href: "#goals" },
  { label: "Check-ins", href: "#checkins" },
];

const activities = [
  {
    text: "Pipeline conversion updated to 72%",
    time: "Sep 14",
    type: "update",
  },
  {
    text: "Onboarding NPS review scheduled with manager",
    time: "Sep 13",
    type: "meeting",
  },
  {
    text: "Shared goal aligned with Sales team",
    time: "Sep 10",
    type: "shared",
  },
  {
    text: "Manager approved goal: Incident response time",
    time: "Sep 8",
    type: "approval",
  },
];

export function EmployeeDashboard() {
  const { data: goals, isLoading, isError } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const onTrackCount = goals?.filter(g => g.status === "APPROVED" || g.status === "SUBMITTED").length || 0;
  
  return (
    <AppShell
      title="Employee Dashboard"
      subtitle="Employee workspace"
      nav={nav}
      active="Summary"
    >
      {/* Stats */}
      <section id="summary" className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active goals" value={goals?.length.toString() || "0"} helper={`${onTrackCount} pending/approved`} trend="up" />
        <StatCard
          label="Avg progress"
          value="78%"
          helper="Up 6% from last quarter"
          trend="up"
        />
        <StatCard label="Next check-in" value="6 days" helper="Sep 21" />
      </section>

      {/* Goals list */}
      <section id="goals" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink">My Goals</h3>
            <p className="text-sm text-ink-2">Q3 2026 cycle</p>
          </div>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent-3 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New goal
          </motion.button>
        </div>
        <div className="grid gap-3">
          {isLoading && (
            <div className="py-8 text-center text-sm text-ink-2">Loading goals...</div>
          )}
          {isError && (
             <div className="py-8 text-center text-sm text-danger-500">Failed to load goals</div>
          )}
          {goals?.map((goal, i) => (
            <GoalCard
              key={goal.id}
              title={goal.title}
              status={goal.status === "APPROVED" ? "On Track" : goal.status === "DRAFT" ? "Draft" : "At Risk"} 
              progress={goal.progress}
              dueDate={goal.targetDate}
              weight={`${goal.weight}%`}
              thrustArea={goal.department}
              index={i}
            />
          ))}
          {goals?.length === 0 && (
             <div className="rounded-xl border border-dashed border-line p-8 flex flex-col items-center justify-center text-center">
               <div className="h-10 w-10 bg-surface-2 rounded-full flex items-center justify-center mb-3 text-ink-2">
                 <Plus className="h-5 w-5" />
               </div>
               <p className="text-sm font-medium text-ink">No goals created yet</p>
               <p className="text-xs text-ink-2 mt-1">Start by creating your first quarterly objective.</p>
             </div>
          )}
        </div>
      </section>

      {/* Chart + Quick Actions */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card hover={false}>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Goal Progress by Quarter
          </div>
          <GoalProgressChart />
        </Card>
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Quick Actions
          </div>
          <div className="space-y-3">
            {[
              { icon: Plus, label: "Draft new goal", color: "bg-primary-50 text-accent", onClick: () => setIsModalOpen(true) },
              { icon: FileText, label: "Submit quarterly check-in", color: "bg-success-50 text-success-700" },
              { icon: Users, label: "Review shared goals", color: "bg-warning-50 text-warning-600" },
            ].map((action) => (
              <motion.button
                key={action.label}
                onClick={action.onClick}
                whileHover={{ x: 4 }}
                className="w-full flex items-center gap-3 rounded-xl border border-line p-3.5 text-sm font-medium text-ink hover:bg-surface-2 transition-all text-left"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color}`}>
                  <action.icon className="h-4 w-4" />
                </div>
                {action.label}
              </motion.button>
            ))}
          </div>
        </Card>
      </section>

      {/* Create Goal Modal */}
      <CreateGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Check In Modal */}
      <CheckInModal isOpen={isCheckInModalOpen} onClose={() => setIsCheckInModalOpen(false)} />

      {/* Check-ins + Activity */}
      <section id="checkins" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Check-in Draft
          </div>
          <div className="space-y-3">
            <p className="text-sm text-ink font-medium">
              Planned vs actual progress and blockers for Q3.
            </p>
            <div className="rounded-xl bg-primary-50 p-4 text-sm text-primary-700 font-medium">
              Summarize wins, risks, and next actions before Sep 21.
            </div>
            <motion.button
              onClick={() => setIsCheckInModalOpen(true)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent-3 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Start check-in
            </motion.button>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Recent Activity
          </div>
          <div className="space-y-3">
            {activities.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex items-start gap-3 text-sm"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0" />
                <div className="flex-1">
                  <span className="text-ink">{item.text}</span>
                  <Badge variant="outline" className="ml-2 text-[10px] py-0.5">
                    {item.time}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
