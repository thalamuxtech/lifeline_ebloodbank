"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

// Curated public LottieFiles animations relevant to health/donation/voice
export const LOTTIE = {
  heartbeat: "https://lottie.host/4d42d6c9-3f93-4ba3-9b3a-5b8c8a8b3b3a/HFmkz1G6Vw.lottie",
  // Fallbacks (animated SVG components below if URL fails)
};

export function Infographic({ src, className, loop = true }: { src: string; className?: string; loop?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <DotLottieReact src={src} loop={loop} autoplay style={{ width: "100%", height: "100%" }} />
    </motion.div>
  );
}

// SVG infographic: blood compatibility wheel
export function CompatibilityWheel({ className }: { className?: string }) {
  const groups = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
  return (
    <svg viewBox="0 0 320 320" className={className}>
      <defs>
        <radialGradient id="cw" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FEE2E2" />
          <stop offset="60%" stopColor="#FCA5A5" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="160" r="140" fill="url(#cw)" opacity="0.18" />
      <circle cx="160" cy="160" r="100" fill="none" stroke="#B91C1C" strokeOpacity="0.2" strokeDasharray="3 6" />
      {groups.map((g, i) => {
        const angle = (i / groups.length) * Math.PI * 2 - Math.PI / 2;
        const x = 160 + Math.cos(angle) * 120;
        const y = 160 + Math.sin(angle) * 120;
        return (
          <g key={g}>
            <motion.circle
              cx={x} cy={y} r={26}
              fill={i % 2 ? "#B91C1C" : "#fff"}
              stroke="#B91C1C"
              strokeWidth={2}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 220 }}
            />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={i % 2 ? "#fff" : "#B91C1C"}>{g}</text>
          </g>
        );
      })}
      <text x="160" y="155" textAnchor="middle" fontSize="11" fill="#7F1D1D" opacity="0.7">UNIVERSAL</text>
      <text x="160" y="172" textAnchor="middle" fontSize="20" fontWeight="800" fill="#B91C1C">O−</text>
    </svg>
  );
}

// SVG infographic: SMS / Voice / Web channels
export function ChannelsInfographic({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 280" className={className}>
      <defs>
        <linearGradient id="ch" x1="0" x2="1">
          <stop offset="0%" stopColor="#B91C1C" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <motion.line x1="80" y1="140" x2="400" y2="140" stroke="url(#ch)" strokeWidth="3"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
      {[
        { x: 80, label: "Smartphone", icon: "📱" },
        { x: 200, label: "SMS", icon: "💬" },
        { x: 320, label: "USSD", icon: "☎" },
        { x: 400, label: "Voice AI", icon: "🎙" },
      ].map((n, i) => (
        <motion.g key={n.label}
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.1 }}>
          <circle cx={n.x} cy="140" r="34" fill="white" stroke="#B91C1C" strokeWidth="2" />
          <text x={n.x} y="148" textAnchor="middle" fontSize="22">{n.icon}</text>
          <text x={n.x} y="200" textAnchor="middle" fontSize="12" fontWeight="600" fill="#7F1D1D">{n.label}</text>
        </motion.g>
      ))}
      <motion.text x="240" y="50" textAnchor="middle" fontSize="14" fontWeight="700" fill="#B91C1C"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
        Reach every Nigerian — any device, any literacy level
      </motion.text>
    </svg>
  );
}
