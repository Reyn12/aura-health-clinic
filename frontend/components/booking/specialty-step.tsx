"use client";

import { Card } from "@/components/ui/card";
import { getSpecialtyIcon } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { Specialty } from "@/types/doctor";

export function SpecialtyStep({
  specialties,
  selected,
  onSelect,
}: {
  specialties: Specialty[];
  selected: Specialty | null;
  onSelect: (specialty: Specialty) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">Step 1: Select Specialty</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose the type of care you&apos;re looking for.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {specialties.map((specialty) => {
          const Icon = getSpecialtyIcon(specialty.icon);
          const isSelected = selected?.slug === specialty.slug;

          return (
            <Card
              key={specialty.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(specialty)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(specialty);
                }
              }}
              className={cn(
                "cursor-pointer items-center gap-2 p-4 text-center transition-colors hover:bg-accent hover:ring-navy/50",
                isSelected && "bg-accent ring-2 ring-navy"
              )}
            >
              <span
                className={cn(
                  "mx-auto flex size-11 items-center justify-center rounded-xl bg-accent text-navy",
                  isSelected && "bg-navy text-navy-foreground"
                )}
              >
                <Icon className="size-5" />
              </span>
              <p className="mt-3 text-sm font-medium text-foreground">{specialty.name}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
