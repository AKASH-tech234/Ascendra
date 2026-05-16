import { z } from "zod";

export const checkInSchema = z.object({
  goalId: z.string().min(1, "Goal is required"),
  progress: z.number().min(0).max(100),
  comments: z.string().min(10, "Please provide enough context"),
  blockers: z.string().optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

export interface CheckIn {
  id: string;
  goalId: string;
  userId: string;
  progress: number;
  comments: string;
  blockers?: string;
  createdAt: string;
}
