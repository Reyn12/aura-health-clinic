import type { Doctor } from "@/types/doctor";

function unsplash(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=400&h=400&fit=crop&q=80`;
}

export const doctors: Doctor[] = [
  {
    id: "dr-emily-chen",
    name: "Dr. Emily Chen",
    specialtySlug: "general-practice",
    specialtyName: "General Practitioner",
    photoUrl: unsplash("1559839734-2b71ea197ec2"),
    rating: 4.9,
    reviewCount: 120,
    experienceYears: 8,
    consultationFee: 150000,
    schedule: [{ day: "Mon - Fri", hours: "09:00 - 17:00" }],
    bio: "Dr. Emily focuses on preventive care and everyday health concerns for the whole family.",
  },
  {
    id: "dr-james-wilson",
    name: "Dr. James Wilson",
    specialtySlug: "dentistry",
    specialtyName: "Dentist",
    photoUrl: unsplash("1622253692010-333f2da6031d"),
    rating: 4.8,
    reviewCount: 85,
    experienceYears: 10,
    consultationFee: 200000,
    schedule: [{ day: "Tue - Sat", hours: "10:00 - 18:00" }],
    bio: "Dr. James specializes in restorative and cosmetic dentistry with a gentle approach.",
  },
  {
    id: "dr-sarah-patel",
    name: "Dr. Sarah Patel",
    specialtySlug: "cardiology",
    specialtyName: "Cardiologist",
    photoUrl: unsplash("1537368910025-700350fe46c7"),
    rating: 5.0,
    reviewCount: 204,
    experienceYears: 14,
    consultationFee: 350000,
    schedule: [{ day: "Mon, Wed, Fri", hours: "08:00 - 14:00" }],
    bio: "Dr. Sarah is a board-certified cardiologist dedicated to keeping your heart healthy.",
  },
  {
    id: "dr-michael-tan",
    name: "Dr. Michael Tan",
    specialtySlug: "optometry",
    specialtyName: "Optometrist",
    photoUrl: unsplash("1612349317150-e413f6a5b16d"),
    rating: 4.7,
    reviewCount: 63,
    experienceYears: 6,
    consultationFee: 180000,
    schedule: [{ day: "Mon - Sat", hours: "09:00 - 16:00" }],
    bio: "Dr. Michael provides comprehensive eye exams and vision correction plans.",
  },
  {
    id: "dr-olivia-bennett",
    name: "Dr. Olivia Bennett",
    specialtySlug: "psychiatry",
    specialtyName: "Psychiatrist",
    photoUrl: unsplash("1582750433449-648ed127bb54"),
    rating: 4.9,
    reviewCount: 97,
    experienceYears: 11,
    consultationFee: 300000,
    schedule: [{ day: "Mon - Fri", hours: "11:00 - 19:00" }],
    bio: "Dr. Olivia helps patients navigate mental health with compassionate, evidence-based care.",
  },
  {
    id: "dr-daniel-roberts",
    name: "Dr. Daniel Roberts",
    specialtySlug: "pediatrics",
    specialtyName: "Pediatrician",
    photoUrl: unsplash("1594824476967-48c8b964273f"),
    rating: 4.8,
    reviewCount: 141,
    experienceYears: 9,
    consultationFee: 175000,
    schedule: [{ day: "Mon - Sat", hours: "08:00 - 15:00" }],
    bio: "Dr. Daniel provides friendly, thorough care for infants, children, and teens.",
  },
];

export function getDoctorsBySpecialty(specialtySlug: string) {
  return doctors.filter((doctor) => doctor.specialtySlug === specialtySlug);
}
