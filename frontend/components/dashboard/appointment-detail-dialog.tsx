"use client";

import Image from "next/image";
import { Calendar, Check, Clock, Mail, Phone, StickyNote, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AppointmentDetailDialog({
  appointment,
  onOpenChange,
  onUpdateStatus,
}: {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}) {
  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {appointment && (
          <>
            <DialogHeader>
              <DialogTitle>{appointment.patientName}</DialogTitle>
              <DialogDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3.5" />
                  {appointment.patientPhone}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="size-3.5" />
                  {appointment.patientEmail}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Image
                src={appointment.doctorPhotoUrl}
                alt={appointment.doctorName}
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {appointment.doctorName}
                </p>
                <p className="text-xs text-muted-foreground">{appointment.specialtyName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                {formatDate(appointment.date)}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4" />
                {appointment.time}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <StatusBadge status={appointment.status} />
              </div>
              <div className="text-muted-foreground">
                Fee:{" "}
                <span className="font-medium text-foreground">
                  {formatCurrency(appointment.consultationFee)}
                </span>
              </div>
            </div>

            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <StickyNote className="size-4" />
                Notes for the doctor
              </p>
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                {appointment.patientNotes || "No notes were provided by the patient."}
              </p>
            </div>

            <DialogFooter>
              {appointment.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                  >
                    <X className="size-4" />
                    Cancel
                  </Button>
                  <Button onClick={() => onUpdateStatus(appointment.id, "confirmed")}>
                    <Check className="size-4" />
                    Confirm Appointment
                  </Button>
                </>
              )}
              {appointment.status === "confirmed" && (
                <>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                  >
                    <X className="size-4" />
                    Cancel
                  </Button>
                  <Button onClick={() => onUpdateStatus(appointment.id, "completed")}>
                    <Check className="size-4" />
                    Mark as Completed
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
