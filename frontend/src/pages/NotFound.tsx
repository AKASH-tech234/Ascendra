import { Link } from "react-router-dom";
import { buttonStyles } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md space-y-6 rounded-2xl border border-line bg-surface p-8 text-center shadow-card">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-2">
          404
        </div>
        <h1>Page not found</h1>
        <p>
          The page you are looking for does not exist. Head back to the landing
          page to continue.
        </p>
        <Link to="/" className={buttonStyles({ size: "lg" })}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
