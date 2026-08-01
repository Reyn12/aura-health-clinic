"use client";

import { useMemo, useReducer } from "react";
import type { Doctor, Specialty } from "@/types/doctor";
import {
  BOOKING_STEPS,
  initialBookingState,
  type BookingState,
  type PatientDetails,
} from "@/types/booking";

type Action =
  | { type: "SELECT_SPECIALTY"; specialty: Specialty }
  | { type: "SELECT_DOCTOR"; doctor: Doctor }
  | { type: "SELECT_SCHEDULE"; date: string; time: string }
  | { type: "UPDATE_PATIENT"; patient: Partial<PatientDetails> }
  | { type: "GO_TO_STEP"; stepIndex: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "SELECT_SPECIALTY":
      return {
        ...state,
        specialty: action.specialty,
        doctor: state.specialty?.slug === action.specialty.slug ? state.doctor : null,
      };
    case "SELECT_DOCTOR":
      return { ...state, doctor: action.doctor };
    case "SELECT_SCHEDULE":
      return { ...state, date: action.date, time: action.time };
    case "UPDATE_PATIENT":
      return { ...state, patient: { ...state.patient, ...action.patient } };
    case "GO_TO_STEP":
      return { ...state, stepIndex: action.stepIndex };
    case "NEXT_STEP":
      return {
        ...state,
        stepIndex: Math.min(state.stepIndex + 1, BOOKING_STEPS.length - 1),
      };
    case "PREV_STEP":
      return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
    case "RESET":
      return initialBookingState;
    default:
      return state;
  }
}

export function useBookingFlow() {
  const [state, dispatch] = useReducer(reducer, initialBookingState);

  const canGoNext = useMemo(() => {
    switch (BOOKING_STEPS[state.stepIndex]) {
      case "specialty":
        return Boolean(state.specialty);
      case "doctor":
        return Boolean(state.doctor);
      case "schedule":
        return Boolean(state.date && state.time);
      case "details":
        return Boolean(
          state.patient.fullName.trim() &&
            state.patient.phone.trim() &&
            state.patient.email.trim()
        );
      default:
        return false;
    }
  }, [state]);

  const isComplete = useMemo(
    () =>
      Boolean(
        state.specialty &&
          state.doctor &&
          state.date &&
          state.time &&
          state.patient.fullName.trim() &&
          state.patient.phone.trim() &&
          state.patient.email.trim()
      ),
    [state]
  );

  return {
    state,
    step: BOOKING_STEPS[state.stepIndex],
    stepIndex: state.stepIndex,
    canGoNext,
    isComplete,
    selectSpecialty: (specialty: Specialty) => dispatch({ type: "SELECT_SPECIALTY", specialty }),
    selectDoctor: (doctor: Doctor) => dispatch({ type: "SELECT_DOCTOR", doctor }),
    selectSchedule: (date: string, time: string) =>
      dispatch({ type: "SELECT_SCHEDULE", date, time }),
    updatePatient: (patient: Partial<PatientDetails>) =>
      dispatch({ type: "UPDATE_PATIENT", patient }),
    goToStep: (stepIndex: number) => dispatch({ type: "GO_TO_STEP", stepIndex }),
    nextStep: () => dispatch({ type: "NEXT_STEP" }),
    prevStep: () => dispatch({ type: "PREV_STEP" }),
    reset: () => dispatch({ type: "RESET" }),
  };
}
