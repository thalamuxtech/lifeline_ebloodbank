"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BLOOD_GROUPS, COMPATIBILITY, type BloodGroup } from "@/lib/utils";
import { useLocale } from "@/store/locale";

const SIZE = 480;
const CENTER = SIZE / 2;
const RADIUS = 175;

// Recipient compatibility — derived (who can give to me)
const RECIPIENT_FROM: Record<BloodGroup, BloodGroup[]> = (() => {
  const m: any = {};
  BLOOD_GROUPS.forEach((r) => (m[r] = []));
  BLOOD_GROUPS.forEach((d) => COMPATIBILITY[d].forEach((r) => m[r].push(d)));
  return m;
})();

const FACTS: Record<BloodGroup, { tag: string; pct: string; note: string }> = {
  "O-":  { tag: "Universal donor",    pct: "≈ 4%",  note: "Can give red cells to anyone. Critical for emergencies." },
  "O+":  { tag: "Most common",        pct: "≈ 38%", note: "Compatible with all Rh+ recipients." },
  "A-":  { tag: "Rare",               pct: "≈ 6%",  note: "Gives to A and AB recipients (both Rh)." },
  "A+":  { tag: "Common",             pct: "≈ 34%", note: "Gives to A+ and AB+ recipients." },
  "B-":  { tag: "Rare",               pct: "≈ 2%",  note: "Gives to B and AB recipients (both Rh)." },
  "B+":  { tag: "Less common",        pct: "≈ 9%",  note: "Gives to B+ and AB+ recipients." },
  "AB-": { tag: "Plasma universal",   pct: "≈ 1%",  note: "Plasma works for all. Red cells: AB only." },
  "AB+": { tag: "Universal recipient", pct: "≈ 3%", note: "Can receive from anyone." },
};

function position(i: number, total: number) {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER + Math.cos(angle) * RADIUS, y: CENTER + Math.sin(angle) * RADIUS, angle };
}

export function CompatibilityFlow() {
  const { t } = useLocale();
  const [hovered, setHovered] = useState<BloodGroup | null>(null);
  const [mode, setMode] = useState<"donate" | "receive">("donate");

  const positions = useMemo(() => {
    const map: Record<BloodGroup, { x: number; y: number; angle: number }> = {} as any;
    BLOOD_GROUPS.forEach((g, i) => (map[g] = position(i, BLOOD_GROUPS.length)));
    return map;
  }, []);

  const targets =
    hovered != null
      ? mode === "donate"
        ? COMPATIBILITY[hovered]
        : RECIPIENT_FROM[hovered]
      : [];

  return (
    <div className="w-full">
      {/* Mode toggle */}
      <div className="flex justify-center mb-4">
        <div className="relative inline-flex p-1 rounded-full bg-muted border border-border">
          {(["donate", "receive"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative px-4 py-1.5 text-xs font-medium rounded-full transition-colors"
            >
              {mode === m && (
                <motion.span
                  layoutId="mode-pill"
                  className="absolute inset-0 bg-primary-700 rounded-full shadow-glow"
                  transition={{ type: "spring", stiffness: 340, damping: 28 }}
                />
              )}
              <span className={`relative ${mode === m ? "text-white" : "text-muted-fg"}`}>
                {m === "donate" ? t.didYouKnow.canDonate : t.didYouKnow.canReceive}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[520px] mx-auto block">
          <defs>
            <radialGradient id="cf-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#FCA5A5" stopOpacity={0.4} />
              <stop offset="60%" stopColor="#EF4444" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#7F1D1D" stopOpacity={0} />
            </radialGradient>
            <linearGradient id="cf-arrow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B91C1C" stopOpacity={0.15} />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <filter id="cf-blur"><feGaussianBlur stdDeviation="6" /></filter>
            <marker
              id="cf-arrowhead"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
            </marker>
          </defs>

          {/* Background glow */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS + 60} fill="url(#cf-glow)" filter="url(#cf-blur)" />

          {/* Ring */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#B91C1C" strokeOpacity="0.12" strokeDasharray="2 6" />

          {/* Flow arrows on hover */}
          <AnimatePresence>
            {hovered &&
              targets
                .filter((t) => t !== hovered)
                .map((t, i) => {
                  const from = positions[hovered];
                  const to = positions[t];
                  // curved path through near-center
                  const mx = CENTER + (from.x + to.x - 2 * CENTER) * 0.15;
                  const my = CENTER + (from.y + to.y - 2 * CENTER) * 0.15;
                  const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;
                  return (
                    <motion.path
                      key={`${hovered}-${t}`}
                      d={d}
                      stroke="url(#cf-arrow)"
                      strokeWidth={2.5}
                      fill="none"
                      strokeLinecap="round"
                      markerEnd="url(#cf-arrowhead)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    />
                  );
                })}
          </AnimatePresence>

          {/* Travelling pulse along arrows */}
          <AnimatePresence>
            {hovered &&
              targets
                .filter((t) => t !== hovered)
                .map((t, i) => {
                  const from = positions[hovered];
                  const to = positions[t];
                  return (
                    <motion.circle
                      key={`pulse-${hovered}-${t}-${i}`}
                      r="3.5"
                      fill="#F59E0B"
                      initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                      animate={{
                        cx: [from.x, (from.x + to.x) / 2, to.x],
                        cy: [from.y, (from.y + to.y) / 2 - 14, to.y],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.4,
                        delay: 0.4 + i * 0.06,
                        repeat: Infinity,
                        repeatDelay: 0.4,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}
          </AnimatePresence>

          {/* Nodes */}
          {BLOOD_GROUPS.map((g, i) => {
            const { x, y } = positions[g];
            const isHovered = hovered === g;
            const isTarget = hovered != null && targets.includes(g) && g !== hovered;
            const dim = hovered != null && !isHovered && !isTarget;
            return (
              <g
                key={g}
                onMouseEnter={() => setHovered(g)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(g)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                style={{ cursor: "pointer", outline: "none" }}
              >
                {/* Halo */}
                {isHovered && (
                  <motion.circle
                    cx={x} cy={y} r={42}
                    fill="#EF4444" opacity={0.2}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [0.6, 1.2, 1], opacity: [0, 0.35, 0.2] }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <motion.circle
                  cx={x} cy={y}
                  r={isHovered ? 32 : isTarget ? 28 : 26}
                  fill={isHovered ? "#7F1D1D" : isTarget ? "#FFFFFF" : i % 2 ? "#B91C1C" : "#FFFFFF"}
                  stroke={isTarget ? "#F59E0B" : "#B91C1C"}
                  strokeWidth={isTarget ? 3 : 2}
                  initial={{ scale: 0 }}
                  animate={{
                    scale: 1,
                    opacity: dim ? 0.25 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 240, damping: 18, delay: i * 0.05 }}
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill={isHovered ? "#fff" : isTarget ? "#7F1D1D" : i % 2 ? "#fff" : "#B91C1C"}
                  style={{ opacity: dim ? 0.4 : 1, pointerEvents: "none" }}
                >
                  {g}
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <AnimatePresence mode="wait">
            {hovered ? (
              <motion.g key={hovered} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <text x={CENTER} y={CENTER - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF" letterSpacing="0.1em">
                  {mode === "donate" ? t.didYouKnow.donatesTo : t.didYouKnow.receivesFrom}
                </text>
                <text x={CENTER} y={CENTER + 22} textAnchor="middle" fontSize="40" fontWeight="800" fill="#B91C1C" className="font-display">
                  {hovered}
                </text>
                <text x={CENTER} y={CENTER + 42} textAnchor="middle" fontSize="10" fill="#9CA3AF">
                  {targets.filter((x) => x !== hovered).length} {t.didYouKnow.compatibleSuffix}
                </text>
              </motion.g>
            ) : (
              <motion.g key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <text x={CENTER} y={CENTER - 6} textAnchor="middle" fontSize="11" fill="#9CA3AF" letterSpacing="0.15em">{t.didYouKnow.hoverHint}</text>
                <text x={CENTER} y={CENTER + 22} textAnchor="middle" fontSize="28" fontWeight="800" fill="#B91C1C" className="font-display">
                  {t.didYouKnow.compatibility}
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Floating fact panel */}
        <AnimatePresence mode="wait">
          {hovered && (
            <motion.div
              key={hovered}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mt-4 max-w-md mx-auto rounded-2xl border border-border bg-card p-4 shadow-soft"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary-700">{FACTS[hovered].tag}</span>
                <span className="text-muted-fg">{FACTS[hovered].pct} of Nigerians</span>
              </div>
              <p className="text-sm mt-1.5 text-fg leading-relaxed">{FACTS[hovered].note}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
