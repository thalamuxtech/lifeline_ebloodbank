"use client";
import Link from "next/link";
import { Heart, Phone, MessageCircle, Globe } from "lucide-react";
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
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /> {t.footer.sms} "BLOOD" → 5050</li>
            <li className="flex items-center gap-2"><Globe className="h-4 w-4" /> {t.footer.ussd} *565*5050#</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">{t.footer.standards}</h4>
          <ul className="space-y-2 text-sm text-muted-fg">
            <li>WHO Blood Safety</li>
            <li>NBSA Act 2021</li>
            <li>ISBT-128</li>
            <li>NDPR</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-fg">
        © {new Date().getFullYear()} Hale Youth Foundation — LifeLine. {t.footer.rights}
      </div>
    </footer>
  );
}
