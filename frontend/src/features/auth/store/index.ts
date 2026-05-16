import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "EMPLOYEE" | "MANAGER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setCredentials: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setCredentials: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "ascendra-auth",
    }
  )
);
