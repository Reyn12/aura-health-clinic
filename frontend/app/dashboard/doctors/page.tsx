"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DoctorFormDialog } from "@/components/dashboard/doctor-form-dialog";
import { useAppData } from "@/context/app-data-context";
import type { Doctor } from "@/types/doctor";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardDoctorsPage() {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useAppData();
  const [formOpen, setFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | undefined>(undefined);
  const [deletingDoctor, setDeletingDoctor] = useState<Doctor | null>(null);

  function handleAddClick() {
    setEditingDoctor(undefined);
    setFormOpen(true);
  }

  function handleEditClick(doctor: Doctor) {
    setEditingDoctor(doctor);
    setFormOpen(true);
  }

  function handleFormSubmit(values: Omit<Doctor, "id" | "rating" | "reviewCount">) {
    if (editingDoctor) {
      updateDoctor(editingDoctor.id, values);
    } else {
      addDoctor({ ...values, rating: 4.8, reviewCount: 0 });
    }
  }

  function handleConfirmDelete() {
    if (deletingDoctor) {
      deleteDoctor(deletingDoctor.id);
      setDeletingDoctor(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Doctors</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the doctors available for patient bookings.
          </p>
        </div>
        <Button className="gap-1.5" onClick={handleAddClick}>
          <Plus className="size-4" />
          Add Doctor
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={doctor.photoUrl}
                      alt={doctor.name}
                      width={36}
                      height={36}
                      className="size-9 rounded-full object-cover"
                    />
                    <span className="font-medium text-foreground">{doctor.name}</span>
                  </div>
                </TableCell>
                <TableCell>{doctor.specialtyName}</TableCell>
                <TableCell>{doctor.experienceYears} yrs</TableCell>
                <TableCell>{formatCurrency(doctor.consultationFee)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-navy text-navy" />
                    {doctor.rating}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleEditClick(doctor)}
                      aria-label="Edit doctor"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => setDeletingDoctor(doctor)}
                      aria-label="Delete doctor"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DoctorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        doctor={editingDoctor}
        onSubmit={handleFormSubmit}
      />

      <AlertDialog open={Boolean(deletingDoctor)} onOpenChange={(open) => !open && setDeletingDoctor(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deletingDoctor?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the doctor from the clinic roster and the patient booking flow.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
