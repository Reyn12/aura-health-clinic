import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Admin Login - Aura Health Clinic",
  description: "Sign in to the Aura Health Clinic admin portal.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt={siteConfig.name} width={36} height={36} className="size-9" />
            <span className="text-xl font-semibold text-navy">{siteConfig.name}</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Admin &amp; Staff Portal</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="text-lg font-semibold text-foreground">Sign in to your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage appointments, doctors, and patients.
          </p>

          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-medium text-navy hover:underline">
            Back to homepage
          </Link>
        </p>
      </div>
    </main>
  );
}
