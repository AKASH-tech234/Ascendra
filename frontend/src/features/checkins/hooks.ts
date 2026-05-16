import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkinsApi } from "./api";
import type { CheckInInput } from "./types";
import { toast } from "sonner";
import { GOALS_KEYS } from "../goals/hooks";

export const CHECKINS_KEYS = {
  all: ["checkins"] as const,
  byGoal: (goalId: string) => ["checkins", { goalId }] as const,
};

export function useCheckIns(goalId?: string) {
  return useQuery({
    queryKey: goalId ? CHECKINS_KEYS.byGoal(goalId) : CHECKINS_KEYS.all,
    queryFn: () => checkinsApi.getCheckIns(goalId),
  });
}

export function useSubmitCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckInInput) => checkinsApi.submitCheckIn(data),
    onSuccess: (_, variables) => {
      toast.success("Check-in submitted successfully!");
      // Invalidate both checkins and goals to reflect aggregated progress safely
      queryClient.invalidateQueries({ queryKey: CHECKINS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.all });
      queryClient.invalidateQueries({ queryKey: GOALS_KEYS.detail(variables.goalId) });
    },
    onError: () => {
      toast.error("Failed to submit check-in");
    },
  });
}
