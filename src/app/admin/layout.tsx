"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Siren, Droplet, CalendarHeart, Settings as Cog, Activity, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/donors", label: "Donors", icon: Users },
  { href: "/admin/requests", label: "Requests", icon: Siren },
  { href: "/admin/inventory", label: "Inventory", icon: Droplet },
  { href: "/admin/drives", label: "Drives", icon: CalendarHeart },
  { href: "/admin/activity", label: "Activity", icon: Activity },
  { href: "/admin/settings", label: "Settings", icon: Cog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <RoleGuard allow={["admin"]}>
    <div className="container py-8 grid lg:grid-cols-[240px_1fr] gap-8 min-h-[80vh]">
      <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
        <div className="flex items-center gap-2 mb-6 px-3">
          <Shield className="h-5 w-5 text-primary-700" />
          <div>
            <div className="font-display text-lg leading-tight">Admin</div>
            <div className="text-[11px] text-muted-fg">Manage everything</div>
          </div>
        </div>
        <nav className="space-y-1">
          {items.map((it) => {
            const active = path === it.href || (it.href !== "/admin" && path?.startsWith(it.href));
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition",
                  active
                    ? "bg-primary-700 text-white shadow-glow"
                    : "text-muted-fg hover:bg-muted hover:text-fg"
                )}
              >
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>{children}</div>
      <Toaster richColors position="top-right" />
    </div>
    </RoleGuard>
  );
}
