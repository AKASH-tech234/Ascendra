import { z } from "zod";

export const GoalStatusEnum = z.enum([
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
]);

export const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  startDate: z.string().min(1, "Start date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  targetValue: z.number().min(1, "Target value is required"),
  uom: z.string().min(1, "Unit of measure is required"),
  weight: z.number().min(1).max(100),
});

export type GoalStatus = z.infer<typeof GoalStatusEnum>;
export type GoalInput = z.infer<typeof goalSchema>;

export interface Goal {
  id: string;
  title: string;
  description?: string;
  categoryId: string;
  status: GoalStatus;
  progress: number;
  weight: number;
  startDate: string;
  dueDate: string;
  targetValue: number;
  uom: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}
