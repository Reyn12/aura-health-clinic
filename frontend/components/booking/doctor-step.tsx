"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Doctor, Specialty } from "@/types/doctor";

export function DoctorStep({
  specialty,
  doctors,
  selected,
  onSelect,
}: {
  specialty: Specialty | null;
  doctors: Doctor[];
  selected: Doctor | null;
  onSelect: (doctor: Doctor) => void;
}) {
  const availableDoctors = specialty
    ? doctors.filter((doctor) => doctor.specialtySlug === specialty.slug)
    : [];

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">Step 2: Select Doctor</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Available doctors for {specialty?.name ?? "your specialty"}.
      </p>

      {availableDoctors.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No doctors available for this specialty right now.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {availableDoctors.map((doctor) => {
            const isSelected = selected?.id === doctor.id;

            return (
              <Card
                key={doctor.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(doctor)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(doctor);
                  }
                }}
                className={cn(
                  "cursor-pointer flex-row items-center gap-3 p-4 transition-colors hover:bg-accent",
                  isSelected && "bg-accent ring-2 ring-navy"
                )}
              >
                <Image
                  src={doctor.photoUrl}
                  alt={doctor.name}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doctor.experienceYears} years experience
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3.5 fill-navy text-navy" />
                    <span className="font-medium text-foreground">{doctor.rating}</span>
                    <span>({doctor.reviewCount})</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
