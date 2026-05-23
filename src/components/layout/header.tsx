"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Heart, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { useLocale } from "@/store/locale";
import { LOCALES, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const nav = [
    { href: "/donate", label: t.nav.donate },
    { href: "/request", label: t.nav.request },
    { href: "/hospital", label: t.nav.hospital },
    { href: "/about", label: t.nav.about },
  ];

  const isActive = (href: string) => path === href || (href !== "/" && path?.startsWith(href));
  const currentLang = LOCALES.find((l) => l.code === locale);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-bg/85 border-b border-border shadow-[0_1px_0_0_hsl(var(--border)/0.5)]"
          : "backdrop-blur-md bg-bg/60 border-b border-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5 font-display text-xl tracking-tight">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-900 shadow-glow">
            <span className="absolute inset-0 rounded-xl bg-primary-700/30 animate-pulseRing" />
            <Heart className="h-4 w-4 text-white fill-white relative" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-semibold">LifeLine</span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-fg mt-0.5">E-Blood Bank</span>
          </span>
        </Link>

        {/* Center nav — segmented pill */}
        <nav className="hidden md:flex items-center p-1 rounded-full border border-border bg-card/50 backdrop-blur-sm">
          {nav.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "group relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 ease-out",
                  active
                    ? "text-white"
                    : "text-muted-fg hover:text-white"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary-700 shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {!active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary-700 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 ease-out"
                  />
                )}
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Language"
              className="flex items-center gap-1.5 h-9 px-2.5 rounded-full hover:bg-muted text-sm transition-colors"
            >
              <Globe className="h-4 w-4 text-muted-fg" />
              <span className="hidden sm:inline text-xs font-medium">{currentLang?.native}</span>
              <ChevronDown className={cn("h-3 w-3 text-muted-fg transition-transform", langOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-48 rounded-2xl border border-border bg-card shadow-xl p-1.5"
                >
                  <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-fg">
                    Language
                  </div>
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLocale(l.code as Locale);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-2.5 py-2 text-sm rounded-xl hover:bg-muted flex items-center justify-between transition-colors",
                        locale === l.code && "bg-primary-50 text-primary-700 dark:bg-primary-900/30"
                      )}
                    >
                      <span>{l.native}</span>
                      <span className="text-xs text-muted-fg uppercase">{l.code}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/donate" className="hidden lg:inline-flex">
            <Button size="sm" className="shadow-glow">
              <Heart className="h-3.5 w-3.5" /> {t.hero.ctaPrimary}
            </Button>
          </Link>

          <UserMenu />

          <button
            className="md:hidden p-2 rounded-full hover:bg-muted ml-0.5"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-bg/95 backdrop-blur-xl"
          >
            <div className="container py-4 flex flex-col gap-1">
              {nav.map((n) => {
                const active = isActive(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200",
                      active
                        ? "bg-primary-700 text-white shadow-glow"
                        : "text-fg hover:bg-primary-700 hover:text-white"
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
              <Link href="/donate" onClick={() => setOpen(false)} className="mt-2">
                <Button className="w-full">
                  <Heart className="h-4 w-4" /> {t.hero.ctaPrimary}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
