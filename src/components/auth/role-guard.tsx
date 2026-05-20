"use client";
import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, Lock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/types";

export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname || "/")}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-primary-700/20 border-t-primary-700 animate-spin" />
        <p className="text-sm text-muted-fg">Checking access…</p>
      </div>
    );
  }

  if (!user) return null;

  if (!profile || !allow.includes(profile.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="h-14 w-14 rounded-full bg-danger/10 flex items-center justify-center mb-4">
          <ShieldAlert className="h-7 w-7 text-danger" />
        </div>
        <h2 className="font-display text-2xl">Access restricted</h2>
        <p className="text-sm text-muted-fg mt-2 max-w-sm">
          This area is only available to{" "}
          {allow.map((r, i) => (
            <span key={r}>
              <strong>{r}</strong>
              {i < allow.length - 1 ? ", " : ""}
            </span>
          ))}{" "}
          accounts. Your account is signed in as{" "}
          <strong>{profile?.role ?? "unknown"}</strong>.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/"><Button variant="secondary"><Lock className="h-4 w-4" /> Back home</Button></Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
