"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Siren, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BLOOD_GROUPS, type BloodGroup } from "@/lib/utils";
import { useLocale } from "@/store/locale";
import { createRequest } from "@/lib/data";
import { toast } from "sonner";

const hospitals = ["LUTH", "AKTH", "National Hospital", "UCH Ibadan", "UPTH", "ABUTH", "UNTH", "UDUTH"];
const cities = ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Kaduna", "Enugu", "Sokoto"];

export default function RequestPage() {
  const { t } = useLocale();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ patientName: "", hospital: "LUTH", city: "Lagos", bloodGroup: "O-" as BloodGroup, units: 1, urgency: 4 });
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      const data = await createRequest({ ...form, urgency: form.urgency as 1 | 2 | 3 | 4 | 5 });
      setResult(data);
      setStep(4);
    } catch (e) {
      toast.error("Could not submit request. Please try again.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container max-w-2xl py-12 md:py-20">
      <Badge tone="danger"><Siren className="h-3 w-3" /> {t.request.badge}</Badge>
      <h1 className="font-display text-4xl md:text-5xl tracking-tight mt-3 text-balance">
        {t.request.title1} <span className="text-gradient">{t.request.title2}</span>
      </h1>
      <p className="text-muted-fg mt-3">{t.request.sub}</p>

      <Card className="mt-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-5">
              <CardTitle>{t.request.s1Title}</CardTitle>
              <Field label={t.request.patientName}>
                <input className="input" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })} placeholder={t.request.patientPh} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={t.request.hospital}>
                  <select className="input" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })}>
                    {hospitals.map((h) => <option key={h}>{h}</option>)}
                  </select>
                </Field>
                <Field label={t.request.city}>
                  <select className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                    {cities.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <Button size="lg" disabled={!form.patientName} onClick={() => setStep(2)} className="w-full">
                {t.common.continue} <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-5">
              <CardTitle>{t.request.s2Title}</CardTitle>
              <Field label={t.donate.bloodGroup}>
                <div className="grid grid-cols-4 gap-2">
                  {BLOOD_GROUPS.map((bg) => (
                    <button key={bg} onClick={() => setForm({ ...form, bloodGroup: bg })}
                      className={`h-12 rounded-xl font-semibold border transition ${form.bloodGroup === bg ? "bg-primary-700 text-white border-primary-700 shadow-glow" : "border-border hover:border-primary-700/40"}`}>{bg}</button>
                  ))}
                </div>
              </Field>
              <Field label={`${t.request.unitsNeeded}: ${form.units}`}>
                <input type="range" min={1} max={6} value={form.units} onChange={(e) => setForm({ ...form, units: +e.target.value })} className="w-full accent-primary-700" />
              </Field>
              <Field label={`${t.request.urgency}: ${t.request.urgencyLevels[form.urgency]}`}>
                <input type="range" min={1} max={5} value={form.urgency} onChange={(e) => setForm({ ...form, urgency: +e.target.value })} className="w-full accent-primary-700" />
              </Field>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(1)}>{t.common.back}</Button>
                <Button onClick={() => setStep(3)} className="flex-1">{t.common.review}</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="p-6 md:p-8 space-y-5">
              <CardTitle>{t.request.s3Title}</CardTitle>
              <div className="rounded-2xl bg-muted/50 p-5 space-y-2 text-sm">
                <Row label={t.request.patient} value={form.patientName} />
                <Row label={t.request.hospital} value={`${form.hospital}, ${form.city}`} />
                <Row label={t.request.need} value={`${form.units} ${t.request.units} ${form.bloodGroup}`} />
                <Row label={t.request.urgency} value={t.request.urgencyLevels[form.urgency]} />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setStep(2)}>{t.common.back}</Button>
                <Button onClick={submit} disabled={submitting} className="flex-1">{submitting ? t.request.broadcasting : t.request.submitCta}</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && result && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-8 space-y-5">
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220 }}>
                  <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
                </motion.div>
                <h2 className="font-display text-3xl mt-4">{t.request.liveTitle}</h2>
                <p className="text-muted-fg mt-2"><strong className="text-fg">{result.request.id}</strong> {t.request.isLive}</p>
              </div>
              <div className="rounded-2xl bg-primary-50 dark:bg-primary-900/20 p-5">
                <div className="text-sm font-semibold flex items-center gap-2"><Users className="h-4 w-4" /> {result.matches.length} {t.request.alertedSuffix}</div>
                <ul className="mt-3 divide-y divide-border">
                  {result.matches.map((m: any) => (
                    <li key={m.id} className="flex items-center justify-between py-2 text-sm">
                      <span>{m.name} · {m.city}</span>
                      <Badge tone={m.vnrd ? "success" : "neutral"}>{m.bloodGroup}{m.vnrd ? " · VNRD" : ""}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-xs font-medium text-muted-fg mb-1.5 block">{label}</span>{children}</label>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-fg">{label}</span><span className="font-medium">{value}</span></div>;
}
