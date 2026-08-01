"use client";

import { useSyncExternalStore } from "react";
import { useMutation } from "@tanstack/react-query";

import { apiClient, ApiError } from "@/lib/api-client";
import {
  clearSession,
  getCurrentUserSnapshot,
  getServerCurrentUserSnapshot,
  setSession,
  subscribeToSession,
  type SessionUser,
} from "@/lib/auth";

interface AdminLoginResponse {
  token: string;
  user: SessionUser;
  role: string;
}

export function useAdminAuth() {
  const currentUser = useSyncExternalStore(
    subscribeToSession,
    getCurrentUserSnapshot,
    getServerCurrentUserSnapshot
  );

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      apiClient.post<AdminLoginResponse>("/auth/admin/login", credentials, { skipAuth: true }),
    onSuccess: (data) => {
      setSession(data.token, data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSettled: () => {
      clearSession();
    },
  });

  async function login(email: string, password: string) {
    try {
      await loginMutation.mutateAsync({ email, password });
      return { success: true as const };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Invalid email or password.";
      return { success: false as const, error: message };
    }
  }

  function logout() {
    logoutMutation.mutate();
  }

  return {
    currentUser,
    login,
    logout,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
