import Link from "next/link";
import type { ReactNode } from "react";

const sections = [
  { href: "/standards/who", label: "WHO Blood Safety" },
  { href: "/standards/nbsa", label: "NBSA Act 2021" },
  { href: "/standards/isbt-128", label: "ISBT-128" },
  { href: "/standards/ndpr", label: "NDPR" },
];

export default function StandardsLayout({ children }: { children: ReactNode }) {
  return (
    <section className="container py-12 md:py-20 grid lg:grid-cols-[220px_1fr] gap-10">
      <aside className="lg:sticky lg:top-24 self-start">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-fg mb-3">Standards</div>
        <ul className="space-y-1 text-sm">
          {sections.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="block rounded-xl px-3 py-2 text-muted-fg hover:bg-muted hover:text-fg transition-colors"
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <article className="standards-prose max-w-3xl">{children}</article>
    </section>
  );
}
