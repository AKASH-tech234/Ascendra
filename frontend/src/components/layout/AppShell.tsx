import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Target,
  ClipboardCheck,
  Users,
  Shield,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/cn";

export type NavItem = {
  label: string;
  href: string;
  icon?: React.ElementType;
};

export type AppShellProps = {
  title: string;
  subtitle: string;
  nav: NavItem[];
  active: string;
  children: ReactNode;
};

const roleNavIcons: Record<string, React.ElementType> = {
  Summary: LayoutDashboard,
  "My goals": Target,
  "Check-ins": ClipboardCheck,
  Approvals: Shield,
  "Team health": Users,
  "Org overview": Users,
  Governance: Shield,
};

export function AppShell({
  title,
  subtitle,
  nav,
  active,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isAdmin = location.pathname.includes("admin");
  const isManager = location.pathname.includes("manager");

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: collapsed ? 72 : 256 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 z-40 h-screen border-r border-line bg-white flex flex-col overflow-hidden"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-6 border-b border-line">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary-700 text-sm font-bold text-white shadow-lg shadow-accent/20">
              A
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-2">
                  Ascendra
                </div>
                <div className="text-sm font-bold text-ink">GoalOS</div>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon || roleNavIcons[item.label] || LayoutDashboard;
              const isActive = item.label === active;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-accent" : "text-ink-2 group-hover:text-ink",
                    )}
                  />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="border-t border-line px-3 py-4 space-y-1">
            <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-surface-2 hover:text-ink transition-all w-full">
              <Settings className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Settings</span>}
            </button>
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2 hover:bg-danger-50 hover:text-danger-600 transition-all"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </Link>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center border-t border-line py-3 text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </motion.aside>

        {/* Main content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            collapsed ? "ml-[72px]" : "ml-[256px]",
          )}
        >
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/80 backdrop-blur-xl px-8 py-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-2">
                {subtitle}
              </div>
              <h2 className="text-xl font-bold text-ink">{title}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink-2">
                Q3 2026
              </div>
              <button className="relative p-2 rounded-full hover:bg-surface-2 transition-colors" aria-label="Notifications">
                <Bell className="h-5 w-5 text-ink-2" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-line">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary-700 text-sm font-bold text-white">
                  AK
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-ink">Akash</div>
                  <div className="text-xs text-ink-2">
                    {isAdmin ? "Admin" : isManager ? "Manager" : "Employee"}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-8 space-y-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
