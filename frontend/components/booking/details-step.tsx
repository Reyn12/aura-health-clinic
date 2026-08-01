"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PatientDetails } from "@/types/booking";

export function DetailsStep({
  patient,
  onChange,
}: {
  patient: PatientDetails;
  onChange: (patient: Partial<PatientDetails>) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">Step 4: Your Details</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tell us a bit about you so we can confirm your appointment.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="e.g. Sarah Johnson"
            value={patient.fullName}
            onChange={(event) => onChange({ fullName: event.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. 0812 3456 7890"
            value={patient.phone}
            onChange={(event) => onChange({ phone: event.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. sarah@email.com"
            value={patient.email}
            onChange={(event) => onChange({ email: event.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="notes">Notes for the doctor (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Share your symptoms or anything the doctor should know..."
            value={patient.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
