"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Droplet({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 200 240"
      className={cn("drop-shadow-[0_20px_40px_rgba(185,28,28,0.35)]", className)}
      initial={animate ? { y: -8, opacity: 0 } : false}
      animate={animate ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <linearGradient id="d-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCA5A5" />
          <stop offset="40%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>
        <radialGradient id="d-shine" cx="0.3" cy="0.3" r="0.4">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <motion.path
        d="M100 8 C100 8 30 100 30 160 a70 70 0 0 0 140 0 C170 100 100 8 100 8 Z"
        fill="url(#d-grad)"
        animate={animate ? { scale: [1, 1.02, 1] } : undefined}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 140px" }}
      />
      <ellipse cx="78" cy="110" rx="22" ry="34" fill="url(#d-shine)" />
    </motion.svg>
  );
}
