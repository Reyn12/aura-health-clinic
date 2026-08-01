import Link from "next/link";

import { specialties } from "@/data/specialties";
import { getSpecialtyIcon } from "@/lib/icon-map";

export function SpecialtiesSection() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          Our Services
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Choose from our range of specialties, all staffed by experienced,
          certified doctors ready to help.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {specialties.map((specialty) => {
          const Icon = getSpecialtyIcon(specialty.icon);
          return (
            <Link
              key={specialty.slug}
              href={`/book-appointment?specialty=${specialty.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-colors hover:border-navy/40 hover:bg-accent"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-navy group-hover:bg-navy group-hover:text-navy-foreground">
                <Icon className="size-6" />
              </span>
              <span className="text-sm font-medium text-foreground">{specialty.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
