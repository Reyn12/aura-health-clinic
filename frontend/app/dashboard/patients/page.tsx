"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

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
import { useAppData } from "@/context/app-data-context";
import { getPatientsFromAppointments, type PatientSummary } from "@/lib/patients";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPatientsPage() {
  const { appointments, updateAppointmentStatus } = useAppData();
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);

  const patients = useMemo(() => getPatientsFromAppointments(appointments), [appointments]);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.toLowerCase().includes(query)
    );
  }, [patients, search]);

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
        {filteredPatients.length === 0 ? (
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
              {filteredPatients.map((patient) => (
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
              onUpdateStatus={updateAppointmentStatus}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
