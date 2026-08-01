"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

export interface CreateAppointmentInput {
  doctorId: string;
  date: string;
  time: string;
  notes?: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAppointmentInput) =>
      apiClient.post<{ data: Appointment }>("/appointments", input, { skipAuth: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}

export interface AdminAppointmentsFilters {
  status?: AppointmentStatus | "all";
  date?: string;
}

export function useAdminAppointments(filters: AdminAppointmentsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== "all") params.set("status", filters.status);
  if (filters.date) params.set("date", filters.date);
  const query = params.toString();

  return useQuery({
    queryKey: ["admin-appointments", filters.status ?? "all", filters.date ?? "any"] as const,
    queryFn: () =>
      apiClient
        .get<{ data: Appointment[] }>(`/admin/appointments${query ? `?${query}` : ""}`)
        .then((res) => res.data),
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      apiClient.patch<{ data: Appointment }>(`/admin/appointments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-patients"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}
