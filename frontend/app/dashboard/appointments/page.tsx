"use client";

import { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { useAppData } from "@/context/app-data-context";
import { APPOINTMENT_STATUSES, type AppointmentStatus } from "@/types/appointment";

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function DashboardAppointmentsPage() {
  const { appointments, updateAppointmentStatus } = useAppData();
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");

  const filteredAppointments = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? appointments
        : appointments.filter((appointment) => appointment.status === statusFilter);

    return [...filtered].sort((a, b) => {
      if (a.date === b.date) return a.time.localeCompare(b.time);
      return a.date < b.date ? 1 : -1;
    });
  }, [appointments, statusFilter]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Appointments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and update the status of patient appointments.
          </p>
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AppointmentStatus | "all")}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {APPOINTMENT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <AppointmentsTable
          appointments={filteredAppointments}
          onUpdateStatus={updateAppointmentStatus}
          emptyMessage="No appointments match this filter."
        />
      </div>
    </div>
  );
}
