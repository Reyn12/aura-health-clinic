"use client";

import Link from "next/link";
import { CalendarCheck, Loader2, Stethoscope, Users } from "lucide-react";
import { gooeyToast } from "goey-toast";

import { StatCard } from "@/components/dashboard/stat-card";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useAdminAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { ApiError } from "@/lib/api-client";
import type { AppointmentStatus } from "@/types/appointment";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardOverviewPage() {
  const { currentUser } = useAdminAuth();
  const { data: stats } = useDashboardStats();
  const { data: todaysAppointments = [], isLoading } = useAdminAppointments({ date: todayIso() });
  const updateStatus = useUpdateAppointmentStatus();

  function handleUpdateStatus(id: string, status: AppointmentStatus) {
    updateStatus.mutate(
      { id, status },
      {
        onError: (error) => {
          const message = error instanceof ApiError ? error.message : "Something went wrong.";
          gooeyToast.error("Couldn't update appointment", { description: message });
        },
      }
    );
  }

  const sortedAppointments = [...todaysAppointments].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {currentUser?.name ?? "Admin"}. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Today's Appointments" value={stats?.todayAppointments ?? 0} icon={CalendarCheck} />
        <StatCard label="Total Patients" value={stats?.totalPatients ?? 0} icon={Users} />
        <StatCard label="Available Doctors" value={stats?.totalDoctors ?? 0} icon={Stethoscope} highlight />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Today&apos;s Appointments</h2>
          <Link href="/dashboard/appointments" className="text-sm font-medium text-navy hover:underline">
            View All
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading appointments...
          </div>
        ) : (
          <AppointmentsTable
            appointments={sortedAppointments}
            onUpdateStatus={handleUpdateStatus}
            updatingId={updateStatus.isPending ? updateStatus.variables?.id ?? null : null}
            showDate={false}
            emptyMessage="No appointments scheduled for today."
          />
        )}
      </div>
    </div>
  );
}
