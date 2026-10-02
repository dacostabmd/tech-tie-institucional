"use client";

import { useReducedMotion } from "motion/react";

/**
 * Aurora (React Bits, adaptado) — glow radial animado em CSS puro.
 * Sem Canvas/WebGL: mantem o custo de performance baixo para o hero.
 */
export function Aurora() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`absolute -top-1/3 left-1/4 size-[60vw] max-w-[900px] rounded-full bg-gold/20 blur-[120px] ${
          shouldReduceMotion ? "" : "animate-aurora-drift-1"
        }`}
      />
      <div
        className={`absolute top-0 right-1/4 size-[45vw] max-w-[700px] rounded-full bg-gold/10 blur-[110px] ${
          shouldReduceMotion ? "" : "animate-aurora-drift-2"
        }`}
      />
    </div>
  );
}
