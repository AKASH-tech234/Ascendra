import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalsApi } from "./api";
import type { ApprovalFilters, ApprovalPayload } from "./types";
import { toast } from "sonner";
import { GOALS_KEYS } from "../goals/hooks";

export const APPROVALS_KEYS = {
  pending: ["approvals", "pending"] as const,
  list: (filters: ApprovalFilters) => ["approvals", "list", filters] as const,
};

export function usePendingApprovals() {
  return useQuery({
    queryKey: APPROVALS_KEYS.pending,
    queryFn: approvalsApi.getPendingApprovals,
  });
}

export function useApprovals(filters: ApprovalFilters) {
  return useQuery({
    queryKey: APPROVALS_KEYS.list(filters),
    queryFn: () => approvalsApi.getApprovals(filters),
  });
}

export function useRespondToApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApprovalPayload }) =>
      approvalsApi.respondToApproval({ id, payload }),
    onSuccess: (_, variables) => {
      toast.success(
        `Goal ${variables.payload.status === "APPROVED" ? "approved" : "rejected"}`,
      );
      // Refresh approvals and goals since state has changed
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.all });
    },
    onError: () => {
      toast.error("Failed to update approval status");
    },
  });
}
