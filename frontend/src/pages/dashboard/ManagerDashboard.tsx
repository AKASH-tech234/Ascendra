import { motion } from "framer-motion";
import { Check, X, MessageSquare } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card } from "../../components/ui/card";
import { StatCard } from "../../components/ui/stat-card";
import { Badge } from "../../components/ui/badge";
import { TeamProgressLineChart } from "../../components/ui/charts";
import { usePendingApprovals, useRespondToApproval } from "../../features/approvals/hooks";

const nav = [
  { label: "Summary", href: "#summary" },
  { label: "Approvals", href: "#approvals" },
  { label: "Team health", href: "#team" },
];

const teamHealth = [
  { label: "Growth team", value: 82, color: "bg-success-500" },
  { label: "Platform team", value: 68, color: "bg-warning-500" },
  { label: "Customer success", value: 76, color: "bg-accent" },
  { label: "Data team", value: 91, color: "bg-success-500" },
];

const feedback = [
  {
    text: "Reminder sent to Growth team for overdue check-in",
    time: "2 hours ago",
  },
  { text: "Approved goal update for Asha Singh", time: "Yesterday" },
  { text: "Requested revision from Daniel Cho", time: "2 days ago" },
  { text: "Check-in review completed for Q2 cycle", time: "Last week" },
];

export function ManagerDashboard() {
  const { data: approvals, isLoading, isError } = usePendingApprovals();
  const respondMutation = useRespondToApproval();

  return (
    <AppShell
      title="Manager Dashboard"
      subtitle="Team leadership"
      nav={nav}
      active="Summary"
    >
      {/* Stats */}
      <section id="summary" className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Pending approvals"
          value={approvals?.length.toString() || "0"}
          helper="Action required"
          trend={approvals && approvals.length > 0 ? "down" : "neutral"}
        />
        <StatCard
          label="Team progress"
          value="74%"
          helper="3 goals at risk"
          trend="up"
        />
        <StatCard label="Check-ins due" value="8" helper="Next on Sep 21" />
      </section>

      {/* Approvals */}
      <section id="approvals" className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-ink">Approvals Queue</h3>
          <p className="text-sm text-ink-2">Review and approve team goals</p>
        </div>
        <Card hover={false}>
          <div className="overflow-x-auto min-h-[160px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-[0.15em] text-ink-2">
                  <th className="pb-3 pr-4">Employee</th>
                  <th className="pb-3 pr-4">Goal</th>
                  <th className="pb-3 pr-4">Submitted</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-2">Loading approvals...</td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-danger-500">Failed to load approvals queue.</td>
                  </tr>
                )}
                {approvals?.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="border-b border-line/50 last:border-0 hover:bg-surface-2/50 transition-colors"
                  >
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-accent">
                          {item.requesterContext?.name
                            ?.split(" ")
                            .map((n: string) => n[0])
                            .join("") || "E"}
                        </div>
                        <span className="font-semibold text-ink">
                          {item.requesterContext?.name || "Employee"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-ink-2">
                      <div className="font-medium">{item.goalContext?.title}</div>
                      <div className="text-xs text-ink-2 mt-0.5">{item.goalContext?.department}</div>
                    </td>
                    <td className="py-3.5 pr-4 text-ink-2">
                       {new Date(item.requestedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge
                        variant={
                          item.status === "PENDING" ? "warning" : "info"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <motion.button
                          onClick={() => respondMutation.mutate({ id: item.id, payload: { status: "APPROVED" } })}
                          disabled={respondMutation.isPending}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-50 text-success-600 hover:bg-success-100 transition-colors disabled:opacity-50"
                          aria-label="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => respondMutation.mutate({ id: item.id, payload: { status: "REJECTED", comments: "Requires revision" } })}
                          disabled={respondMutation.isPending}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-50 text-danger-500 hover:bg-danger-100 transition-colors disabled:opacity-50"
                          aria-label="Reject"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-ink-2 hover:bg-primary-50 hover:text-accent transition-colors disabled:opacity-50"
                          aria-label="Comment"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {approvals?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Check className="h-8 w-8 text-success-500 mb-2 opacity-50" />
                        <span className="text-ink font-medium">All caught up!</span>
                        <span className="text-ink-2 text-xs">No pending requests right now.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Team health */}
      <section id="team" className="grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Team Progress Trend
          </div>
          <TeamProgressLineChart />
        </Card>
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Team Goal Health
          </div>
          <div className="space-y-4">
            {teamHealth.map((team, i) => (
              <motion.div
                key={team.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{team.label}</span>
                  <span className="font-bold text-ink">{team.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${team.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${team.value}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </section>

      {/* Focus + Feedback */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Focus Areas
          </div>
          <div className="space-y-3">
            {[
              "Review shared team goals",
              "Coach off-track goals",
              "Prepare check-in feedback",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className="rounded-xl border border-line bg-surface-2/50 p-3.5 text-sm font-medium text-ink cursor-pointer hover:border-accent/30 transition-all"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Recent Feedback
          </div>
          <div className="space-y-3">
            {feedback.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex items-start gap-3 text-sm"
              >
                <div className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                <div className="flex-1">
                  <span className="text-ink">{item.text}</span>
                  <span className="text-ink-2 text-xs ml-2">· {item.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
