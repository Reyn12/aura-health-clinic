export type SpecialtySlug =
  | "general-practice"
  | "cardiology"
  | "dentistry"
  | "optometry"
  | "psychiatry"
  | "pediatrics";

export interface Specialty {
  slug: SpecialtySlug;
  name: string;
  description: string;
  icon: string;
}

export interface DoctorSchedule {
  day: string;
  hours: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialtySlug: SpecialtySlug;
  specialtyName: string;
  photoUrl: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  consultationFee: number;
  schedule: DoctorSchedule[];
  bio: string;
}
