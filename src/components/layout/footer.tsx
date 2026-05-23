"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  Phone,
  MessageCircle,
  Globe,
  Shield,
  Mail,
  MapPin,
  ArrowRight,
  Check,
} from "lucide-react";
import { useLocale } from "@/store/locale";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

export function Footer() {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Enter a valid email");
      return;
    }
    setBusy(true);
    try {
      await addDoc(collection(db, "newsletter"), {
        email: trimmed,
        createdAt: serverTimestamp(),
        source: "footer",
      });
      setSubscribed(true);
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <footer className="mt-32 relative border-t border-border bg-gradient-to-b from-bg via-muted/30 to-muted/60">
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-40 bg-gradient-to-r from-transparent via-primary-700 to-transparent" />

      {/* Newsletter strip */}
      <div className="border-b border-border">
        <div className="container py-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary-700 font-semibold">
              Stay in the loop
            </div>
            <h3 className="font-display text-2xl md:text-3xl tracking-tight mt-1 text-balance">
              Get drive announcements &amp; impact stories.
            </h3>
          </div>
          <form onSubmit={subscribe} className="flex w-full md:w-auto items-center gap-2">
            {subscribed ? (
              <div className="flex items-center gap-2 text-sm text-success bg-success/10 border border-success/20 rounded-full px-4 py-2.5">
                <Check className="h-4 w-4" /> You&apos;re on the list.
              </div>
            ) : (
              <>
                <div className="relative flex-1 md:w-80">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-fg" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 pl-9 pr-3 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-700 focus:border-primary-700 transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-primary-700 text-white text-sm font-medium hover:bg-primary-800 disabled:opacity-60 transition-colors shadow-glow"
                >
                  {busy ? "…" : <>Subscribe <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main grid */}
      <div className="container py-16 grid gap-12 md:grid-cols-12">
        {/* Brand */}
        <div className="md:col-span-4">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display text-xl">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-900 shadow-glow">
              <Heart className="h-4 w-4 text-white fill-white" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-semibold">LifeLine</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-muted-fg mt-0.5">
                E-Blood Bank
              </span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-fg leading-relaxed max-w-sm">{t.footer.blurb}</p>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-fg">
            <MapPin className="h-3.5 w-3.5" /> Built in Nigeria 🇳🇬 by Haleyouth Foundation
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] mb-4 text-fg">
            {t.footer.product}
          </h4>
          <ul className="space-y-2.5 text-sm">
            <FootLink href="/donate">{t.nav.donate}</FootLink>
            <FootLink href="/request">{t.nav.request}</FootLink>
            <FootLink href="/hospital">{t.nav.hospital}</FootLink>
            <FootLink href="/eligibility">{t.eligibility.badge}</FootLink>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] mb-4 text-fg">
            {t.footer.reach}
          </h4>
          <ul className="space-y-3 text-sm text-muted-fg">
            <li className="flex items-center gap-2.5">
              <span className="h-7 w-7 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 flex items-center justify-center">
                <Phone className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-wider text-muted-fg/70">
                  {t.footer.tollFree}
                </span>
                <span className="text-fg font-medium">0800-LIFELINE</span>
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-7 w-7 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 flex items-center justify-center">
                <MessageCircle className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-wider text-muted-fg/70">
                  {t.footer.sms}
                </span>
                <span className="text-fg font-medium">&ldquo;BLOOD&rdquo; → 5050</span>
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="h-7 w-7 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 flex items-center justify-center">
                <Globe className="h-3.5 w-3.5" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-wider text-muted-fg/70">
                  {t.footer.ussd}
                </span>
                <span className="text-fg font-medium">*565*5050#</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] mb-4 text-fg">
            {t.footer.standards}
          </h4>
          <ul className="space-y-2.5 text-sm">
            <FootLink href="/standards/who">WHO Blood Safety</FootLink>
            <FootLink href="/standards/nbsa">NBSA Act 2021</FootLink>
            <FootLink href="/standards/isbt-128">ISBT-128</FootLink>
            <FootLink href="/standards/ndpr">NDPR &amp; NDPA</FootLink>
          </ul>
        </div>
      </div>

      {/* Bottom bar with centered shield */}
      <div className="border-t border-border">
        <div className="container py-6 relative flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-fg">
          <span>© {new Date().getFullYear()} Haleyouth Foundation. {t.footer.rights}</span>

          {/* Centered shield admin entry */}
          <Link
            href="/admin"
            aria-label="Admin sign-in"
            title="Admin sign-in"
            className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 group inline-flex items-center justify-center h-10 w-10 rounded-full bg-card border border-border text-muted-fg hover:text-primary-700 hover:border-primary-700/40 hover:shadow-glow transition-all"
          >
            <Shield className="h-4 w-4 transition-transform group-hover:scale-110" />
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/standards/ndpr" className="hover:text-fg transition-colors">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-fg transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FootLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-fg hover:text-primary-700 transition-colors inline-flex items-center gap-1.5 group"
      >
        <span className="h-1 w-1 rounded-full bg-muted-fg/40 group-hover:bg-primary-700 transition-colors" />
        {children}
      </Link>
    </li>
  );
}
