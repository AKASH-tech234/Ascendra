import { Link } from "react-router-dom";

export function MarketingFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary-700 text-sm font-bold text-white shadow-lg shadow-accent/20">
              A
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-2">
                Ascendra
              </div>
              <div className="text-sm font-bold text-ink">GoalOS</div>
            </div>
          </Link>
          <p className="text-sm text-ink-2 leading-relaxed">
            Enterprise goal clarity, approvals, and quarterly momentum in one
            secure platform.
          </p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="font-bold text-ink">Product</div>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#product">
            Overview
          </a>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#roles">
            Role experiences
          </a>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#security">
            Security
          </a>
        </div>
        <div className="space-y-3 text-sm">
          <div className="font-bold text-ink">Company</div>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#how-it-works">
            How it works
          </a>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#">
            Careers
          </a>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#">
            Contact
          </a>
        </div>
        <div className="space-y-3 text-sm">
          <div className="font-bold text-ink">Resources</div>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#">
            Security center
          </a>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#">
            Status
          </a>
          <a className="block text-ink-2 hover:text-accent transition-colors" href="#">
            Privacy
          </a>
        </div>
      </div>
      <div className="border-t border-line px-6 py-5 text-center text-xs text-ink-2">
        © 2026 Ascendra. All rights reserved.
      </div>
    </footer>
  );
}
