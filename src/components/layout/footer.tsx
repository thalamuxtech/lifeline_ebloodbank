"use client";
import Link from "next/link";
import { Heart, Phone, MessageCircle, Globe, Shield } from "lucide-react";
import { useLocale } from "@/store/locale";

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="mt-32 border-t border-border bg-muted/40">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl">
            <Heart className="h-5 w-5 text-primary-700 fill-primary-700" />
            LifeLine
          </div>
          <p className="mt-3 text-sm text-muted-fg max-w-xs">{t.footer.blurb}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">{t.footer.product}</h4>
          <ul className="space-y-2 text-sm text-muted-fg">
            <li><Link href="/donate">{t.nav.donate}</Link></li>
            <li><Link href="/request">{t.nav.request}</Link></li>
            <li><Link href="/hospital">{t.nav.hospital}</Link></li>
            <li><Link href="/eligibility">{t.eligibility.badge}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">{t.footer.reach}</h4>
          <ul className="space-y-2 text-sm text-muted-fg">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {t.footer.tollFree} 0800-LIFELINE</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> {t.footer.sms} &ldquo;BLOOD&rdquo; → 5050</li>
            <li className="flex items-center gap-2"><Globe className="h-4 w-4" /> {t.footer.ussd} *565*5050#</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">{t.footer.standards}</h4>
          <ul className="space-y-2 text-sm text-muted-fg">
            <li><Link href="/standards/who" className="hover:text-fg">WHO Blood Safety</Link></li>
            <li><Link href="/standards/nbsa" className="hover:text-fg">NBSA Act 2021</Link></li>
            <li><Link href="/standards/isbt-128" className="hover:text-fg">ISBT-128</Link></li>
            <li><Link href="/standards/ndpr" className="hover:text-fg">NDPR</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-fg">
        <span>© {new Date().getFullYear()} Hale Youth Foundation — LifeLine. {t.footer.rights}</span>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-muted-fg hover:text-primary-700 transition-colors"
        >
          <Shield className="h-3.5 w-3.5" /> {t.dock?.admin ?? "Admin"}
        </Link>
      </div>
    </footer>
  );
}
