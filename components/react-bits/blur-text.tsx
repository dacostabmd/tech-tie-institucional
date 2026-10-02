"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Blur Text (React Bits, adaptado) — revela o texto palavra a palavra saindo
 * do desfoque. Adaptacoes: tag configuravel (h1/h2/p), texto completo exposto
 * via aria-label para leitores de tela e versao estatica com
 * prefers-reduced-motion.
 */
interface BlurTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** Atraso entre palavras, em ms. */
  delay?: number;
  direction?: "top" | "bottom";
  stepDuration?: number;
}

export default function BlurText({
  text,
  as: Tag = "p",
  className,
  delay = 80,
  direction = "bottom",
  stepDuration = 0.35,
}: BlurTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const words = text.split(" ");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const offset = direction === "top" ? -24 : 24;
  const from = { filter: "blur(10px)", opacity: 0, y: offset };
  const to = {
    filter: ["blur(10px)", "blur(4px)", "blur(0px)"],
    opacity: [0, 0.5, 1],
    y: [offset, -offset / 8, 0],
  };

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          initial={from}
          animate={inView ? to : from}
          transition={{
            duration: stepDuration * 2,
            times: [0, 0.5, 1],
            delay: (index * delay) / 1000,
            ease: "easeOut",
          }}
          className="inline-block will-change-[transform,filter,opacity]"
        >
          {word}
          {index < words.length - 1 && " "}
        </motion.span>
      ))}
    </Tag>
  );
}
