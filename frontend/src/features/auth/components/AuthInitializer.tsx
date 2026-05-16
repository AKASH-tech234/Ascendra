import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "../store";
import { authApi } from "../api";
import { api } from "../../../services/axios";

export function AuthInitializer({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (!token) {
        delete api.defaults.headers.common["Authorization"];
        setIsInitializing(false);
        return;
      }

      try {
        // Pre-configure the axios instance statically here to ensure
        // early requests don't miss the token ifzustand hydration was delayed
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        const user = await authApi.getMe();
        setUser(user);
      } catch (error) {
        // Token might be invalid/expired, and our interceptor might have failed to refresh it
        delete api.defaults.headers.common["Authorization"];
        logout();
      } finally {
        setIsInitializing(false);
      }
    }

    initAuth();
  }, [token, setUser, logout]);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-2 border-t-accent" />
          <div className="text-sm font-semibold text-ink-2 tracking-widest uppercase">
            Restoring Session
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
