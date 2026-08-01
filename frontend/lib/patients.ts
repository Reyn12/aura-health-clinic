import type { Appointment } from "@/types/appointment";

export interface PatientSummary {
  email: string;
  name: string;
  phone: string;
  totalAppointments: number;
  lastVisit: string;
  appointments: Appointment[];
}

/**
 * Patients aren't a separate entity yet (see TODO-BACKEND.md) - the directory
 * is derived from appointment submissions, grouped by email.
 */
export function getPatientsFromAppointments(appointments: Appointment[]): PatientSummary[] {
  const byEmail = new Map<string, PatientSummary>();

  for (const appointment of appointments) {
    const key = appointment.patientEmail.toLowerCase();
    const existing = byEmail.get(key);

    if (!existing) {
      byEmail.set(key, {
        email: appointment.patientEmail,
        name: appointment.patientName,
        phone: appointment.patientPhone,
        totalAppointments: 1,
        lastVisit: appointment.date,
        appointments: [appointment],
      });
      continue;
    }

    existing.totalAppointments += 1;
    existing.appointments.push(appointment);
    if (appointment.date > existing.lastVisit) {
      existing.lastVisit = appointment.date;
      existing.name = appointment.patientName;
      existing.phone = appointment.patientPhone;
    }
  }

  return Array.from(byEmail.values()).sort((a, b) => (a.lastVisit < b.lastVisit ? 1 : -1));
}
