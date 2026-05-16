import { Card } from "./card";

export type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  trend?: "up" | "down" | "neutral";
};

export function StatCard({ label, value, helper, trend }: StatCardProps) {
  return (
    <Card className="relative flex flex-col gap-3 overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent via-accent-2 to-primary-400" />
      <p className="text-sm font-semibold uppercase tracking-[0.15em] text-ink-2">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-ink">{value}</span>
        {trend && (
          <span
            className={
              trend === "up"
                ? "text-sm font-semibold text-success-600"
                : trend === "down"
                  ? "text-sm font-semibold text-danger-500"
                  : "text-sm font-semibold text-ink-2"
            }
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {helper ? <p className="text-sm text-ink-2">{helper}</p> : null}
    </Card>
  );
}
