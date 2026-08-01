"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, LayoutDashboard, LogOut, Stethoscope, Users } from "lucide-react";

import { useAdminAuth } from "@/hooks/use-admin-auth";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/dashboard/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/dashboard/patients", label: "Patients", icon: Users },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAdminAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-5 py-5">
        <Image src="/logo.png" alt={siteConfig.name} width={32} height={32} className="size-8" />
        <div>
          <p className="text-sm font-semibold text-navy">Admin Portal</p>
          <p className="text-xs text-muted-foreground">Clinic Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-navy",
                isActive && "bg-navy text-navy-foreground hover:bg-navy hover:text-navy-foreground"
              )}
            >
              <item.icon className="size-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-navy">
            {currentUser?.name?.charAt(0) ?? "A"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {currentUser?.name ?? "Admin"}
            </p>
            <p className="truncate text-xs capitalize text-muted-foreground">
              {currentUser?.role ?? "admin"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
