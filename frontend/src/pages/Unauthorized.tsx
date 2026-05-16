import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { buttonStyles } from "../components/ui/button";

export function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="max-w-md space-y-4 rounded-2xl border border-line bg-surface p-8 text-center shadow-card">
        <div className="flex items-center justify-center">
          <ShieldAlert className="h-10 w-10 text-danger-500" />
        </div>
        <h1>Access restricted</h1>
        <p>
          Your account does not have permission to view this page. If you think
          this is a mistake, contact your administrator.
        </p>
        <Link to="/" className={buttonStyles({ size: "lg" })}>
          Return home
        </Link>
      </div>
    </div>
  );
}
