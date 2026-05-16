import { z } from "zod";

export const GoalStatusEnum = z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "COMPLETED"]);

export const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  department: z.string().min(2, "Department is required"),
  targetDate: z.string(), // ISO date
  weight: z.number().min(1).max(100).optional(),
});

export type GoalStatus = z.infer<typeof GoalStatusEnum>;
export type GoalInput = z.infer<typeof goalSchema>;

export interface Goal {
  id: string;
  title: string;
  description?: string;
  department: string;
  status: GoalStatus;
  progress: number;
  weight: number;
  targetDate: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}
