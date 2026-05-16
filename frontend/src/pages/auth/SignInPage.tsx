import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { buttonStyles } from "../../components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "../../features/auth/api";
import { useAuthStore } from "../../features/auth/store";
import type { LoginPayload } from "../../features/auth/api";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setCredentials = useAuthStore((state) => state.setCredentials);
  
  // Try to redirect back exactly where the user came from (protected route drop-off), 
  // otherwise default to the /app/employee landing
  const from = location.state?.from?.pathname || "/app/employee";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (data) => {
      setCredentials(data.user, data.token);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      // In a real app we parse the error from the backend. 
      // e.g. error.response?.data?.message || ...
      toast.error(error?.response?.data?.message || "Invalid email or password");
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-2 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-primary-50/60 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary-700 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-transform group-hover:scale-110">
              A
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-2">
                Ascendra
              </div>
              <div className="text-sm font-bold text-ink">GoalOS</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-line bg-white p-8 shadow-xl shadow-primary-500/5 relative">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
            <p className="text-sm text-ink-2 mt-1">
              Sign in to manage your goals and team performance
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="signin-email"
                className="text-sm font-semibold text-ink"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-2" />
                <input
                  id="signin-email"
                  type="email"
                  placeholder="you@company.com"
                  disabled={mutation.isPending}
                  className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                    errors.email ? "border-danger-500" : "border-line"
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-danger-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="signin-password"
                className="text-sm font-semibold text-ink"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-2" />
                <input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  disabled={mutation.isPending}
                  className={`w-full rounded-xl border bg-white pl-10 pr-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-primary-500/30 outline-none ${
                    errors.password ? "border-danger-500" : "border-line"
                  }`}
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-danger-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-ink-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-line text-accent focus:ring-accent" />
                <span>Remember me</span>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={mutation.isPending}
              whileHover={!mutation.isPending ? { scale: 1.01 } : {}}
              whileTap={!mutation.isPending ? { scale: 0.98 } : {}}
              className={buttonStyles({ size: "lg", className: "w-full disabled:opacity-70" })}
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Authenticating...
                </div>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-sm text-ink-2 text-center mt-6">
            New to Ascendra?{" "}
            <Link to="/auth/sign-up" className="font-semibold text-accent hover:text-accent-3 transition-colors">
              Create an account
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Badge variant="outline" className="text-xs">
            <Lock className="h-3 w-3" />
            Protected by enterprise-grade encryption
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}
