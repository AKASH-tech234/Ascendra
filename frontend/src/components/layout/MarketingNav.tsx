import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { buttonStyles } from "../ui/button";

const navItems = [
  { label: "Product", href: "#product" },
  { label: "Roles", href: "#roles" },
  { label: "Security", href: "#security" },
  { label: "How it works", href: "#how-it-works" },
];

export function MarketingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary-700 text-sm font-bold text-white shadow-lg shadow-accent/20 transition-transform group-hover:scale-110">
            A
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-2">
              Ascendra
            </div>
            <div className="text-sm font-bold text-ink">GoalOS</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-ink-2 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="relative py-1 transition-colors hover:text-ink group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full rounded-full" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/auth/sign-in"
            className={buttonStyles({ variant: "ghost", size: "sm" })}
          >
            Sign in
          </Link>
          <Link
            to="/auth/sign-up"
            className={buttonStyles({ variant: "primary", size: "sm" })}
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-ink-2 hover:text-ink"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-line bg-white px-6 py-4 space-y-3"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block text-sm font-semibold text-ink-2 hover:text-ink py-2"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-line">
            <Link
              to="/auth/sign-in"
              className={buttonStyles({ variant: "ghost", size: "sm" })}
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              to="/auth/sign-up"
              className={buttonStyles({ variant: "primary", size: "sm" })}
              onClick={() => setMobileOpen(false)}
            >
              Get started
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
