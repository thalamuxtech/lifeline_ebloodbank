"use client";
import { motion } from "framer-motion";
import { Heart, Globe, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/store/locale";

export default function AboutPage() {
  const { t } = useLocale();
  const icons = [Heart, Globe, ShieldCheck];
  return (
    <section className="container max-w-4xl py-16 md:py-24">
      <Badge tone="primary">{t.about.badge}</Badge>
      <h1 className="font-display text-5xl md:text-6xl tracking-tight mt-4 text-balance">
        {t.about.title1} <span className="text-gradient">{t.about.title2}</span>
      </h1>
      <p className="text-muted-fg text-lg mt-6 leading-relaxed max-w-2xl">{t.about.body}</p>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {t.about.values.map((v, i) => {
          const Icon = icons[i];
          return (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Card className="p-6 h-full">
                <div className="h-10 w-10 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-700 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{v.title}</CardTitle>
                <p className="text-sm text-muted-fg mt-2 leading-relaxed">{v.body}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-20 rounded-3xl bg-gradient-to-br from-primary-700 to-primary-900 text-white p-10 md:p-16 text-center">
        <Sparkles className="h-8 w-8 mx-auto mb-4 opacity-80" />
        <h2 className="font-display text-3xl md:text-4xl">{t.about.partner}</h2>
        <p className="mt-3 text-white/80 max-w-lg mx-auto">{t.about.partnerBody}</p>
        <a href="mailto:info@haleyouthfoundation.org" className="inline-block mt-6 px-6 py-3 bg-white text-primary-800 rounded-full font-medium hover:bg-white/90 transition">info@haleyouthfoundation.org</a>
      </div>
    </section>
  );
}
