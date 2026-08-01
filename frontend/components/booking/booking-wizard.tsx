"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { gooeyToast } from "goey-toast";

import { Button } from "@/components/ui/button";
import { useBookingFlow } from "@/hooks/use-booking-flow";
import { useSpecialties } from "@/hooks/use-specialties";
import { useDoctors } from "@/hooks/use-doctors";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { ApiError } from "@/lib/api-client";
import { StepIndicator } from "@/components/booking/step-indicator";
import { SpecialtyStep } from "@/components/booking/specialty-step";
import { DoctorStep } from "@/components/booking/doctor-step";
import { ScheduleStep } from "@/components/booking/schedule-step";
import { DetailsStep } from "@/components/booking/details-step";
import { BookingSummary } from "@/components/booking/booking-summary";

export function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: specialties = [], isLoading: isLoadingSpecialties } = useSpecialties();
  const { data: doctors = [], isLoading: isLoadingDoctors } = useDoctors();
  const createAppointment = useCreateAppointment();
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

  useEffect(() => {
    if (specialties.length === 0 && doctors.length === 0) return;

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
    // Only run once the reference data has loaded, to read the initial query params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialties.length, doctors.length]);

  function handleConfirm() {
    if (!isComplete || !state.doctor || !state.date || !state.time) return;

    const doctor = state.doctor;
    createAppointment.mutate(
      {
        doctorId: doctor.id,
        date: state.date as string,
        time: state.time as string,
        notes: state.patient.notes,
        patientName: state.patient.fullName,
        patientPhone: state.patient.phone,
        patientEmail: state.patient.email,
      },
      {
        onSuccess: () => {
          gooeyToast.success("Appointment requested!", {
            description: `We'll confirm your visit with ${doctor.name} shortly.`,
          });
          reset();
          router.push("/");
        },
        onError: (error) => {
          const message =
            error instanceof ApiError ? error.message : "Something went wrong. Please try again.";
          gooeyToast.error("Couldn't book appointment", { description: message });
        },
      }
    );
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
          {step === "specialty" && isLoadingSpecialties && (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading specialties...
            </div>
          )}
          {step === "specialty" && !isLoadingSpecialties && (
            <SpecialtyStep
              specialties={specialties}
              selected={state.specialty}
              onSelect={selectSpecialty}
            />
          )}
          {step === "doctor" && isLoadingDoctors && (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading doctors...
            </div>
          )}
          {step === "doctor" && !isLoadingDoctors && (
            <DoctorStep
              specialty={state.specialty}
              doctors={doctors}
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
            isSubmitting={createAppointment.isPending}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </div>
  );
}
