import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalsApi } from "./api";
import type { ApprovalPayload } from "./types";
import { toast } from "sonner";
import { GOALS_KEYS } from "../goals/hooks";

export const APPROVALS_KEYS = {
  pending: ["approvals", "pending"] as const,
};

export function usePendingApprovals() {
  return useQuery({
    queryKey: APPROVALS_KEYS.pending,
    queryFn: approvalsApi.getPendingApprovals,
  });
}

export function useRespondToApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApprovalPayload }) =>
      approvalsApi.respondToApproval({ id, payload }),
    onSuccess: (_, variables) => {
      toast.success(
        `Goal ${variables.payload.status === "APPROVED" ? "approved" : "rejected"}`
      );
      // Refresh both approvals and goals since state has changed
      queryClient.invalidateQueries({ queryKey: APPROVALS_KEYS.pending });
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.all });
    },
    onError: () => {
      toast.error("Failed to update approval status");
    },
  });
}
