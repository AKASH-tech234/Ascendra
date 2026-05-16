import { api } from "../../../services/axios";
import type {
  ApprovalRequest,
  ApprovalPayload,
  ApprovalFilters,
} from "../types";

export const approvalsApi = {
  getApprovals: async (
    filters: ApprovalFilters = {},
  ): Promise<ApprovalRequest[]> => {
    const { status, categoryId, requester, search } = filters;
    const { data } = await api.get<ApprovalRequest[]>("/approvals", {
      params: {
        status,
        categoryId,
        requester,
        search,
      },
    });
    return data;
  },

  getPendingApprovals: async (): Promise<ApprovalRequest[]> => {
    return approvalsApi.getApprovals({ status: "PENDING" });
  },

  respondToApproval: async ({
    id,
    payload,
  }: {
    id: string;
    payload: ApprovalPayload;
  }): Promise<ApprovalRequest> => {
    const { data } = await api.patch<ApprovalRequest>(
      `/approvals/${id}`,
      payload,
    );
    return data;
  },
};
