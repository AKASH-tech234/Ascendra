import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "./api";
import type { GoalInput, GoalStatus } from "./types";
import { toast } from "sonner";

export const GOALS_KEYS = {
  all: ["goals"] as const,
  detail: (id: string) => ["goals", id] as const,
};

export function useGoals() {
  return useQuery({
    queryKey: GOALS_KEYS.all,
    queryFn: goalsApi.getGoals,
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: GOALS_KEYS.detail(id),
    queryFn: () => goalsApi.getGoalById(id),
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GoalInput) => goalsApi.createGoal(data),
    onSuccess: () => {
      toast.success("Goal created successfully");
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.all });
    },
    onError: () => {
      toast.error("Failed to create goal");
    },
  });
}

export function useUpdateGoalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: GoalStatus }) =>
      goalsApi.updateGoalStatus({ id, status }),
    onSuccess: (_, variables) => {
      toast.success(`Goal moved to ${variables.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.detail(variables.id) });
    },
  });
}
