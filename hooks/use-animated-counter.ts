"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

type UseAnimatedCounterOptions = {
  value: number;
  duration?: number;
};

// Anima um contador numerico ao entrar na viewport, respeitando prefers-reduced-motion.
export function useAnimatedCounter({ value }: UseAnimatedCounterOptions) {
  const ref = useRef<HTMLSpanElement>(null);
  // Margem so na base: com inset lateral, numeros encostados na borda (mobile) nunca "entram" na tela.
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 60,
  });

  useEffect(() => {
    if (!isInView) return;

    if (shouldReduceMotion) {
      motionValue.set(value);
      return;
    }

    motionValue.set(value);
  }, [isInView, motionValue, shouldReduceMotion, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString("pt-BR");
      }
    });
    return unsubscribe;
  }, [springValue]);

  return ref;
}
