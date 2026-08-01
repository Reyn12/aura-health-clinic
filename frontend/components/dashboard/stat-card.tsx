import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl border border-border bg-card p-5",
        highlight && "border-transparent bg-navy text-navy-foreground"
      )}
    >
      <div>
        <p className={cn("text-sm text-muted-foreground", highlight && "text-navy-foreground/70")}>
          {label}
        </p>
        <p className="mt-1.5 text-2xl font-bold">{value}</p>
      </div>
      <span
        className={cn(
          "flex size-11 items-center justify-center rounded-xl bg-accent text-navy",
          highlight && "bg-white/15 text-navy-foreground"
        )}
      >
        <Icon className="size-5" />
      </span>
    </div>
  );
}
