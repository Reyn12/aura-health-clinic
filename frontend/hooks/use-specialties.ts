"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { Specialty } from "@/types/doctor";

export const specialtiesQueryKey = ["specialties"] as const;

export function useSpecialties() {
  return useQuery({
    queryKey: specialtiesQueryKey,
    queryFn: () => apiClient.get<{ data: Specialty[] }>("/specialties", { skipAuth: true }).then((res) => res.data),
  });
}
