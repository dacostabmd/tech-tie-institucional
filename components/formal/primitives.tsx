"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/layout/fade-in";

// Pecas compartilhadas da identidade formal: botoes de CTA, cabecalho de
// secao e o selo/wordmark.

type CtaVariant = "brass" | "navy" | "outline-light" | "outline-dark";

const ctaVariants: Record<CtaVariant, string> = {
  // CTA primario sobre marinho: maior contraste da pagina.
  brass:
    "bg-brass text-navy-deep shadow-[0_10px_30px_-12px_oklch(0.79_0.095_80/70%)] hover:bg-[oklch(0.84_0.09_82)]",
  // CTA primario sobre marfim.
  navy: "bg-navy text-ivory shadow-[0_10px_30px_-14px_oklch(0.23_0.05_262/80%)] hover:bg-navy-soft",
  "outline-light": "border border-ivory/25 text-ivory hover:border-ivory/50 hover:bg-ivory/5",
  "outline-dark": "border border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/[0.03]",
};

export function ctaClassName(variant: CtaVariant, className?: string) {
  return cn(
    "group inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-medium tracking-[-0.005em] transition-[background-color,border-color,transform,box-shadow] duration-200 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass disabled:cursor-not-allowed disabled:opacity-60",
    ctaVariants[variant],
    className,
  );
}

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase",
        tone === "dark" ? "text-brass" : "text-brass-deep",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-70" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <FadeIn
      className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}
    >
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "mt-5 text-balance font-display text-4xl leading-[1.05] font-semibold tracking-[-0.01em] sm:text-5xl",
          tone === "dark" ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 text-pretty text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-ivory/70" : "text-ink-muted",
          )}
        >
          {description}
        </p>
      )}
    </FadeIn>
  );
}

export function Wordmark({ tone = "dark" }: { tone?: "light" | "dark" }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 items-center justify-center rounded-full border font-display text-lg leading-none font-semibold",
          tone === "dark" ? "border-brass/60 text-brass" : "border-brass-deep/50 text-brass-deep",
        )}
      >
        P
      </span>
      <span
        className={cn(
          "font-display text-2xl leading-none font-semibold tracking-[0.01em]",
          tone === "dark" ? "text-ivory" : "text-ink",
        )}
      >
        Prosec
      </span>
    </span>
  );
}

/**
 * Libera fundos WebGL/Canvas apenas no cliente, sem movimento reduzido e,
 * opcionalmente, a partir de uma largura minima (poupa GPU em celulares).
 */
export function useAnimatedBackground(minWidth = 0) {
  const shouldReduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setEnabled(false);
      return;
    }
    const query = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [minWidth, shouldReduceMotion]);

  return enabled;
}
