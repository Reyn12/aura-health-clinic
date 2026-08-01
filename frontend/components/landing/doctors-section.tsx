"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { useAppData } from "@/context/app-data-context";
import { cn } from "@/lib/utils";

export function DoctorsSection() {
  const { doctors } = useAppData();
  const featured = doctors.slice(0, 3);

  return (
    <section id="doctors" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          Meet Our Doctors
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Highly rated specialists dedicated to your wellbeing.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((doctor) => (
          <div
            key={doctor.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={doctor.photoUrl}
                alt={doctor.name}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-base font-semibold text-foreground">{doctor.name}</h3>
              <Badge variant="secondary" className="mt-2 w-fit bg-accent text-accent-foreground">
                {doctor.specialtyName}
              </Badge>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Star className="size-4 fill-navy text-navy" />
                <span className="font-medium text-foreground">{doctor.rating}</span>
                <span>({doctor.reviewCount} reviews)</span>
              </div>
              <Link
                href={`/book-appointment?specialty=${doctor.specialtySlug}&doctor=${doctor.id}`}
                className={cn(buttonVariants({ variant: "outline" }), "mt-5 w-full")}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
