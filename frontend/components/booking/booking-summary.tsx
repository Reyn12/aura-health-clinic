"use client";

import Image from "next/image";
import { CalendarDays, Stethoscope, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookingState } from "@/types/booking";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BookingSummary({
  state,
  isComplete,
  isSubmitting,
  onConfirm,
}: {
  state: BookingState;
  isComplete: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
}) {
  const { specialty, doctor, date, time } = state;
  const formattedDate = formatDate(date);

  return (
    <div className="rounded-2xl bg-navy p-6 text-navy-foreground">
      <h3 className="text-base font-semibold">Appointment Summary</h3>

      <dl className="mt-5 space-y-4 text-sm">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <dt className="flex items-center gap-2 text-navy-foreground/70">
            <Stethoscope className="size-4" />
            Specialty
          </dt>
          <dd className="text-right font-medium">
            {specialty ? specialty.name : <span className="text-navy-foreground/50">Not selected</span>}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <dt className="flex items-center gap-2 text-navy-foreground/70">
            <UserRound className="size-4" />
            Doctor
          </dt>
          <dd className="flex items-center gap-2 text-right font-medium">
            {doctor ? (
              <>
                <Image
                  src={doctor.photoUrl}
                  alt={doctor.name}
                  width={24}
                  height={24}
                  className="size-6 rounded-full object-cover"
                />
                {doctor.name}
              </>
            ) : (
              <span className="text-navy-foreground/50">Not selected</span>
            )}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <dt className="flex items-center gap-2 text-navy-foreground/70">
            <CalendarDays className="size-4" />
            Date &amp; Time
          </dt>
          <dd className="text-right font-medium">
            {formattedDate && time ? (
              <>
                {formattedDate}
                <br />
                {time}
              </>
            ) : (
              <span className="text-navy-foreground/50">Not selected</span>
            )}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-navy-foreground/70">Consultation Fee</dt>
          <dd className="text-lg font-semibold">
            {doctor ? formatCurrency(doctor.consultationFee) : "-"}
          </dd>
        </div>
      </dl>

      <Button
        className={cn(
          "mt-6 w-full h-11 bg-white text-navy hover:bg-white/90 disabled:bg-white/20 disabled:text-navy-foreground/60"
        )}
        disabled={!isComplete || isSubmitting}
        onClick={onConfirm}
      >
        {isSubmitting ? "Confirming..." : "Confirm Appointment"}
      </Button>
      {!isComplete && (
        <p className="mt-3 text-center text-xs text-navy-foreground/60">
          Please complete all steps to confirm.
        </p>
      )}
    </div>
  );
}
