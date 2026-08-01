import { Clock, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Certified doctors",
    description: "Every doctor on Aura Health is licensed and thoroughly vetted.",
  },
  {
    icon: Clock,
    title: "Easy scheduling",
    description: "Book, reschedule, or cancel appointments online in a few taps.",
  },
  {
    icon: HeartHandshake,
    title: "Patient-first care",
    description: "We take time to listen and tailor care to your needs.",
  },
  {
    icon: Sparkles,
    title: "Modern facilities",
    description: "Clean, comfortable clinics equipped with modern technology.",
  },
];

export function WhyUsSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
            Why Choose Aura Health Clinic
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            We combine experienced medical professionals with a smooth digital
            experience, so getting care never feels like a hassle.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-navy text-navy-foreground">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
