import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-navy px-6 py-14 text-center sm:px-12">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-navy-foreground sm:text-4xl">
          Ready to feel better? Book your appointment today.
        </h2>
        <p className="max-w-lg text-sm text-navy-foreground/80 sm:text-base">
          It only takes a few minutes to find the right doctor and schedule a
          visit that fits your day.
        </p>
        <Link
          href="/book-appointment"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 bg-white px-8 text-base text-navy hover:bg-white/90"
          )}
        >
          Book Appointment
        </Link>
      </div>
    </section>
  );
}
