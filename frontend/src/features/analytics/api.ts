import { api } from "../../services/axios";

export interface DashboardMetrics {
  adoptionTarget: number;
  activeUsers: number;
  cycleCompletion: number;
  pendingTeams: number;
  totalGoals: number;
  newGoalsWeek: number;
  auditEvents: number;
}

export interface DepartmentHealth {
  label: string;
  value: number;
  color: string;
}

export interface AuditLog {
  action: string;
  user: string;
  time: string;
  type: string;
}

export interface AnalyticsData {
  metrics: DashboardMetrics;
  departmentHealth: DepartmentHealth[];
  auditLogs: AuditLog[];
}

export const analyticsApi = {
  getAdminAnalytics: async (): Promise<AnalyticsData> => {
    const { data } = await api.get<AnalyticsData>("/analytics/admin");
    return data;
  },
};
