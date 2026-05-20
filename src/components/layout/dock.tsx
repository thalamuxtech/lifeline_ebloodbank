"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Heart, Siren, Hospital, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/store/locale";

export function Dock() {
  const path = usePathname();
  const { t } = useLocale();
  if (path?.startsWith("/admin/")) return null;
  const items = [
    { href: "/", icon: Home, label: t.dock.home },
    { href: "/donate", icon: Heart, label: t.dock.donate },
    { href: "/request", icon: Siren, label: t.dock.request },
    { href: "/hospital", icon: Hospital, label: t.dock.hospital },
    { href: "/admin", icon: Shield, label: t.dock.admin, featured: true },
  ];
  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 22 }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40"
      aria-label="Quick navigation"
    >
      <div className="relative flex items-center gap-1 p-1.5 rounded-full bg-card/80 backdrop-blur-xl border border-border shadow-glow">
        {items.map((it) => {
          const active = path === it.href || (it.href !== "/" && path?.startsWith(it.href));
          if (it.featured) {
            return (
              <Link key={it.href} href={it.href} aria-label={it.label} className="group relative">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className={cn(
                    "ml-1 flex items-center justify-center h-12 w-12 rounded-full text-white shadow-glow transition-all",
                    active ? "bg-gradient-to-br from-amber-500 to-primary-700" : "bg-gradient-to-br from-primary-700 to-primary-900 hover:from-primary-600 hover:to-primary-800"
                  )}
                >
                  <span className="absolute inset-0 rounded-full bg-primary-700/50 animate-pulseRing" />
                  <it.icon className="h-5 w-5 relative" />
                </motion.div>
                <Tooltip label={it.label} />
              </Link>
            );
          }
          return (
            <Link key={it.href} href={it.href} aria-label={it.label} className="group relative">
              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  "flex items-center justify-center h-11 w-11 rounded-full transition-colors",
                  active ? "bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-100" : "text-muted-fg hover:text-fg hover:bg-muted"
                )}
              >
                <it.icon className="h-4 w-4" />
                {active && (
                  <motion.span layoutId="dock-dot" className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary-700" />
                )}
              </motion.div>
              <Tooltip label={it.label} />
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-fg text-bg text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {label}
    </span>
  );
}
