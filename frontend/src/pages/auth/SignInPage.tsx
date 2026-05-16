import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { buttonStyles } from "../../components/ui/button";

export function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-2 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-primary-50/60 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary-700 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">
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
        <div className="rounded-2xl border border-line bg-white p-8 shadow-xl shadow-primary-500/5">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
            <p className="text-sm text-ink-2 mt-1">
              Sign in to manage your goals and team performance
            </p>
          </div>

          {/* SSO Button */}
          <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-line bg-surface-2/50 px-4 py-3 text-sm font-semibold text-ink hover:bg-surface-2 transition-all hover:shadow-sm mb-6">
            <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none">
              <path d="M0 0h10v10H0z" fill="#F25022" />
              <path d="M11 0h10v10H11z" fill="#7FBA00" />
              <path d="M0 11h10v10H0z" fill="#00A4EF" />
              <path d="M11 11h10v10H11z" fill="#FFB900" />
            </svg>
            Continue with Azure AD
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-4 text-ink-2 font-medium">or continue with email</span>
            </div>
          </div>

          <form className="space-y-4">
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
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
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
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-ink-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-line text-accent focus:ring-accent" />
                <span>Remember me</span>
              </label>
              <a href="#" className="font-semibold text-accent hover:text-accent-3 transition-colors">
                Forgot password?
              </a>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={buttonStyles({ size: "lg", className: "w-full" })}
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
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
