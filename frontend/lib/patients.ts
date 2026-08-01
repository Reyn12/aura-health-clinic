import type { Appointment } from "@/types/appointment";

export interface PatientSummary {
  email: string;
  name: string;
  phone: string;
  totalAppointments: number;
  lastVisit: string;
  appointments: Appointment[];
}
