"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Phone, MapPin, Droplet as DropIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/utils";
import { useLocale } from "@/store/locale";

const cities = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Kaduna", "Enugu", "Sokoto"];

export default function DonatePage() {
  const { t } = useLocale();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState({ name: "", phone: "", bloodGroup: "O+" as BloodGroup, city: "Lagos", vnrd: true });
  const [submitting, setSubmitting] = useState(false);
  const [donorId, setDonorId] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    const res = await fetch("/api/donors", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setSubmitting(false);
    if (data.donor) { setDonorId(data.donor.id); setStep(4); }
  }

  const stepLabels = [t.donate.steps.identity, t.donate.steps.blood, t.donate.steps.confirm];

  return (
    <section className="container max-w-2xl py-12 md:py-20">
      <Badge tone="primary">{t.donate.badge}</Badge>
      <h1 className="font-display text-4xl md:text-5xl tracking-tight mt-3 text-balance">
        {t.donate.title1} <span className="text-gradient">{t.donate.title2}</span>
      </h1>
      <p className="text-muted-fg mt-3">{t.donate.sub}</p>

      <div className="mt-10 flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition ${step >= s ? "bg-primary-700" : "bg-border"}`} />
            <div className="text-[11px] mt-1 text-muted-fg">{stepLabels[s - 1]}</div>
          </div>
        ))}
      </div>

      <Card className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-5">
              <CardTitle>{t.donate.s1Title}</CardTitle>
              <Field label={t.donate.fullName}>
                <input className="input" placeholder={t.donate.namePh} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label={t.donate.phone} icon={<Phone className="h-4 w-4" />}>
                <input className="input" type="tel" placeholder={t.donate.phonePh} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </Field>
              <Button size="lg" disabled={form.name.length < 2 || form.phone.length < 7} onClick={() => setStep(2)} className="w-full">
                {t.common.continue} <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-5">
              <CardTitle>{t.donate.s2Title}</CardTitle>
              <Field label={t.donate.bloodGroup} icon={<DropIcon className="h-4 w-4" />}>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button key={bg} onClick={() => setForm({ ...form, bloodGroup: bg })}
                      className={`h-12 rounded-xl font-semibold border transition ${form.bloodGroup === bg ? "bg-primary-700 text-white border-primary-700 shadow-glow" : "border-border hover:border-primary-700/40"}`}>{bg}</button>
                  ))}
                </div>
              </Field>
              <Field label={t.donate.city} icon={<MapPin className="h-4 w-4" />}>
                <select className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <label className="flex items-start gap-3 p-4 rounded-2xl bg-muted/50 cursor-pointer">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-primary-700" checked={form.vnrd} onChange={(e) => setForm({ ...form, vnrd: e.target.checked })} />
                <span className="text-sm">
                  <strong>{t.donate.vnrdLabel}</strong> <span className="text-muted-fg text-xs">{t.donate.vnrdHint}</span>
                </span>
              </label>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)}>{t.common.back}</Button>
                <Button onClick={() => setStep(3)} className="flex-1">{t.common.review}</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-5">
              <CardTitle>{t.donate.s3Title}</CardTitle>
              <div className="rounded-2xl bg-muted/50 p-5 space-y-2 text-sm">
                <Row label={t.donate.fullName} value={form.name} />
                <Row label={t.donate.phone} value={form.phone} />
                <Row label={t.donate.bloodGroup} value={form.bloodGroup} />
                <Row label={t.donate.city} value={form.city} />
                <Row label={t.donate.vnrd} value={form.vnrd ? t.common.yes : t.common.no} />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(2)}>{t.common.back}</Button>
                <Button onClick={submit} disabled={submitting} className="flex-1">{submitting ? t.donate.registering : t.donate.registerCta}</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 md:p-12 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, delay: 0.1 }}>
                <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
              </motion.div>
              <h2 className="font-display text-3xl mt-4">{t.donate.successTitle}</h2>
              <p className="text-muted-fg mt-2">{t.donate.successId} <strong className="text-fg">{donorId}</strong></p>
              <div className="mt-6 rounded-2xl bg-primary-50 dark:bg-primary-900/20 p-5 text-left text-sm">
                {t.donate.successNote.replace("{city}", form.city).replace("{group}", form.bloodGroup)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <style jsx global>{`.input { @apply w-full h-12 px-4 rounded-xl bg-muted border border-transparent focus:border-primary-700 focus:ring-0 outline-none text-sm transition; }`}</style>
    </section>
  );
}

function Field({ label, children, icon }: { label: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-medium text-muted-fg flex items-center gap-1.5 mb-1.5">{icon}{label}</span>{children}</label>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-fg">{label}</span><span className="font-medium">{value}</span></div>;
}
