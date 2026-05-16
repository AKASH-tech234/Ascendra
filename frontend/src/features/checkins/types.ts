import { z } from "zod";

export const CheckInStatusEnum = z.enum([
  "NOT_STARTED",
  "ON_TRACK",
  "AT_RISK",
  "COMPLETED",
]);

const numberOrUndefined = z.preprocess(
  (value) =>
    typeof value === "number" && Number.isNaN(value) ? undefined : value,
  z.number().min(0, "Value must be at least 0").optional(),
);

export const checkInSchema = z.object({
  goalId: z.string().min(1, "Goal is required"),
  status: CheckInStatusEnum,
  currentValue: numberOrUndefined,
  comments: z.string().min(10, "Please provide enough context"),
  blockers: z.string().optional(),
});

export type CheckInStatus = z.infer<typeof CheckInStatusEnum>;
export type CheckInInput = z.infer<typeof checkInSchema>;

export interface CheckIn {
  id: string;
  goalId: string;
  userId: string;
  status: CheckInStatus;
  currentValue?: number;
  progress: number;
  comments: string;
  blockers?: string;
  createdAt: string;
}
