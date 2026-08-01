import { Suspense } from "react";
import type { Metadata } from "next";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata: Metadata = {
  title: "Book Appointment - Aura Health Clinic",
  description: "Book an appointment with a trusted doctor at Aura Health Clinic.",
};

export default function BookAppointmentPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <Suspense fallback={null}>
          <BookingWizard />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
