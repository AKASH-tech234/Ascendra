import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { SignInPage } from "./pages/auth/SignInPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { EmployeeDashboard } from "./pages/dashboard/EmployeeDashboard";
import { ManagerDashboard } from "./pages/dashboard/ManagerDashboard";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />
      <Route path="/app/employee" element={<EmployeeDashboard />} />
      <Route path="/app/manager" element={<ManagerDashboard />} />
      <Route path="/app/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
