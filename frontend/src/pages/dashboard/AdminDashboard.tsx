import { motion } from "framer-motion";
import { Lock, UserPlus, Calendar, AlertTriangle } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card } from "../../components/ui/card";
import { StatCard } from "../../components/ui/stat-card";
import { Badge } from "../../components/ui/badge";
import {
  CompletionDoughnut,
  DepartmentBarChart,
} from "../../components/ui/charts";

const nav = [
  { label: "Summary", href: "#summary" },
  { label: "Org overview", href: "#org" },
  { label: "Governance", href: "#governance" },
];

const auditLogs = [
  {
    action: "Goal approval policy updated",
    user: "Admin",
    time: "Sep 12, 2:40 PM",
    type: "policy",
  },
  {
    action: "New manager role assigned to Priya Gupta",
    user: "Admin",
    time: "Sep 11, 10:15 AM",
    type: "role",
  },
  {
    action: "Cycle Q3 locked for edits",
    user: "System",
    time: "Sep 10, 6:00 PM",
    type: "cycle",
  },
  {
    action: "Bulk user import completed (24 users)",
    user: "Admin",
    time: "Sep 9, 3:30 PM",
    type: "import",
  },
  {
    action: "Check-in window opened for Q3",
    user: "System",
    time: "Sep 1, 12:00 AM",
    type: "cycle",
  },
];

const departmentHealth = [
  { label: "Sales", value: 86, color: "bg-accent" },
  { label: "Product", value: 79, color: "bg-warning-500" },
  { label: "Engineering", value: 91, color: "bg-success-500" },
  { label: "People Ops", value: 90, color: "bg-success-500" },
  { label: "Marketing", value: 72, color: "bg-warning-500" },
];

export function AdminDashboard() {
  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="HR and operations"
      nav={nav}
      active="Summary"
    >
      {/* Stats */}
      <section id="summary" className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Org adoption"
          value="92%"
          helper="1,284 active users"
          trend="up"
        />
        <StatCard
          label="Cycle completion"
          value="81%"
          helper="3 teams pending"
          trend="up"
        />
        <StatCard label="Total goals" value="847" helper="142 new this week" />
        <StatCard label="Audit events" value="418" helper="Last 7 days" />
      </section>

      {/* Charts row */}
      <section id="org" className="grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Goal Completion Breakdown
          </div>
          <CompletionDoughnut />
        </Card>
        <Card hover={false}>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Department Goal Completion
          </div>
          <DepartmentBarChart />
        </Card>
      </section>

      {/* Department Health */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Department Health
          </div>
          <div className="space-y-4">
            {departmentHealth.map((dept, i) => (
              <motion.div
                key={dept.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{dept.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink">{dept.value}%</span>
                    {dept.value < 75 && (
                      <AlertTriangle className="h-3.5 w-3.5 text-warning-500" />
                    )}
                  </div>
                </div>
                <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${dept.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.value}%` }}
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
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Cycle Controls
          </div>
          <div className="space-y-3">
            {[
              {
                icon: Lock,
                label: "Lock goal edits on Sep 30",
                color: "bg-danger-50 text-danger-500",
              },
              {
                icon: UserPlus,
                label: "Enable manager approvals",
                color: "bg-success-50 text-success-600",
              },
              {
                icon: Calendar,
                label: "Publish check-in schedule",
                color: "bg-primary-50 text-accent",
              },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                whileHover={{ x: 4 }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="w-full flex items-center gap-3 rounded-xl border border-line p-3.5 text-sm font-medium text-ink hover:bg-surface-2 transition-all text-left"
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color}`}
                >
                  <action.icon className="h-4 w-4" />
                </div>
                {action.label}
              </motion.button>
            ))}
          </div>
        </Card>
      </section>

      {/* Governance */}
      <section id="governance" className="grid gap-6 lg:grid-cols-2">
        <Card hover={false}>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            Audit Trail
          </div>
          <div className="space-y-0">
            {auditLogs.map((log, i) => (
              <motion.div
                key={log.action}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 py-3 border-b border-line/50 last:border-0"
              >
                <div className="mt-1.5 h-2 w-2 rounded-full bg-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-ink font-medium">{log.action}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] py-0.5">
                      {log.user}
                    </Badge>
                    <span className="text-xs text-ink-2">{log.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="text-sm font-bold uppercase tracking-[0.15em] text-ink-2 mb-4">
            User Management
          </div>
          <div className="space-y-3">
            {[
              {
                label: "24 pending invites",
                badge: "Pending",
                variant: "warning" as const,
              },
              {
                label: "8 role changes this week",
                badge: "Updated",
                variant: "info" as const,
              },
              {
                label: "3 access reviews due",
                badge: "Action needed",
                variant: "danger" as const,
              },
              {
                label: "1,284 total active users",
                badge: "Healthy",
                variant: "success" as const,
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between rounded-xl border border-line p-3.5 hover:bg-surface-2/50 transition-colors"
              >
                <span className="text-sm font-medium text-ink">
                  {item.label}
                </span>
                <Badge variant={item.variant}>{item.badge}</Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
