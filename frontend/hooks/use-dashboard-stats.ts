"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  totalDoctors: number;
  totalPatients: number;
  totalRevenue: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"] as const,
    queryFn: () => apiClient.get<{ data: DashboardStats }>("/admin/dashboard/stats").then((res) => res.data),
  });
}
