"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Globe, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { useLocale } from "@/store/locale";
import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const nav = [
    { href: "/donate", label: t.nav.donate },
    { href: "/request", label: t.nav.request },
    { href: "/hospital", label: t.nav.hospital },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-bg/70 border-b border-border"
    >
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-tight">
          <span className="relative inline-flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary-700/20 animate-pulseRing" />
            <Heart className="h-5 w-5 text-primary-700 fill-primary-700" />
          </span>
          LifeLine
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="px-4 py-2 text-sm font-medium text-muted-fg hover:text-fg rounded-full hover:bg-muted transition"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setLangOpen(!langOpen)} aria-label="Language">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{LOCALES.find((l) => l.code === locale)?.native}</span>
            </Button>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-44 rounded-2xl border border-border bg-card shadow-soft p-1"
              >
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLocale(l.code as Locale);
                      setLangOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-xl hover:bg-muted",
                      locale === l.code && "bg-primary-50 text-primary-700 dark:bg-primary-900/30"
                    )}
                  >
                    {l.native}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <Link href="/donate" className="hidden lg:inline-flex">
            <Button size="sm">{t.hero.ctaPrimary}</Button>
          </Link>

          <UserMenu />

          <button
            className="md:hidden p-2 rounded-full hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden border-t border-border overflow-hidden"
        >
          <div className="container py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-muted text-fg"
              >
                {n.label}
              </Link>
            ))}
            <Link href="/donate" onClick={() => setOpen(false)} className="mt-2">
              <Button className="w-full">{t.hero.ctaPrimary}</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
