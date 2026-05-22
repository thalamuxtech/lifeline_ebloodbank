"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, ShieldCheck, Phone, MessageCircle, Languages, Activity, Hospital, MapPin, Sparkles, Megaphone, Star, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet } from "@/components/ui/droplet";
import { Counter } from "@/components/ui/counter";
import { CompatibilityFlow } from "@/components/ui/compatibility-flow";
import { ChannelsInfographic } from "@/components/ui/infographic";
import { Reveal, RevealStagger, StaggerItem } from "@/components/ui/reveal";
import { Magnetic, Tilt } from "@/components/ui/magnetic";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedBlobs, GridBackdrop } from "@/components/ui/blobs";
import { SplitText } from "@/components/ui/split-text";
import { useLocale } from "@/store/locale";
import { getSettings, getStats } from "@/lib/data";

export default function HomePage() {
  const { t } = useLocale();
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const dropletY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const dropletRotate = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const [settings, setSettings] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings(null));
    getStats().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <>
      {settings?.bannerActive && (
        <motion.div
          initial={{ height: 0 }} animate={{ height: "auto" }}
          className="bg-gradient-to-r from-primary-700 to-primary-900 text-white text-sm"
        >
          <div className="container py-2.5 flex items-center justify-center gap-2">
            <Megaphone className="h-4 w-4" /> {settings.bannerText}
          </div>
        </motion.div>
      )}

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden bg-grain">
        <GridBackdrop />
        <AnimatedBlobs />

        <div className="container pt-12 md:pt-20 pb-24 md:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div style={reduce ? undefined : { y, opacity }} className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge tone="primary" className="mb-6 backdrop-blur-md">
                <Sparkles className="h-3 w-3" /> {t.hero.eyebrow}
              </Badge>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[0.95] text-balance">
              <SplitText text={t.hero.title1} />
              <br />
              <span className="text-gradient">
                <SplitText text={t.hero.title2} delay={0.25} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="mt-6 text-lg text-muted-fg max-w-lg text-balance"
            >
              {t.hero.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <Magnetic>
                <Link href="/donate">
                  <Button size="lg" className="group">
                    {t.hero.ctaPrimary}
                    <motion.span className="inline-flex" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Link href="/request">
                  <Button size="lg" variant="secondary">{t.hero.ctaSecondary}</Button>
                </Link>
              </Magnetic>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
              className="mt-10 flex items-center gap-6 text-sm text-muted-fg flex-wrap">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> {t.hero.nbsa}</div>
              <div className="flex items-center gap-2"><Languages className="h-4 w-4 text-primary-700" /> {t.hero.langs}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {t.hero.anyPhone}</div>
            </motion.div>
          </motion.div>

          <motion.div style={reduce ? undefined : { y: dropletY, rotate: dropletRotate }} className="relative flex items-center justify-center lg:justify-end">
            <div className="absolute h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(220,38,38,0.18),transparent_60%)] blur-2xl" />
            <Droplet className="relative h-[420px] w-auto" />
            <FloatingCard className="left-0 top-10 md:-left-4" delay={0.6}
              icon={<Activity className="h-4 w-4 text-success" />} title="Match found" sub="O- · 2.4 km · 4 min" />
            <FloatingCard className="right-0 bottom-10 md:-right-4" delay={0.9}
              icon={<Hospital className="h-4 w-4 text-primary-700" />} title="Unit dispatched" sub="LUTH · ISBT-128" />
          </motion.div>
        </div>

        <div className="relative pb-8">
          <Marquee duration={36}>
            {["WHO Aligned", "NBSA Act 2021", "ISBT-128 Traceability", "NDPR Compliant", "Voluntary Donors", "Voice + SMS + USSD", "WHO Aligned", "NBSA Act 2021", "ISBT-128 Traceability"].map((s, i) => (
              <span key={i} className="text-xs uppercase tracking-[0.25em] text-muted-fg flex items-center gap-3">
                {s} <span className="text-primary-700">✦</span>
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* IMPACT STRIP */}
      <section className="container -mt-12 relative z-20">
        <Tilt max={4}>
          <Card className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border overflow-hidden">
            <Stat value={stats?.totals?.donors ?? 0} label={t.impact.donors} />
            <Stat value={stats?.totals?.inventory ?? 0} label={t.impact.units} />
            <Stat value={9430} label={t.impact.lives} />
            <Stat value={stats?.totals?.drives ?? 0} label={t.impact.drives} />
          </Card>
        </Tilt>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-24 relative">
        <RevealStagger className="max-w-2xl mb-14">
          <StaggerItem><Badge>{t.howItWorks.badge}</Badge></StaggerItem>
          <StaggerItem>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-4 text-balance">
              {t.howItWorks.title1} <span className="text-gradient">{t.howItWorks.flow}</span>{t.howItWorks.title2}
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-muted-fg mt-4">{t.howItWorks.body}</p>
          </StaggerItem>
        </RevealStagger>

        <RevealStagger className="grid md:grid-cols-3 gap-6">
          {t.howItWorks.steps.map((step, i) => {
            const Icon = [Heart, MapPin, ShieldCheck][i];
            const accent = ["from-primary-700 to-primary-900", "from-amber-500 to-primary-700", "from-emerald-500 to-primary-700"][i];
            return (
              <StaggerItem key={step.title}>
                <Tilt>
                  <Card className="group p-6 h-full transition-all hover:border-primary-700/30 hover:shadow-glow relative overflow-hidden">
                    <motion.div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`} />
                    <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-100 mb-5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                    <p className="text-muted-fg text-sm mt-2 leading-relaxed">{step.body}</p>
                    <motion.div className="mt-5 inline-flex items-center gap-1 text-xs text-primary-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.howItWorks.learnMore} <ArrowRight className="h-3 w-3" />
                    </motion.div>
                  </Card>
                </Tilt>
              </StaggerItem>
            );
          })}
        </RevealStagger>
      </section>

      {/* DID YOU KNOW */}
      <section className="container py-24 relative">
        <AnimatedBlobs className="opacity-40" />
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <Reveal>
            <CompatibilityFlow />
          </Reveal>
          <div>
            <Reveal>
              <Badge tone="primary"><Sparkles className="h-3 w-3" /> {t.didYouKnow.badge}</Badge>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-4 text-balance">
                {t.didYouKnow.title1} <span className="text-gradient">{t.didYouKnow.title2}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted-fg mt-4 text-lg leading-relaxed">{t.didYouKnow.body}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {t.didYouKnow.facts.map((f, i) => (
                  <FactCard key={i} icon={[<Clock key="a" className="h-4 w-4" />, <Zap key="b" className="h-4 w-4" />, <Heart key="c" className="h-4 w-4" />][i]} v={f.v} l={f.l} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="container py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Reveal><Badge tone="primary">{t.channels.badge}</Badge></Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight mt-4 text-balance">
                {t.channels.title1} <span className="text-gradient">{t.channels.title2}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-muted-fg mt-4 text-lg leading-relaxed">{t.channels.body}</p>
            </Reveal>
            <RevealStagger className="mt-8 space-y-3">
              {[
                { icon: MessageCircle, label: `${t.channels.sms} ${settings?.smsShortcode ?? "5050"}` },
                { icon: Phone, label: `${t.channels.call} ${settings?.helpline ?? "0800-LIFELINE"} ${t.channels.tollFree}` },
                { icon: Languages, label: `${t.channels.ussd} ${settings?.ussdCode ?? "*565*5050#"} ${t.channels.onAnyPhone}` },
              ].map((c) => (
                <StaggerItem key={c.label}>
                  <motion.div whileHover={{ x: 4 }} className="flex items-center gap-3 text-sm cursor-default">
                    <div className="h-9 w-9 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center dark:bg-primary-900/30">
                      <c.icon className="h-4 w-4" />
                    </div>
                    {c.label}
                  </motion.div>
                </StaggerItem>
              ))}
            </RevealStagger>
          </div>

          <Reveal delay={0.1}>
            <Tilt max={6}>
              <Card className="p-6 lg:p-8 bg-gradient-to-br from-primary-900 via-primary-800 to-black text-white border-none relative overflow-hidden">
                <motion.div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/30 blur-3xl"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 6, repeat: Infinity }} />
                <Badge tone="primary" className="bg-white/15 text-white">{t.channels.voiceDemo}</Badge>
                <div className="mt-6 space-y-4 relative">
                  <TypingBubble role="user" delay={0.2}>Sannu. Ina bukatan jini O- nan da yamma.</TypingBubble>
                  <TypingBubble role="agent" delay={1.4}>Na fahimce ka. Akwai jini O- a Asibitin Kano. Zan tura adireshin a SMS yanzu.</TypingBubble>
                  <TypingBubble role="user" delay={2.8}>Na gode.</TypingBubble>
                </div>
                <div className="mt-8 text-xs text-white/60">{t.channels.voicePowered}</div>
              </Card>
            </Tilt>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-16">
            <ChannelsInfographic className="w-full max-w-3xl mx-auto" />
          </div>
        </Reveal>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 relative">
        <Reveal className="container mb-10 max-w-2xl">
          <Badge>{t.testimonials.badge}</Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl tracking-tight mt-4 text-balance">
            {t.testimonials.title}
          </h2>
        </Reveal>
        <Marquee duration={50} className="py-2">
          {[
            { q: "I got an SMS at 2am — by 3am I was at the hospital. We saved my cousin.", a: "Aisha B., Kano" },
            { q: "Finally, hospitals can see real-time stock. No more guesswork.", a: "Dr. Ifeanyi U., LUTH" },
            { q: "I called the toll-free line in Yoruba and they understood me. Beautiful.", a: "Babatunde A., Ibadan" },
            { q: "The USSD menu works on my old Nokia. That's the magic.", a: "Hauwa M., Sokoto" },
            { q: "NBSA dashboard finally gives us the data we needed for policy.", a: "Director, NBSA Zone 3" },
          ].map((tt, i) => (
            <div key={i} className="w-[320px] sm:w-[360px] shrink-0 whitespace-normal">
              <Card className="p-5 h-full">
                <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />)}</div>
                <p className="text-sm leading-relaxed text-pretty">&ldquo;{tt.q}&rdquo;</p>
                <div className="text-xs text-muted-fg mt-3">— {tt.a}</div>
              </Card>
            </div>
          ))}
        </Marquee>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <Reveal>
          <Card className="relative overflow-hidden p-12 md:p-20 text-center bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white border-none">
            <motion.div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
              animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 14, repeat: Infinity }} />
            <motion.div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-red-300/20 blur-3xl"
              animate={{ x: [0, -40, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 16, repeat: Infinity }} />
            <h2 className="relative font-display text-4xl md:text-6xl tracking-tight text-balance">{t.cta.title}</h2>
            <p className="relative text-white/80 mt-4 max-w-xl mx-auto">{t.cta.body}</p>
            <div className="relative mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Magnetic>
                <Link href="/donate"><Button size="lg" className="bg-white text-primary-800 hover:bg-white/90 shadow-none">{t.hero.ctaPrimary}</Button></Link>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Link href="/eligibility"><Button size="lg" variant="ghost" className="text-white hover:bg-white/10">{t.cta.checkEligibility}</Button></Link>
              </Magnetic>
            </div>
          </Card>
        </Reveal>
      </section>
    </>
  );
}

function FloatingCard({ className, icon, title, sub, delay = 0 }: { className?: string; icon: React.ReactNode; title: string; sub: string; delay?: number; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring", stiffness: 220 }}
      whileHover={{ y: -4, scale: 1.04 }}
      className={`absolute ${className} bg-card border border-border rounded-2xl shadow-glow p-3 pr-5 flex items-center gap-3 backdrop-blur-xl`}
    >
      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">{icon}</div>
      <div className="text-left">
        <div className="text-xs font-semibold">{title}</div>
        <div className="text-[11px] text-muted-fg">{sub}</div>
      </div>
    </motion.div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="p-6 md:p-8 text-center">
      <div className="font-display text-3xl md:text-4xl text-gradient"><Counter to={value} /></div>
      <div className="text-xs md:text-sm text-muted-fg mt-1">{label}</div>
    </motion.div>
  );
}

function FactCard({ icon, v, l }: { icon: React.ReactNode; v: string; l: string }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.02 }} className="rounded-2xl border border-border p-4 bg-card transition-all hover:border-primary-700/40 hover:shadow-soft">
      <div className="text-primary-700 mb-2">{icon}</div>
      <div className="font-display text-xl">{v}</div>
      <div className="text-xs text-muted-fg mt-1">{l}</div>
    </motion.div>
  );
}

function TypingBubble({ role, children, delay = 0 }: { role: "user" | "agent"; children: React.ReactNode; delay?: number }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${isUser ? "bg-white text-primary-900" : "bg-white/10 text-white border border-white/15"}`}>
        {children}
      </div>
    </motion.div>
  );
}
