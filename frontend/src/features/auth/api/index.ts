import { api } from "../../../services/axios";
import type { User } from "../store";

export interface LoginPayload {
  email: string;
  password?: string; // Optional if you are just passing dummy pass for demo
}

export interface RegisterPayload {
  name: string;
  email: string;
  role: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  refresh: async (): Promise<{ token: string }> => {
    const { data } = await api.post<{ token: string }>("/auth/refresh");
    return data;
  },
};
