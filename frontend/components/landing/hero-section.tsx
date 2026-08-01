import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, ShieldCheck, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Users, label: "12,000+ patients treated" },
  { icon: ShieldCheck, label: "Certified specialists" },
  { icon: CalendarCheck, label: "Same-day appointments" },
];

export function HeroSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Trusted healthcare, made simple
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-navy sm:text-5xl">
            Your health, cared for by people you can trust.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            Aura Health Clinic connects you with experienced doctors across every
            specialty. Book an appointment online in minutes, no phone calls needed.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/book-appointment" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}>
              Book Appointment
            </Link>
            <Link
              href="/#services"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-6 text-base")}
            >
              Explore Services
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-start gap-3">
                <stat.icon className="mt-0.5 size-5 shrink-0 text-navy" />
                <dd className="text-sm font-medium text-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1587351021355-a479a299d2f9?w=1000&h=1000&fit=crop&q=80"
              alt="Doctor smiling with a patient at Aura Health Clinic"
              width={1000}
              height={1000}
              className="aspect-square w-full object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-navy px-6 py-4 text-navy-foreground shadow-lg sm:block">
            <p className="text-2xl font-bold">4.9/5</p>
            <p className="text-xs text-navy-foreground/80">Average patient rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
