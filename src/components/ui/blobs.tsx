"use client";
import { motion } from "framer-motion";

export function AnimatedBlobs({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full bg-primary-700/20 blur-3xl"
        animate={{ x: [0, 60, -20, 0], y: [0, 40, -30, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[460px] w-[460px] rounded-full bg-amber-400/20 blur-3xl"
        animate={{ x: [0, -50, 30, 0], y: [0, 20, -40, 0], scale: [1, 0.94, 1.06, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 h-[420px] w-[420px] rounded-full bg-red-300/20 blur-3xl"
        animate={{ x: [0, 40, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.92, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_50%_at_50%_30%,#000_50%,transparent_100%)] ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(185,28,28,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(185,28,28,0.07) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
  );
}
