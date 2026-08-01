"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { gooeyToast } from "goey-toast";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { useAdminPatients } from "@/hooks/use-admin-patients";
import { useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { ApiError } from "@/lib/api-client";
import type { PatientSummary } from "@/lib/patients";
import type { AppointmentStatus } from "@/types/appointment";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPatientsPage() {
  const [search, setSearch] = useState("");
  const { data: patients = [], isLoading } = useAdminPatients(search);
  const updateStatus = useUpdateAppointmentStatus();
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Patients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Directory of patients derived from appointment bookings.
        </p>
      </div>

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, email, or phone..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No patients found.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Appointments</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient.email}
                  className="cursor-pointer"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <TableCell className="font-medium text-foreground">{patient.name}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.totalAppointments}</TableCell>
                  <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={Boolean(selectedPatient)} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPatient?.name}</DialogTitle>
            <DialogDescription>
              {selectedPatient?.email} - {selectedPatient?.phone}
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <AppointmentsTable
              appointments={selectedPatient.appointments}
              onUpdateStatus={handleUpdateStatus}
              updatingId={updateStatus.isPending ? updateStatus.variables?.id ?? null : null}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
