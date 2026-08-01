"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggingIn } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    const redirectTo = searchParams.get("from") ?? "/dashboard";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@aurahealth.clinic"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" className="h-11 w-full gap-2" disabled={isLoggingIn}>
        {isLoggingIn ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
        {isLoggingIn ? "Signing in..." : "Sign In"}
      </Button>

      <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Demo credentials</p>
        <p className="mt-1">admin@aurahealth.clinic / admin123</p>
        <p>staff@aurahealth.clinic / staff123</p>
      </div>
    </form>
  );
}
