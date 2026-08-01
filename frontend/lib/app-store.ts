import { doctors as seedDoctors } from "@/data/doctors";
import { seedAppointments } from "@/data/appointments";
import type { Doctor } from "@/types/doctor";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

/**
 * Minimal external store (localStorage-backed) for doctors/appointments,
 * consumed via `useSyncExternalStore` in `context/app-data-context.tsx`.
 * This stands in for the real backend until the Laravel API exists
 * (see TODO-BACKEND.md).
 */

const DOCTORS_STORAGE_KEY = "aura_doctors";
const APPOINTMENTS_STORAGE_KEY = "aura_appointments";

let doctors: Doctor[] = seedDoctors;
let appointments: Appointment[] = seedAppointments;
let isHydrated = false;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function loadFromStorage<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveToStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function ensureHydrated() {
  if (isHydrated || typeof window === "undefined") return;
  isHydrated = true;

  const storedDoctors = loadFromStorage<Doctor[]>(DOCTORS_STORAGE_KEY);
  const storedAppointments = loadFromStorage<Appointment[]>(APPOINTMENTS_STORAGE_KEY);
  if (storedDoctors) doctors = storedDoctors;
  if (storedAppointments) appointments = storedAppointments;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDoctorsSnapshot() {
  ensureHydrated();
  return doctors;
}

export function getAppointmentsSnapshot() {
  ensureHydrated();
  return appointments;
}

export function getServerDoctorsSnapshot() {
  return seedDoctors;
}

export function getServerAppointmentsSnapshot() {
  return seedAppointments;
}

export function addAppointment(input: Omit<Appointment, "id" | "createdAt" | "status">) {
  const appointment: Appointment = {
    ...input,
    id: `apt-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  appointments = [appointment, ...appointments];
  saveToStorage(APPOINTMENTS_STORAGE_KEY, appointments);
  notify();
  return appointment;
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  appointments = appointments.map((appointment) =>
    appointment.id === id ? { ...appointment, status } : appointment
  );
  saveToStorage(APPOINTMENTS_STORAGE_KEY, appointments);
  notify();
}

export function addDoctor(doctor: Omit<Doctor, "id">) {
  const id = `dr-${slugify(doctor.name)}-${Date.now().toString(36)}`;
  const newDoctor: Doctor = { ...doctor, id };
  doctors = [...doctors, newDoctor];
  saveToStorage(DOCTORS_STORAGE_KEY, doctors);
  notify();
  return newDoctor;
}

export function updateDoctor(id: string, updates: Partial<Omit<Doctor, "id">>) {
  doctors = doctors.map((doctor) => (doctor.id === id ? { ...doctor, ...updates } : doctor));
  saveToStorage(DOCTORS_STORAGE_KEY, doctors);
  notify();
}

export function deleteDoctor(id: string) {
  doctors = doctors.filter((doctor) => doctor.id !== id);
  saveToStorage(DOCTORS_STORAGE_KEY, doctors);
  notify();
}
