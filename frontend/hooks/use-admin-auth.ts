"use client";

import { useSyncExternalStore } from "react";

import { adminUsers } from "@/data/admin-users";
import {
  clearSession,
  getCurrentUserSnapshot,
  getServerCurrentUserSnapshot,
  setSession,
  subscribeToSession,
} from "@/lib/auth";

export function useAdminAuth() {
  const currentUser = useSyncExternalStore(
    subscribeToSession,
    getCurrentUserSnapshot,
    getServerCurrentUserSnapshot
  );

  function login(email: string, password: string) {
    const match = adminUsers.find(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password
    );

    if (!match) {
      return { success: false as const, error: "Invalid email or password." };
    }

    setSession(match);
    return { success: true as const };
  }

  function logout() {
    clearSession();
  }

  return { currentUser, login, logout };
}
