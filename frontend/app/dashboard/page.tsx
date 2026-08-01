"use client";

import Link from "next/link";
import { CalendarCheck, Stethoscope, Users } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { useAppData } from "@/context/app-data-context";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { getPatientsFromAppointments } from "@/lib/patients";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function DashboardOverviewPage() {
  const { doctors, appointments, updateAppointmentStatus } = useAppData();
  const { currentUser } = useAdminAuth();

  const today = todayIso();
  const todaysAppointments = appointments
    .filter((appointment) => appointment.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));
  const totalPatients = getPatientsFromAppointments(appointments).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back, {currentUser?.name ?? "Admin"}. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Today's Appointments" value={todaysAppointments.length} icon={CalendarCheck} />
        <StatCard label="Total Patients" value={totalPatients} icon={Users} />
        <StatCard label="Available Doctors" value={doctors.length} icon={Stethoscope} highlight />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Today&apos;s Appointments</h2>
          <Link href="/dashboard/appointments" className="text-sm font-medium text-navy hover:underline">
            View All
          </Link>
        </div>
        <AppointmentsTable
          appointments={todaysAppointments}
          onUpdateStatus={updateAppointmentStatus}
          showDate={false}
          emptyMessage="No appointments scheduled for today."
        />
      </div>
    </div>
  );
}
