import { api } from "../../../services/axios";
import type { ApprovalRequest, ApprovalPayload } from "../types";

export const approvalsApi = {
  getPendingApprovals: async (): Promise<ApprovalRequest[]> => {
    const { data } = await api.get<ApprovalRequest[]>("/approvals?status=PENDING");
    return data;
  },

  respondToApproval: async ({ id, payload }: { id: string; payload: ApprovalPayload }): Promise<ApprovalRequest> => {
    const { data } = await api.patch<ApprovalRequest>(`/approvals/${id}`, payload);
    return data;
  },
};
