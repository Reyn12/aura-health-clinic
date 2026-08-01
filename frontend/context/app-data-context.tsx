"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import * as appStore from "@/lib/app-store";
import type { Doctor } from "@/types/doctor";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

interface AppDataContextValue {
  doctors: Doctor[];
  appointments: Appointment[];
  addAppointment: (
    input: Omit<Appointment, "id" | "createdAt" | "status">
  ) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addDoctor: (doctor: Omit<Doctor, "id">) => Doctor;
  updateDoctor: (id: string, updates: Partial<Omit<Doctor, "id">>) => void;
  deleteDoctor: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const doctors = useSyncExternalStore(
    appStore.subscribe,
    appStore.getDoctorsSnapshot,
    appStore.getServerDoctorsSnapshot
  );
  const appointments = useSyncExternalStore(
    appStore.subscribe,
    appStore.getAppointmentsSnapshot,
    appStore.getServerAppointmentsSnapshot
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      doctors,
      appointments,
      addAppointment: appStore.addAppointment,
      updateAppointmentStatus: appStore.updateAppointmentStatus,
      addDoctor: appStore.addDoctor,
      updateDoctor: appStore.updateDoctor,
      deleteDoctor: appStore.deleteDoctor,
    }),
    [doctors, appointments]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
