"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { gooeyToast } from "goey-toast";

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
import { useDoctors, useCreateDoctor, useUpdateDoctor, useDeleteDoctor } from "@/hooks/use-doctors";
import { ApiError } from "@/lib/api-client";
import type { Doctor } from "@/types/doctor";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardDoctorsPage() {
  const { data: doctors = [], isLoading } = useDoctors();
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();

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
    const mutation = editingDoctor
      ? updateDoctor.mutateAsync({ id: editingDoctor.id, values })
      : createDoctor.mutateAsync(values);

    mutation
      .then(() => {
        gooeyToast.success(editingDoctor ? "Doctor updated." : "Doctor added.");
        setFormOpen(false);
      })
      .catch((error) => {
        const message = error instanceof ApiError ? error.message : "Something went wrong.";
        gooeyToast.error("Couldn't save doctor", { description: message });
      });
  }

  function handleConfirmDelete() {
    if (!deletingDoctor) return;
    deleteDoctor.mutate(deletingDoctor.id, {
      onSuccess: () => {
        gooeyToast.success("Doctor removed.");
        setDeletingDoctor(null);
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : "Something went wrong.";
        gooeyToast.error("Couldn't delete doctor", { description: message });
      },
    });
  }

  const isSavingForm = createDoctor.isPending || updateDoctor.isPending;

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
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading doctors...
          </div>
        ) : (
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
              {doctors.map((doctor) => {
                const isDeletingThis = deleteDoctor.isPending && deletingDoctor?.id === doctor.id;

                return (
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
                          disabled={isDeletingThis}
                          aria-label="Delete doctor"
                        >
                          {isDeletingThis ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <DoctorFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        doctor={editingDoctor}
        isSubmitting={isSavingForm}
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
            <AlertDialogCancel disabled={deleteDoctor.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20"
              onClick={handleConfirmDelete}
              disabled={deleteDoctor.isPending}
            >
              {deleteDoctor.isPending && <Loader2 className="size-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
