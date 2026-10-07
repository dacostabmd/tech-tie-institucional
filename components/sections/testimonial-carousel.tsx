"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Depoimentos ilustrativos de empresas do grupo/holding, a substituir por
// casos reais (nome, cargo, empresa, foto e citacao) quando disponiveis.
const TESTIMONIALS = [
  {
    quote:
      "A automação com N8N eliminou boa parte do trabalho manual da nossa operação comercial. Hoje a equipe foca em vender, não em preencher planilha.",
    name: "Nome do Responsável",
    role: "Diretor(a) Comercial",
    company: "Empresa Parceira I — Holding",
    initials: "EP",
  },
  {
    quote:
      "Os dashboards de BI sob medida deram visibilidade que a gente nunca teve: hoje decidimos com dado, não com achismo.",
    name: "Nome do Responsável",
    role: "CEO",
    company: "Empresa Parceira II — Holding",
    initials: "EP",
  },
  {
    quote:
      "O assistente de IA treinado no nosso contexto virou parte do time. Resume, classifica e prioriza o que realmente importa todos os dias.",
    name: "Nome do Responsável",
    role: "Gerente de Operações",
    company: "Empresa Parceira III — Holding",
    initials: "EP",
  },
];

export function TestimonialCarousel() {
  const t = useTranslations("Results");
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(((next % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[index];

  return (
    <div className="relative">
      <span className="absolute top-4 right-4 z-10 rounded-full border border-gold-soft/30 bg-background/70 px-3 py-1 text-[0.65rem] tracking-wide text-gold-soft/80 uppercase backdrop-blur-sm sm:top-6 sm:right-6">
        {t("testimonialPlaceholderNote")}
      </span>

      <div className="overflow-hidden rounded-2xl border border-border bg-card/70 shadow-2xl shadow-black/40 backdrop-blur-md">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 40 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -40 * direction }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="grid min-h-[22rem] grid-cols-1 sm:min-h-[26rem] sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]"
          >
            <div className="flex items-center justify-center bg-gradient-to-br from-gold-muted to-transparent p-10 sm:p-14">
              <div className="flex aspect-square w-full max-w-[12rem] items-center justify-center rounded-full border border-gold-soft/40 bg-card text-4xl font-semibold text-gold-warm">
                {current.initials}
              </div>
            </div>

            <div className="flex flex-col justify-center gap-6 p-8 sm:p-12">
              <Quote className="size-8 text-gold-soft/60" strokeWidth={1.5} aria-hidden="true" />
              <p className="font-serif text-xl leading-relaxed font-medium text-neon-white sm:text-2xl">
                “{current.quote}”
              </p>
              <div>
                <p className="font-semibold text-foreground">{current.name}</p>
                <p className="text-sm text-muted-foreground">
                  {current.role} · {current.company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label={t("prevLabel")}
          className="rounded-full border border-border p-2 text-foreground/70 transition-colors hover:border-gold-soft/60 hover:text-gold-soft"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name + i}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1}`}
              aria-current={i === index}
              className={`size-2 rounded-full transition-colors ${
                i === index ? "bg-gold-soft" : "bg-border"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label={t("nextLabel")}
          className="rounded-full border border-border p-2 text-foreground/70 transition-colors hover:border-gold-soft/60 hover:text-gold-soft"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
