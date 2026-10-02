"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Ilustracao do painel (dados ficticios): mostra o produto "em acao" no hero,
// pratica recorrente nas paginas B2B de maior conversao.

type Risk = "urgent" | "positive" | "routine";

const riskLabel: Record<Risk, string> = {
  urgent: "Urgente",
  positive: "Positiva",
  routine: "Rotineira",
};

const riskChip: Record<Risk, string> = {
  urgent: "bg-risk-urgent/10 text-risk-urgent ring-risk-urgent/25",
  positive: "bg-risk-positive/10 text-risk-positive ring-risk-positive/25",
  routine: "bg-risk-routine/10 text-risk-routine ring-risk-routine/25",
};

const events: Array<{ risk: Risk; title: string; cnj: string; court: string }> = [
  {
    risk: "urgent",
    title: "Penhora on-line determinada",
    cnj: "1002345-67.2026.8.26.0100",
    court: "TJSP",
  },
  {
    risk: "urgent",
    title: "Leilão designado",
    cnj: "5001234-11.2025.4.03.6100",
    court: "TRF3",
  },
  {
    risk: "positive",
    title: "Arquivamento definitivo",
    cnj: "0801122-33.2024.8.19.0001",
    court: "TJRJ",
  },
  {
    risk: "routine",
    title: "Juntada de petição",
    cnj: "5009876-54.2025.8.13.0024",
    court: "TJMG",
  },
];

export function CasePanel() {
  const shouldReduceMotion = useReducedMotion();
  const appear = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0.01 : 0.5, delay: shouldReduceMotion ? 0 : delay },
  });

  return (
    <motion.figure
      {...appear(0.35)}
      className="relative w-full max-w-[520px] justify-self-center lg:justify-self-end"
    >
      {/* Moldura em camadas: profundidade sem sombras pesadas. */}
      <div
        aria-hidden="true"
        className="absolute -inset-3 rounded-[22px] border border-ivory/10 bg-ivory/[0.02]"
      />
      <div className="relative overflow-hidden rounded-2xl bg-ivory text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-rule px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              {!shouldReduceMotion && (
                <span className="absolute inset-0 animate-ping rounded-full bg-risk-positive/60" />
              )}
              <span className="relative size-2 rounded-full bg-risk-positive" />
            </span>
            <span className="text-[13px] font-medium">Movimentações de hoje</span>
          </div>
          <span className="font-mono text-[11px] text-ink-muted">4 novas · 27 tribunais</span>
        </div>

        <ul className="divide-y divide-rule">
          {events.map((event, index) => (
            <motion.li
              key={event.cnj}
              {...appear(0.6 + index * 0.18)}
              className="flex items-center gap-4 px-5 py-3.5"
            >
              <span
                className={cn(
                  "w-[76px] shrink-0 rounded-md px-2 py-1 text-center text-[11px] font-semibold ring-1",
                  riskChip[event.risk],
                )}
              >
                {riskLabel[event.risk]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <p className="truncate font-mono text-[11px] text-ink-muted">
                  {event.cnj} · {event.court}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div {...appear(1.5)} className="border-t border-rule bg-paper px-5 py-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] text-brass-deep uppercase">
            <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Resumo executivo · IA
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink/80">
            Penhora on-line de valores determinada no processo 1002345-67. Prazo
            para manifestação em curso — análise prioritária recomendada.
          </p>
        </motion.div>
      </div>
      <figcaption className="mt-5 text-center text-[11px] text-ivory/45">
        Ilustração do painel com dados fictícios.
      </figcaption>
    </motion.figure>
  );
}
