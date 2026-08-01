import type { Doctor, Specialty } from "./doctor";

export const BOOKING_STEPS = ["specialty", "doctor", "schedule", "details"] as const;

export type BookingStep = (typeof BOOKING_STEPS)[number];

export interface PatientDetails {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

export interface BookingState {
  stepIndex: number;
  specialty: Specialty | null;
  doctor: Doctor | null;
  date: string | null;
  time: string | null;
  patient: PatientDetails;
}

export const emptyPatientDetails: PatientDetails = {
  fullName: "",
  phone: "",
  email: "",
  notes: "",
};

export const initialBookingState: BookingState = {
  stepIndex: 0,
  specialty: null,
  doctor: null,
  date: null,
  time: null,
  patient: emptyPatientDetails,
};
