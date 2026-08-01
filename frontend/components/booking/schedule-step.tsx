"use client";

import { useMemo } from "react";

import { getUnavailableSlots, timeSlots } from "@/data/time-slots";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/types/doctor";

function buildUpcomingDates(count: number) {
  const dates: { iso: string; weekday: string; day: string; month: string }[] = [];
  const today = new Date();

  for (let i = 0; i < count; i += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      iso: date.toISOString().slice(0, 10),
      weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
      day: date.toLocaleDateString("en-US", { day: "2-digit" }),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    });
  }

  return dates;
}

export function ScheduleStep({
  doctor,
  date,
  time,
  onSelect,
}: {
  doctor: Doctor | null;
  date: string | null;
  time: string | null;
  onSelect: (date: string, time: string) => void;
}) {
  const upcomingDates = useMemo(() => buildUpcomingDates(14), []);
  const unavailableSlots = useMemo(
    () => (doctor && date ? getUnavailableSlots(doctor.id, date) : []),
    [doctor, date]
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">Step 3: Select Date &amp; Time</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick a date and available time slot with {doctor?.name ?? "your doctor"}.
      </p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {upcomingDates.map((item) => {
          const isSelected = date === item.iso;
          return (
            <button
              key={item.iso}
              type="button"
              onClick={() => onSelect(item.iso, isSelected ? (time ?? "") : "")}
              className={cn(
                "flex w-16 shrink-0 flex-col items-center rounded-xl border border-border px-2 py-3 text-center transition-colors hover:bg-accent",
                isSelected && "border-navy bg-navy text-navy-foreground hover:bg-navy"
              )}
            >
              <span className="text-xs font-medium uppercase opacity-80">{item.weekday}</span>
              <span className="text-lg font-semibold">{item.day}</span>
              <span className="text-xs opacity-80">{item.month}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-foreground">Available Time</p>
        {!date ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Select a date first to see available times.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {timeSlots.map((slot) => {
              const isUnavailable = unavailableSlots.includes(slot);
              const isSelected = time === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={isUnavailable}
                  onClick={() => onSelect(date, slot)}
                  className={cn(
                    "rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
                    isSelected && "border-navy bg-navy text-navy-foreground hover:bg-navy"
                  )}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
