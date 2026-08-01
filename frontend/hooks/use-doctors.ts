"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { Doctor } from "@/types/doctor";

export const doctorsQueryKey = (specialtySlug?: string) =>
  ["doctors", specialtySlug ?? "all"] as const;

export function useDoctors(specialtySlug?: string) {
  return useQuery({
    queryKey: doctorsQueryKey(specialtySlug),
    queryFn: () =>
      apiClient
        .get<{ data: Doctor[] }>(
          specialtySlug ? `/doctors?specialty=${encodeURIComponent(specialtySlug)}` : "/doctors",
          { skipAuth: true }
        )
        .then((res) => res.data),
  });
}

export function useDoctorAvailability(doctorId?: string, date?: string) {
  return useQuery({
    queryKey: ["doctor-availability", doctorId, date] as const,
    queryFn: () =>
      apiClient
        .get<{ data: { time: string; available: boolean }[] }>(
          `/doctors/${doctorId}/availability?date=${date}`,
          { skipAuth: true }
        )
        .then((res) => res.data),
    enabled: Boolean(doctorId && date),
  });
}

type DoctorFormValues = Omit<Doctor, "id" | "rating" | "reviewCount"> & {
  rating?: number;
  reviewCount?: number;
};

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: DoctorFormValues) => apiClient.post<{ data: Doctor }>("/doctors", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: DoctorFormValues }) =>
      apiClient.put<{ data: Doctor }>(`/doctors/${id}`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/doctors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}
