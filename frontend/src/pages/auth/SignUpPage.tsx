import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, User, ArrowRight, Briefcase, CheckCircle2 } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { buttonStyles } from "../../components/ui/button";

export function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-surface-2 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary-50/60 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg relative"
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
            <h2 className="text-2xl font-bold text-ink">Create your workspace</h2>
            <p className="text-sm text-ink-2 mt-1">
              Invite your team and start aligning goals in under 10 minutes
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="signup-name"
                className="text-sm font-semibold text-ink"
              >
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-2" />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="signup-email"
                className="text-sm font-semibold text-ink"
              >
                Work email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-2" />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="signup-role"
                className="text-sm font-semibold text-ink"
              >
                Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-2" />
                <select
                  id="signup-role"
                  name="role"
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none appearance-none cursor-pointer"
                >
                  <option>Employee</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="signup-password"
                className="text-sm font-semibold text-ink"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-2" />
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-4 py-3 text-sm transition-all focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={buttonStyles({ size: "lg", className: "w-full" })}
            >
              Create account
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          {/* What you get */}
          <div className="mt-6 rounded-xl bg-surface-2/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-2 mb-3">
              What you get
            </div>
            <ul className="space-y-2 text-sm text-ink-2">
              {[
                "Structured goal creation with weighting",
                "Manager approvals with audit trails",
                "Quarterly check-ins and reminders",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-ink-2 text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/auth/sign-in"
              className="font-semibold text-accent hover:text-accent-3 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Badge variant="outline" className="text-xs">
            <Lock className="h-3 w-3" />
            Enterprise-grade security by default
          </Badge>
        </div>
      </motion.div>
    </div>
  );
}
