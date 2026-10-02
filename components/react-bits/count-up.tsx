"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Count Up (React Bits, adaptado) — contador com mola ao entrar na viewport.
 * Adaptacoes: formatacao pt-BR e valor final imediato com movimento reduzido.
 */
interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
}

const format = (value: number) => Math.round(value).toLocaleString("pt-BR");

export default function CountUp({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });
  // Margem so na base: com inset lateral, numeros encostados na borda (mobile) nunca "entram" na tela.
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      if (ref.current) ref.current.textContent = format(to);
      return;
    }
    const timeoutId = setTimeout(() => motionValue.set(to), delay * 1000);
    return () => clearTimeout(timeoutId);
  }, [isInView, shouldReduceMotion, motionValue, to, delay]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) ref.current.textContent = format(latest);
      }),
    [springValue],
  );

  return (
    <span ref={ref} className={className}>
      {format(from)}
    </span>
  );
}
