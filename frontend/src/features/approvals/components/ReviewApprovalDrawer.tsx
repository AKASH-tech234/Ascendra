import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, FileText } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { useRespondToApproval } from "../hooks";
import type { ApprovalRequest } from "../types";

export type ReviewApprovalDrawerProps = {
  approval: ApprovalRequest | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ReviewApprovalDrawer({
  approval,
  isOpen,
  onClose,
}: ReviewApprovalDrawerProps) {
  const [comments, setComments] = useState("");
  const respondMutation = useRespondToApproval();
  const isPending = approval?.status === "PENDING";

  const handleRespond = (status: "APPROVED" | "REJECTED") => {
    if (!approval) return;
    respondMutation.mutate(
      { id: approval.id, payload: { status, comments } },
      {
        onSuccess: () => {
          setComments("");
          onClose();
        },
      },
    );
  };

  // Do not unmount inner contents completely to allow exit animations, but block if no approval is given initially
  return (
    <AnimatePresence>
      {isOpen && approval && (
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
            className="fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-surface shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-2">
                  Review Request
                </div>
                <h3 className="text-xl font-bold text-ink">
                  {approval.requesterContext?.name}'s Goal
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-ink-2 transition-colors hover:bg-surface-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 px-6 py-6">
              <div className="rounded-xl border border-line bg-surface-2/60 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink-2">
                  <FileText className="h-4 w-4" />
                  Goal Details
                </div>
                <div>
                  <h4 className="font-semibold text-ink text-lg">
                    {approval.goalContext?.title}
                  </h4>
                  <div className="mt-2 flex gap-2">
                    <Badge variant="outline">
                      {approval.goalContext?.categoryId}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-ink">
                  Manager Feedback
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add constructive feedback, required for rejections..."
                  rows={4}
                  disabled={!isPending}
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none resize-none disabled:bg-surface-2"
                />
              </div>

              {!isPending ? (
                <div className="rounded-xl border border-line bg-surface-2/70 px-4 py-3 text-sm text-ink-2">
                  This request was {approval.status.toLowerCase()} on{" "}
                  {approval.respondedAt
                    ? new Date(approval.respondedAt).toLocaleDateString()
                    : "a previous review"}
                  .
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between border-t border-line px-6 py-5 bg-surface mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-ink-2 hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleRespond("REJECTED")}
                  disabled={
                    !isPending || respondMutation.isPending || !comments.trim()
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-danger-600 bg-danger-50 hover:bg-danger-100 transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => handleRespond("APPROVED")}
                  disabled={!isPending || respondMutation.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-success-500 hover:bg-success-600 shadow-lg shadow-success-500/20 transition-colors disabled:opacity-50"
                >
                  <Check className="h-4 w-4" />
                  Approve Goal
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
