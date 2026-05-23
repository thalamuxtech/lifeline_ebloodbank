"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <BackgroundBlobs />
      <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block"
        >
          <Link href="/" className="inline-flex items-center gap-2 font-display text-2xl">
            <span className="relative inline-flex h-9 w-9 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary-700/20 animate-pulseRing" />
              <Heart className="h-5 w-5 text-primary-700 fill-primary-700" />
            </span>
            LifeLine
          </Link>
          <h1 className="font-display text-5xl tracking-tight mt-10 leading-[1.05]">
            Every drop,
            <br />
            <span className="bg-gradient-to-r from-primary-700 via-rose-600 to-amber-500 bg-clip-text text-transparent">
              a lifeline.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-fg max-w-md">
            Join Nigeria&apos;s open E-blood bank. Track inventory, match donors in seconds, and save lives — built by Haleyouth Foundation.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            <Stat value="36+" label="Active donors" />
            <Stat value="8" label="Major cities" />
            <Stat value="24/7" label="Helpline" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-md"
        >
          <div className="relative">
            <div aria-hidden className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary-700/40 via-rose-500/20 to-amber-400/20 blur-xl opacity-60" />
            <div className="relative rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-soft">
              <h2 className="font-display text-3xl tracking-tight">{title}</h2>
              {subtitle && <p className="mt-2 text-sm text-muted-fg">{subtitle}</p>}
              <div className="mt-8">{children}</div>
              {footer && <div className="mt-6 text-center text-sm text-muted-fg">{footer}</div>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl text-primary-700">{value}</div>
      <div className="text-xs text-muted-fg mt-1">{label}</div>
    </div>
  );
}

function BackgroundBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary-700/15 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-rose-400/10 blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 h-[360px] w-[360px] rounded-full bg-amber-300/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
