"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { gooeyToast } from "goey-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { useAdminAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { ApiError } from "@/lib/api-client";
import { APPOINTMENT_STATUSES, type AppointmentStatus } from "@/types/appointment";

const statusLabels: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function DashboardAppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const { data: appointments = [], isLoading } = useAdminAppointments({ status: statusFilter });
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
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading appointments...
          </div>
        ) : (
          <AppointmentsTable
            appointments={appointments}
            onUpdateStatus={handleUpdateStatus}
            updatingId={updateStatus.isPending ? updateStatus.variables?.id ?? null : null}
            emptyMessage="No appointments match this filter."
          />
        )}
      </div>
    </div>
  );
}
