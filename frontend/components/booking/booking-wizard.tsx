"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gooeyToast } from "goey-toast";

import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/use-booking-flow";
import { doctors } from "@/data/doctors";
import { specialties } from "@/data/specialties";
import { StepIndicator } from "@/components/booking/step-indicator";
import { SpecialtyStep } from "@/components/booking/specialty-step";
import { DoctorStep } from "@/components/booking/doctor-step";
import { ScheduleStep } from "@/components/booking/schedule-step";
import { DetailsStep } from "@/components/booking/details-step";
import { BookingSummary } from "@/components/booking/booking-summary";

export function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    state,
    step,
    stepIndex,
    canGoNext,
    isComplete,
    selectSpecialty,
    selectDoctor,
    selectSchedule,
    updatePatient,
    nextStep,
    prevStep,
    reset,
  } = useBookingFlow();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const specialtySlug = searchParams.get("specialty");
    const doctorId = searchParams.get("doctor");

    const preselectedSpecialty = specialties.find((item) => item.slug === specialtySlug);
    if (preselectedSpecialty) {
      selectSpecialty(preselectedSpecialty);
    }

    const preselectedDoctor = doctors.find((item) => item.id === doctorId);
    if (preselectedDoctor) {
      selectDoctor(preselectedDoctor);
    }
    // Only run once on mount to read the initial query params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleConfirm() {
    if (!isComplete) return;
    setIsSubmitting(true);

    // Backend isn't ready yet (see TODO-BACKEND.md) - simulate the request for now.
    setTimeout(() => {
      setIsSubmitting(false);
      gooeyToast.success("Appointment requested!", {
        description: `We'll confirm your visit with ${state.doctor?.name} shortly.`,
      });
      reset();
      router.push("/");
    }, 900);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Book an Appointment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Follow the steps below to schedule your visit.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-card p-5">
        <StepIndicator currentIndex={stepIndex} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card p-6">
          {step === "specialty" && (
            <SpecialtyStep selected={state.specialty} onSelect={selectSpecialty} />
          )}
          {step === "doctor" && (
            <DoctorStep
              specialty={state.specialty}
              selected={state.doctor}
              onSelect={selectDoctor}
            />
          )}
          {step === "schedule" && (
            <ScheduleStep
              doctor={state.doctor}
              date={state.date}
              time={state.time}
              onSelect={selectSchedule}
            />
          )}
          {step === "details" && (
            <DetailsStep patient={state.patient} onChange={updatePatient} />
          )}

          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={stepIndex === 0}
              className="gap-1.5"
            >
              <ChevronLeft className="size-4" />
              Back
            </Button>
            {step !== "details" && (
              <Button onClick={nextStep} disabled={!canGoNext} className="gap-1.5">
                Next
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingSummary
            state={state}
            isComplete={isComplete}
            isSubmitting={isSubmitting}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
}
