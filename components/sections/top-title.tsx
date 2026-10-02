"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Titulo de capa: a marca em tamanho gigante no topo da pagina, antes do Hero.
 * O tamanho escala com a viewport (2.7rem no mobile ate 7.8rem no desktop largo).
 */
export function TopTitle() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-6xl px-6 pt-20 sm:pt-28">
      <motion.p
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.01 : 0.9 }}
        className="text-[clamp(2.7rem,10.2vw,7.8rem)] font-semibold leading-[0.9] tracking-tighter text-neon-white select-none"
      >
        TechTie
      </motion.p>
    </div>
  );
}
