import { z } from "zod";
// unused

export const ApprovalStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export type ApprovalStatus = z.infer<typeof ApprovalStatusEnum>;

export interface ApprovalRequest {
  id: string;
  goalId: string;
  requesterId: string;
  managerId: string;
  status: ApprovalStatus;
  requestedAt: string;
  respondedAt?: string;
  comments?: string;
  // Included minimal representation for rendering tables
  goalContext?: {
    title: string;
    categoryId: string;
  };
  requesterContext?: {
    name: string;
    email: string;
  };
}

export interface ApprovalPayload {
  status: ApprovalStatus;
  comments?: string;
}

export interface ApprovalFilters {
  status?: ApprovalStatus;
  categoryId?: string;
  requester?: string;
  search?: string;
}
