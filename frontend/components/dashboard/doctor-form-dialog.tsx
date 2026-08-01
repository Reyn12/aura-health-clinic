"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSpecialties } from "@/hooks/use-specialties";
import type { Doctor, Specialty, SpecialtySlug } from "@/types/doctor";

interface DoctorFormValues {
  name: string;
  specialtySlug: SpecialtySlug | "";
  photoUrl: string;
  experienceYears: string;
  consultationFee: string;
  scheduleDay: string;
  scheduleHours: string;
  bio: string;
}

function buildEmptyForm(specialties: Specialty[]): DoctorFormValues {
  return {
    name: "",
    specialtySlug: specialties[0]?.slug ?? "",
    photoUrl: "",
    experienceYears: "",
    consultationFee: "",
    scheduleDay: "Mon - Fri",
    scheduleHours: "09:00 - 17:00",
    bio: "",
  };
}

function doctorToForm(doctor: Doctor): DoctorFormValues {
  return {
    name: doctor.name,
    specialtySlug: doctor.specialtySlug,
    photoUrl: doctor.photoUrl,
    experienceYears: String(doctor.experienceYears),
    consultationFee: String(doctor.consultationFee),
    scheduleDay: doctor.schedule[0]?.day ?? "Mon - Fri",
    scheduleHours: doctor.schedule[0]?.hours ?? "09:00 - 17:00",
    bio: doctor.bio,
  };
}

export function DoctorFormDialog({
  open,
  onOpenChange,
  doctor,
  isSubmitting = false,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor;
  isSubmitting?: boolean;
  onSubmit: (values: Omit<Doctor, "id" | "rating" | "reviewCount">) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Keyed so the form's local state resets whenever a different doctor
            (or "new") is opened, instead of syncing it via an effect. */}
        {open && (
          <DoctorFormFields
            key={doctor?.id ?? "new"}
            doctor={doctor}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DoctorFormFields({
  doctor,
  isSubmitting,
  onSubmit,
  onCancel,
}: {
  doctor?: Doctor;
  isSubmitting: boolean;
  onSubmit: (values: Omit<Doctor, "id" | "rating" | "reviewCount">) => void;
  onCancel: () => void;
}) {
  const { data: specialties = [] } = useSpecialties();
  const [form, setForm] = useState<DoctorFormValues>(
    doctor ? doctorToForm(doctor) : buildEmptyForm(specialties)
  );
  const isEditing = Boolean(doctor);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const specialty =
      specialties.find((item) => item.slug === form.specialtySlug) ?? specialties[0];
    if (!specialty) return;

    onSubmit({
      name: form.name.trim(),
      specialtySlug: specialty.slug,
      specialtyName: specialty.name,
      photoUrl:
        form.photoUrl.trim() ||
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&q=80",
      experienceYears: Number(form.experienceYears) || 0,
      consultationFee: Number(form.consultationFee) || 0,
      schedule: [{ day: form.scheduleDay.trim() || "Mon - Fri", hours: form.scheduleHours.trim() || "09:00 - 17:00" }],
      bio: form.bio.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update this doctor's profile."
            : "Add a new doctor to the clinic roster."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="doctor-name">Full Name</Label>
          <Input
            id="doctor-name"
            required
            placeholder="e.g. Dr. Jane Doe"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="doctor-specialty">Specialty</Label>
          <Select
            value={form.specialtySlug}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, specialtySlug: value as SpecialtySlug }))
            }
          >
            <SelectTrigger id="doctor-specialty" className="w-full">
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty.slug} value={specialty.slug}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="doctor-experience">Experience (years)</Label>
          <Input
            id="doctor-experience"
            type="number"
            min={0}
            required
            value={form.experienceYears}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, experienceYears: event.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="doctor-fee">Consultation Fee (IDR)</Label>
          <Input
            id="doctor-fee"
            type="number"
            min={0}
            step={1000}
            required
            value={form.consultationFee}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, consultationFee: event.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="doctor-schedule-day">Working Days</Label>
          <Input
            id="doctor-schedule-day"
            placeholder="e.g. Mon - Fri"
            value={form.scheduleDay}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, scheduleDay: event.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="doctor-schedule-hours">Working Hours</Label>
          <Input
            id="doctor-schedule-hours"
            placeholder="e.g. 09:00 - 17:00"
            value={form.scheduleHours}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, scheduleHours: event.target.value }))
            }
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="doctor-photo">Photo URL (optional)</Label>
          <Input
            id="doctor-photo"
            placeholder="https://..."
            value={form.photoUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, photoUrl: event.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="doctor-bio">Bio</Label>
          <Textarea
            id="doctor-bio"
            rows={3}
            placeholder="Short description of the doctor's expertise..."
            value={form.bio}
            onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Add Doctor"}
        </Button>
      </DialogFooter>
    </form>
  );
}
