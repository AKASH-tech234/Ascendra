import { api } from "../../../services/axios";
import type { CheckIn, CheckInInput } from "../types";

export const checkinsApi = {
  getCheckIns: async (goalId?: string): Promise<CheckIn[]> => {
    const params = goalId ? { goalId } : {};
    const { data } = await api.get<CheckIn[]>("/checkins", { params });
    return data;
  },

  submitCheckIn: async (payload: CheckInInput): Promise<CheckIn> => {
    const { data } = await api.post<CheckIn>("/checkins", payload);
    return data;
  },
};
