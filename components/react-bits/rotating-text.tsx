"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Rotating Text (React Bits, adaptado) — alterna palavras com transicao
 * vertical em mola. Adaptacoes: rotacao por palavra inteira (sem divisao por
 * caractere) e texto fixo com movimento reduzido.
 */
interface RotatingTextProps {
  texts: string[];
  rotationInterval?: number;
  className?: string;
}

export default function RotatingText({
  texts,
  rotationInterval = 2600,
  className,
}: RotatingTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || texts.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % texts.length), rotationInterval);
    return () => clearInterval(id);
  }, [shouldReduceMotion, texts.length, rotationInterval]);

  if (shouldReduceMotion) {
    return <span className={className}>{texts[0]}</span>;
  }

  return (
    <span className={cn("relative inline-flex overflow-hidden align-bottom", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={texts[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className="inline-block"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
