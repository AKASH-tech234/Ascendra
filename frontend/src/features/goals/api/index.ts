import { api } from "../../../services/axios";
import type { Goal, GoalInput, GoalStatus } from "../types";

export const goalsApi = {
  getGoals: async (): Promise<Goal[]> => {
    const { data } = await api.get<Goal[]>("/goals");
    return data;
  },

  getGoalById: async (id: string): Promise<Goal> => {
    const { data } = await api.get<Goal>(`/goals/${id}`);
    return data;
  },

  createGoal: async (payload: GoalInput): Promise<Goal> => {
    const { data } = await api.post<Goal>("/goals", payload);
    return data;
  },

  updateGoal: async ({ id, payload }: { id: string; payload: Partial<GoalInput> }): Promise<Goal> => {
    const { data } = await api.patch<Goal>(`/goals/${id}`, payload);
    return data;
  },

  updateGoalStatus: async ({ id, status }: { id: string; status: GoalStatus }): Promise<Goal> => {
    const { data } = await api.patch<Goal>(`/goals/${id}/status`, { status });
    return data;
  },

  deleteGoal: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};
