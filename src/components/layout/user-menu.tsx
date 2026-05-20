"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, LayoutDashboard, User as UserIcon, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" aria-hidden />;
  }

  if (!user) {
    return (
      <Link href="/sign-in" className="hidden sm:inline-flex">
        <Button size="sm" variant="secondary">Sign in</Button>
      </Link>
    );
  }

  const initials = (profile?.displayName || user.displayName || user.email || "U")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full pl-1 pr-3 h-9 border border-border bg-card hover:bg-muted transition"
      >
        <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-700 to-rose-500 text-white text-xs font-semibold">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            initials
          )}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-fg transition", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-64 rounded-2xl border border-border bg-card shadow-soft p-2 z-50"
          >
            <div className="px-3 py-2.5 border-b border-border mb-1">
              <div className="font-medium text-sm truncate">
                {profile?.displayName || user.displayName || "Account"}
              </div>
              <div className="text-xs text-muted-fg truncate">{user.email}</div>
              {profile?.role && (
                <span className="mt-1.5 inline-block text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-primary-700/10 text-primary-700">
                  {profile.role}
                </span>
              )}
            </div>
            <MenuItem href="/account" icon={<UserIcon className="h-4 w-4" />} onSelect={() => setOpen(false)}>
              My account
            </MenuItem>
            {profile?.role === "admin" && (
              <MenuItem
                href="/admin"
                icon={<LayoutDashboard className="h-4 w-4" />}
                onSelect={() => setOpen(false)}
              >
                Admin dashboard
              </MenuItem>
            )}
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
                router.push("/");
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-muted text-danger"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  href,
  icon,
  onSelect,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-muted"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
