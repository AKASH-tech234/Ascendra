import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store";
import type { Role } from "../store";

export interface RoleGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role)) {
    // Alternatively return a generic 403 Forbidden page here
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
