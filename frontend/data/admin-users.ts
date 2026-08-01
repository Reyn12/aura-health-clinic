export interface AdminUser {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff";
}

/**
 * Hardcoded demo accounts - stand-ins until the Laravel auth endpoints exist
 * (see TODO-BACKEND.md). Do not use this pattern in production.
 */
export const adminUsers: AdminUser[] = [
  {
    name: "Admin Aura",
    email: "admin@aurahealth.clinic",
    password: "admin123",
    role: "admin",
  },
  {
    name: "Staff Aura",
    email: "staff@aurahealth.clinic",
    password: "staff123",
    role: "staff",
  },
];
