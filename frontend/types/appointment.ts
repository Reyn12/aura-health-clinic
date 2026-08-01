export const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientNotes: string;
  doctorId: string;
  doctorName: string;
  doctorPhotoUrl: string;
  specialtyName: string;
  date: string;
  time: string;
  consultationFee: number;
  status: AppointmentStatus;
  createdAt: string;
}
