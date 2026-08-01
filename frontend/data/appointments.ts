import { doctors } from "@/data/doctors";
import type { Appointment } from "@/types/appointment";

function isoDateOffset(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function findDoctor(id: string) {
  const doctor = doctors.find((item) => item.id === id);
  if (!doctor) throw new Error(`Unknown seed doctor id: ${id}`);
  return doctor;
}

function seedAppointment(
  overrides: Pick<
    Appointment,
    "id" | "patientName" | "patientPhone" | "patientEmail" | "doctorId" | "time" | "status"
  > & { dateOffset: number; patientNotes?: string }
): Appointment {
  const doctor = findDoctor(overrides.doctorId);

  return {
    id: overrides.id,
    patientName: overrides.patientName,
    patientPhone: overrides.patientPhone,
    patientEmail: overrides.patientEmail,
    patientNotes: overrides.patientNotes ?? "",
    doctorId: doctor.id,
    doctorName: doctor.name,
    doctorPhotoUrl: doctor.photoUrl,
    specialtyName: doctor.specialtyName,
    date: isoDateOffset(overrides.dateOffset),
    time: overrides.time,
    consultationFee: doctor.consultationFee,
    status: overrides.status,
    createdAt: new Date().toISOString(),
  };
}

export const seedAppointments: Appointment[] = [
  seedAppointment({
    id: "apt-emma-morrison",
    patientName: "Emma Morrison",
    patientPhone: "0812 1111 2222",
    patientEmail: "emma.morrison@email.com",
    doctorId: "dr-sarah-patel",
    dateOffset: 0,
    time: "09:00",
    status: "confirmed",
    patientNotes: "Follow-up for blood pressure check.",
  }),
  seedAppointment({
    id: "apt-robert-johnson",
    patientName: "Robert Johnson",
    patientPhone: "0812 3333 4444",
    patientEmail: "robert.johnson@email.com",
    doctorId: "dr-emily-chen",
    dateOffset: 0,
    time: "09:30",
    status: "pending",
  }),
  seedAppointment({
    id: "apt-alice-kruger",
    patientName: "Alice Kruger",
    patientPhone: "0812 5555 6666",
    patientEmail: "alice.kruger@email.com",
    doctorId: "dr-james-wilson",
    dateOffset: 0,
    time: "10:15",
    status: "pending",
  }),
  seedAppointment({
    id: "apt-michael-tanaka",
    patientName: "Michael Tanaka",
    patientPhone: "0812 7777 8888",
    patientEmail: "michael.tanaka@email.com",
    doctorId: "dr-michael-tan",
    dateOffset: -1,
    time: "14:00",
    status: "completed",
  }),
  seedAppointment({
    id: "apt-olivia-santos",
    patientName: "Olivia Santos",
    patientPhone: "0812 9999 0000",
    patientEmail: "olivia.santos@email.com",
    doctorId: "dr-olivia-bennett",
    dateOffset: -2,
    time: "11:00",
    status: "completed",
  }),
  seedAppointment({
    id: "apt-daniel-wirawan",
    patientName: "Daniel Wirawan",
    patientPhone: "0812 1212 3434",
    patientEmail: "daniel.wirawan@email.com",
    doctorId: "dr-daniel-roberts",
    dateOffset: -3,
    time: "08:30",
    status: "cancelled",
  }),
  seedAppointment({
    id: "apt-siti-rahma",
    patientName: "Siti Rahma",
    patientPhone: "0812 4545 6767",
    patientEmail: "siti.rahma@email.com",
    doctorId: "dr-sarah-patel",
    dateOffset: 2,
    time: "13:00",
    status: "confirmed",
  }),
];
