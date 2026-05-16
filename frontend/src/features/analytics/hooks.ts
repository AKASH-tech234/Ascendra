import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "./api";

export const ANALYTICS_KEYS = {
  admin: ["analytics", "admin"] as const,
};

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ANALYTICS_KEYS.admin,
    queryFn: analyticsApi.getAdminAnalytics,
  });
}
