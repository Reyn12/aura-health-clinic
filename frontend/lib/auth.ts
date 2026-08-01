import type { AdminUser } from "@/data/admin-users";

export const ADMIN_SESSION_COOKIE = "aura_admin_session";
const ADMIN_USER_STORAGE_KEY = "aura_admin_user";

export type SessionUser = Omit<AdminUser, "password">;

let currentUser: SessionUser | null = null;
let isHydrated = false;

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function readFromStorage(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(ADMIN_USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function ensureHydrated() {
  if (isHydrated || typeof window === "undefined") return;
  isHydrated = true;
  currentUser = readFromStorage();
}

export function subscribeToSession(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Client-side mock session. There's no real backend yet (see TODO-BACKEND.md),
 * so we set a plain (non-httpOnly) cookie that `proxy.ts` can read to gate
 * `/dashboard/*`, plus the user's display info in localStorage.
 */
export function setSession(user: AdminUser) {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 8}`;

  currentUser = { name: user.name, email: user.email, role: user.role };
  isHydrated = true;
  window.localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(currentUser));
  notify();
}

export function clearSession() {
  if (typeof document === "undefined") return;
  document.cookie = `${ADMIN_SESSION_COOKIE}=; path=/; max-age=0`;

  currentUser = null;
  isHydrated = true;
  window.localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
  notify();
}

export function getCurrentUserSnapshot(): SessionUser | null {
  ensureHydrated();
  return currentUser;
}

export function getServerCurrentUserSnapshot(): SessionUser | null {
  return null;
}
