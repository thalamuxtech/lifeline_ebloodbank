"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Marquee({
  children,
  duration = 24,
  reverse = false,
  className,
}: {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] ${className ?? ""}`}>
      <motion.div
        className="flex gap-12 whitespace-nowrap will-change-transform"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <div className="flex gap-12 shrink-0">{children}</div>
        <div className="flex gap-12 shrink-0" aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}
