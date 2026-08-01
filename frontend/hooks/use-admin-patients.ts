"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import type { PatientSummary } from "@/lib/patients";

export function useAdminPatients(search?: string) {
  const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";

  return useQuery({
    queryKey: ["admin-patients", search?.trim() ?? ""] as const,
    queryFn: () => apiClient.get<{ data: PatientSummary[] }>(`/admin/patients${query}`).then((res) => res.data),
  });
}
