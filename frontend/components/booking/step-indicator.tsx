import { Check } from "lucide-react";

import { BOOKING_STEPS } from "@/types/booking";
import { cn } from "@/lib/utils";

const stepLabels: Record<(typeof BOOKING_STEPS)[number], string> = {
  specialty: "Specialty",
  doctor: "Doctor",
  schedule: "Time",
  details: "Details",
};

export function StepIndicator({ currentIndex }: { currentIndex: number }) {
  return (
    <ol className="flex items-center">
      {BOOKING_STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === BOOKING_STEPS.length - 1;

        return (
          <li key={step} className={cn("flex items-center", !isLast && "flex-1")}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                  isCompleted && "bg-navy text-navy-foreground",
                  isActive && "bg-primary text-primary-foreground",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  (isActive || isCompleted) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stepLabels[step]}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full",
                  isCompleted ? "bg-navy" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
