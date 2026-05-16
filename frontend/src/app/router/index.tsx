import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryProvider } from "../providers/query-provider";
import {
  ProtectedRoute,
  RoleGuard,
  AuthInitializer,
} from "../../features/auth/components";

// Lazy-loaded Pages
const LandingPage = lazy(() =>
  import("../../pages/LandingPage").then((mod) => ({
    default: mod.LandingPage,
  })),
);
const SignInPage = lazy(() =>
  import("../../pages/auth/SignInPage").then((mod) => ({
    default: mod.SignInPage,
  })),
);
const SignUpPage = lazy(() =>
  import("../../pages/auth/SignUpPage").then((mod) => ({
    default: mod.SignUpPage,
  })),
);
const UnauthorizedPage = lazy(() =>
  import("../../pages/Unauthorized").then((mod) => ({
    default: mod.Unauthorized,
  })),
);

const EmployeeDashboard = lazy(() =>
  import("../../pages/dashboard/EmployeeDashboard").then((mod) => ({
    default: mod.EmployeeDashboard,
  })),
);
const ManagerDashboard = lazy(() =>
  import("../../pages/dashboard/ManagerDashboard").then((mod) => ({
    default: mod.ManagerDashboard,
  })),
);
const AdminDashboard = lazy(() =>
  import("../../pages/dashboard/AdminDashboard").then((mod) => ({
    default: mod.AdminDashboard,
  })),
);
const GoalsPage = lazy(() =>
  import("../../pages/goals/GoalsPage").then((mod) => ({
    default: mod.GoalsPage,
  })),
);
const ApprovalsPage = lazy(() =>
  import("../../pages/approvals/ApprovalsPage").then((mod) => ({
    default: mod.ApprovalsPage,
  })),
);
const CheckInsPage = lazy(() =>
  import("../../pages/checkins/CheckInsPage").then((mod) => ({
    default: mod.CheckInsPage,
  })),
);

// A simple loading fallback for Suspense
function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-2 border-t-accent" />
        <div className="text-sm font-semibold text-ink-2 tracking-widest uppercase">
          Loading
        </div>
      </div>
    </div>
  );
}

export function AppRouter() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/sign-in" element={<SignInPage />} />
            <Route path="/auth/sign-up" element={<SignUpPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route
              element={
                <AuthInitializer>
                  <ProtectedRoute />
                </AuthInitializer>
              }
            >
              {/* Role-specific Dashboard Routes */}
              <Route
                path="/app/employee"
                element={
                  <RoleGuard allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                    <EmployeeDashboard />
                  </RoleGuard>
                }
              />

              <Route
                path="/app/manager"
                element={
                  <RoleGuard allowedRoles={["MANAGER", "ADMIN"]}>
                    <ManagerDashboard />
                  </RoleGuard>
                }
              />

              <Route
                path="/app/admin"
                element={
                  <RoleGuard allowedRoles={["ADMIN"]}>
                    <AdminDashboard />
                  </RoleGuard>
                }
              />

              <Route
                path="/app/goals"
                element={
                  <RoleGuard allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                    <GoalsPage />
                  </RoleGuard>
                }
              />

              <Route
                path="/app/approvals"
                element={
                  <RoleGuard allowedRoles={["MANAGER", "ADMIN"]}>
                    <ApprovalsPage />
                  </RoleGuard>
                }
              />

              <Route
                path="/app/checkins"
                element={
                  <RoleGuard allowedRoles={["EMPLOYEE", "MANAGER", "ADMIN"]}>
                    <CheckInsPage />
                  </RoleGuard>
                }
              />

              {/* Catch-all redirect for authenticated users */}
              <Route
                path="/app/*"
                element={<Navigate to="/app/employee" replace />}
              />
            </Route>

            {/* Unknown Route Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        {/* Global Toast System */}
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryProvider>
  );
}
