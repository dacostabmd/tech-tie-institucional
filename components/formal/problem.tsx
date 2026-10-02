"use client";

import { motion, useReducedMotion } from "motion/react";
import { StaggerContainer } from "@/components/layout/fade-in";
import { SectionHeading } from "./primitives";

// Problema -> Solucao -> Prova -> CTA: a pagina abre nomeando a dor do leitor.
const pains = [
  {
    numeral: "I",
    title: "Portais dispersos",
    description:
      "Cada tribunal com seu sistema, login e formato. A conferência diária vira uma rotina de abas abertas e planilhas paralelas.",
  },
  {
    numeral: "II",
    title: "Sinal misturado ao ruído",
    description:
      "Penhoras, bloqueios e leilões chegam lado a lado com juntadas rotineiras — e o que é urgente se perde na lista.",
  },
  {
    numeral: "III",
    title: "Leitura que consome a equipe",
    description:
      "Andamentos extensos exigem horas de leitura antes de qualquer decisão, tempo que deixa de ir para a estratégia do caso.",
  },
];

export function FormalProblem() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="O desafio"
          title="Acompanhar processos manualmente custa tempo — e expõe o escritório a riscos."
        />

        <StaggerContainer className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0">
          {pains.map((pain) => (
            <motion.article
              key={pain.numeral}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.01 : 0.55 } },
              }}
              className="border-t border-rule pt-8 md:border-t-0 md:border-l md:px-8 md:pt-0 md:first:border-l-0 md:first:pl-0"
            >
              <span className="font-display text-5xl leading-none font-medium text-brass-deep/70">
                {pain.numeral}
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold text-ink">{pain.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{pain.description}</p>
            </motion.article>
          ))}
        </StaggerContainer>

        <p className="mt-16 max-w-3xl border-l-2 border-brass-deep pl-6 font-display text-2xl leading-snug text-ink italic sm:text-3xl">
          A Prosec reúne, classifica e resume os andamentos — para que a equipe
          dedique o tempo ao que exige análise jurídica.
        </p>
      </div>
    </section>
  );
}
