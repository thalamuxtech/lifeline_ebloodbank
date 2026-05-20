"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLocale } from "@/store/locale";

export default function EligibilityPage() {
  const { t } = useLocale();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<("yes" | "no")[]>([]);

  const QUESTIONS = t.eligibility.questions;
  const done = i >= QUESTIONS.length;
  const failed = answers.filter((a, idx) => a !== QUESTIONS[idx]?.safe);

  function answer(a: "yes" | "no") {
    setAnswers((prev) => [...prev, a]);
    setI((x) => x + 1);
  }
  function reset() { setI(0); setAnswers([]); }

  return (
    <section className="container max-w-2xl py-12 md:py-20">
      <Badge tone="primary">{t.eligibility.badge}</Badge>
      <h1 className="font-display text-4xl md:text-5xl tracking-tight mt-3 text-balance">
        {t.eligibility.title1} <span className="text-gradient">{t.eligibility.title2}</span>
      </h1>

      {!done && (
        <Card className="mt-10 p-6 md:p-8">
          <div className="text-xs text-muted-fg">{t.eligibility.questionPrefix} {i + 1} {t.eligibility.of} {QUESTIONS.length}</div>
          <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary-700" animate={{ width: `${(i / QUESTIONS.length) * 100}%` }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mt-8">
              <CardTitle className="text-2xl">{QUESTIONS[i].q}</CardTitle>
              {QUESTIONS[i].help && <p className="text-sm text-muted-fg mt-2">{QUESTIONS[i].help}</p>}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <Button size="lg" variant="secondary" onClick={() => answer("no")}><X className="h-4 w-4" /> {t.common.no}</Button>
                <Button size="lg" onClick={() => answer("yes")}><Check className="h-4 w-4" /> {t.common.yes}</Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      )}

      {done && (
        <Card className="mt-10 p-8 md:p-12 text-center">
          {failed.length === 0 ? (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220 }}>
                <CheckCircle2 className="h-20 w-20 text-success mx-auto" />
              </motion.div>
              <h2 className="font-display text-4xl mt-4">{t.eligibility.readyTitle}</h2>
              <p className="text-muted-fg mt-2">{t.eligibility.readyBody}</p>
              <Link href="/donate"><Button size="lg" className="mt-8">{t.eligibility.readyCta}</Button></Link>
            </>
          ) : (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <XCircle className="h-20 w-20 text-warning mx-auto" />
              </motion.div>
              <h2 className="font-display text-4xl mt-4">{t.eligibility.notReadyTitle}</h2>
              <p className="text-muted-fg mt-2 max-w-md mx-auto">{t.eligibility.notReadyBody.replace("{n}", String(failed.length))}</p>
              <Button size="lg" variant="secondary" onClick={reset} className="mt-8">{t.eligibility.tryAgain}</Button>
            </>
          )}
        </Card>
      )}
    </section>
  );
}
