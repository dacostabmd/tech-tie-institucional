"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shiny Text (React Bits, adaptado) — varredura de brilho sutil via
 * background-clip, em tom Cerulean para reforcar a leitura "metalica".
 */
export function ShinyText({ children, className }: ShinyTextProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent",
        shouldReduceMotion
          ? "bg-foreground"
          : "animate-shiny-text bg-[linear-gradient(110deg,var(--foreground)_40%,var(--gold)_50%,var(--foreground)_60%)] bg-[length:250%_100%]",
        className,
      )}
    >
      {children}
    </span>
  );
}
