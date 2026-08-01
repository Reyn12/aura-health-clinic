"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Eye, Loader2, StickyNote, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { AppointmentDetailDialog } from "@/components/dashboard/appointment-detail-dialog";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AppointmentsTable({
  appointments,
  onUpdateStatus,
  updatingId = null,
  showDate = true,
  emptyMessage = "No appointments found.",
}: {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  /** Id of the appointment currently being updated, to show a per-row spinner. */
  updatingId?: string | null;
  showDate?: boolean;
  emptyMessage?: string;
}) {
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);

  if (appointments.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Assigned Doctor</TableHead>
            {showDate && <TableHead>Date</TableHead>}
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const isUpdatingThis = updatingId === appointment.id;

            return (
            <TableRow key={appointment.id}>
              <TableCell>
                <div className="flex items-start gap-1.5">
                  <div>
                    <p className="font-medium text-foreground">{appointment.patientName}</p>
                    <p className="text-xs text-muted-foreground">{appointment.patientPhone}</p>
                  </div>
                  {appointment.patientNotes && (
                    <StickyNote
                      className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                      aria-label="Has notes for the doctor"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Image
                    src={appointment.doctorPhotoUrl}
                    alt={appointment.doctorName}
                    width={28}
                    height={28}
                    className="size-7 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-foreground">{appointment.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{appointment.specialtyName}</p>
                  </div>
                </div>
              </TableCell>
              {showDate && <TableCell>{formatDate(appointment.date)}</TableCell>}
              <TableCell>{appointment.time}</TableCell>
              <TableCell>
                <StatusBadge status={appointment.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  <Button
                    size="icon-sm"
                    variant="outline"
                    onClick={() => setViewingAppointment(appointment)}
                    aria-label="View appointment detail"
                  >
                    <Eye className="size-4" />
                  </Button>
                  {appointment.status === "pending" && (
                    <>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => onUpdateStatus(appointment.id, "confirmed")}
                        disabled={isUpdatingThis}
                        aria-label="Confirm appointment"
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                        disabled={isUpdatingThis}
                        aria-label="Cancel appointment"
                      >
                        <X className="size-4" />
                      </Button>
                    </>
                  )}
                  {appointment.status === "confirmed" && (
                    <>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => onUpdateStatus(appointment.id, "completed")}
                        disabled={isUpdatingThis}
                        aria-label="Mark as completed"
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" />
                        )}
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                        disabled={isUpdatingThis}
                        aria-label="Cancel appointment"
                      >
                        <X className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <AppointmentDetailDialog
        appointment={viewingAppointment}
        onOpenChange={(open) => !open && setViewingAppointment(null)}
        onUpdateStatus={(id, status) => {
          onUpdateStatus(id, status);
          setViewingAppointment(null);
        }}
      />
    </>
  );
}
