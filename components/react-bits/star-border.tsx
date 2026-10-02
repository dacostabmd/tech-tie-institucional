"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface StarBorderProps {
  children: ReactNode;
  className?: string;
}

/**
 * Star Border (React Bits, adaptado) — borda luminosa em rotacao continua
 * atras do conteudo, usada apenas no CTA principal (destaque unico).
 */
export function StarBorder({ children, className }: StarBorderProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={cn("relative inline-flex overflow-hidden rounded-lg p-px", className)}>
      {!shouldReduceMotion && (
        <span
          className="animate-star-border-spin absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--gold-soft)_50%,transparent_100%)]"
          aria-hidden="true"
        />
      )}
      <span className="relative flex size-full rounded-[calc(var(--radius-lg)-1px)] bg-background">
        {children}
      </span>
    </div>
  );
}
