import type { Specialty } from "@/types/doctor";

export const specialties: Specialty[] = [
  {
    slug: "general-practice",
    name: "General Practice",
    description: "Everyday health concerns and check-ups.",
    icon: "Stethoscope",
  },
  {
    slug: "cardiology",
    name: "Cardiology",
    description: "Heart health and cardiovascular care.",
    icon: "HeartPulse",
  },
  {
    slug: "dentistry",
    name: "Dentistry",
    description: "Dental care for the whole family.",
    icon: "Smile",
  },
  {
    slug: "optometry",
    name: "Optometry",
    description: "Eye exams and vision care.",
    icon: "Eye",
  },
  {
    slug: "psychiatry",
    name: "Psychiatry",
    description: "Mental health and emotional wellbeing.",
    icon: "Brain",
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    description: "Specialized care for children.",
    icon: "Baby",
  },
];
