import { clearToken, setToken as setApiToken, TOKEN_COOKIE } from "@/lib/api-client";

export const ADMIN_SESSION_COOKIE = TOKEN_COOKIE;
const ADMIN_USER_STORAGE_KEY = "aura_admin_user";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "admin" | "staff" | "patient";
}

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
 * Persists the Sanctum token (as the `aura_token` cookie `proxy.ts` gates
 * `/dashboard/*` on) plus the display user, after a real `/auth/*login` call.
 */
export function setSession(token: string, user: SessionUser) {
  setApiToken(token);

  currentUser = user;
  isHydrated = true;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(currentUser));
  }
  notify();
}

export function clearSession() {
  clearToken();

  currentUser = null;
  isHydrated = true;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
  }
  notify();
}

export function getCurrentUserSnapshot(): SessionUser | null {
  ensureHydrated();
  return currentUser;
}

export function getServerCurrentUserSnapshot(): SessionUser | null {
  return null;
}
