import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, ShieldCheck, X } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { usePendingApprovals } from "../../features/approvals/hooks";
import type { ApprovalRequest } from "../../features/approvals/types";
import { ReviewApprovalDrawer } from "../../features/approvals/components";
import { useAuthStore } from "../../features/auth/store";
import { Link } from "react-router-dom";

export function ApprovalsPage() {
  const { data: approvals, isLoading, isError } = usePendingApprovals();
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const role = useAuthStore((state) => state.user?.role);
  
  const dashboardHref = role === "ADMIN" ? "/app/admin" : "/app/manager";

  const nav = [
    { label: "Dashboard", href: dashboardHref },
    { label: "Approvals", href: "/app/approvals" },
    { label: "Goals", href: "/app/goals" },
  ];

  return (
    <AppShell title="Approvals" subtitle="Goal review queue" nav={nav} active="Approvals">
      <section className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-ink">Pending Requests</h3>
          <p className="text-sm text-ink-2">Review and approve team goals for the upcoming cycle.</p>
        </div>
      </section>

      <section className="grid gap-4">
        {isLoading && (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-3 mt-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        
        {isError && (
          <Card hover={false}>
            <div className="py-10 text-center text-sm text-danger-500">Failed to load approvals.</div>
          </Card>
        )}

        {approvals?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.08 }}
            onClick={() => setSelectedApproval(item)}
            className="cursor-pointer rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover group"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-accent">
                  {item.requesterContext?.name?.split(" ").map((n: string) => n[0]).join("") || "E"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{item.requesterContext?.name}</span>
                    <Badge variant={item.status === "PENDING" ? "warning" : "info"}>
                      {item.status}
                    </Badge>
                  </div>
                  <h4 className="mt-1 text-sm font-medium text-ink-2 truncate">
                    {item.goalContext?.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-3 text-xs text-ink-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Submitted {new Date(item.requestedAt).toLocaleDateString()}
                    </div>
                    {item.goalContext?.categoryId && (
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {item.goalContext.categoryId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="shrink-0 pt-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-sm font-semibold text-accent">Review &rarr;</span>
              </div>
            </div>
          </motion.div>
        ))}

        {approvals?.length === 0 && !isLoading && !isError && (
          <Card hover={false} className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-success-50 flex items-center justify-center mb-2">
              <Check className="h-6 w-6 text-success-500" />
            </div>
            <p className="text-sm font-semibold text-ink">All caught up!</p>
            <p className="text-sm text-ink-2">There are no pending approval requests.</p>
          </Card>
        )}
      </section>

      <ReviewApprovalDrawer
        approval={selectedApproval}
        isOpen={Boolean(selectedApproval)}
        onClose={() => setSelectedApproval(null)}
      />
    </AppShell>
  );
}
