"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLead } from "./lead-context";
import { ctaClassName, SectionHeading, useAnimatedBackground } from "./primitives";

const ShapeGrid = dynamic(() => import("@/components/react-bits/shape-grid"), { ssr: false });

const steps = [
  {
    title: "Informe o processo",
    description: "Digite o número CNJ ou um CPF/CNPJ. A consulta por número CNJ é gratuita.",
  },
  {
    title: "Varredura unificada",
    description:
      "A Prosec consulta 27 tribunais estaduais e federais e rastreia 14 bases em paralelo.",
  },
  {
    title: "Receba o essencial",
    description:
      "Cada movimentação chega classificada por risco, acompanhada de um resumo executivo gerado por IA.",
  },
];

export function FormalHowItWorks() {
  const { requestAccess } = useLead();
  const shouldReduceMotion = useReducedMotion();
  const showGrid = useAnimatedBackground();

  return (
    <section id="como-funciona" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      {/* Grade milimetrada (React Bits Shape Grid): textura de documento tecnico. */}
      <div aria-hidden="true" className="absolute inset-0">
        {showGrid && (
          <ShapeGrid
            direction="diagonal"
            speed={0.15}
            squareSize={56}
            // Canvas 2D: cores em sRGB equivalentes a --f-ink, --f-brass-deep e --f-paper.
            borderColor="rgba(21, 31, 50, 0.07)"
            hoverFillColor="rgba(130, 90, 39, 0.08)"
            vignetteColor="rgb(243, 239, 230)"
          />
        )}
      </div>

      <div className="pointer-events-none relative mx-auto max-w-6xl px-6 [&_a,&_button]:pointer-events-auto">
        <SectionHeading
          eyebrow="Como funciona"
          title="Do número do processo à decisão, em três passos."
          align="center"
        />

        <ol className="relative mt-20 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {/* Linha que "assina" o fluxo ao entrar na tela. */}
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="absolute top-7 right-[16.66%] left-[16.66%] hidden h-px origin-left bg-brass-deep/40 md:block"
          />
          {steps.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.55,
                delay: shouldReduceMotion ? 0 : 0.25 + index * 0.3,
              }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="flex size-14 items-center justify-center rounded-full border border-brass-deep/40 bg-ivory font-display text-2xl font-semibold text-brass-deep shadow-[0_0_0_6px_var(--f-paper)]">
                {index + 1}
              </span>
              <h3 className="mt-6 font-display text-2xl font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-ink-muted">{step.description}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-16 flex flex-col items-center gap-3">
          <button
            type="button"
            data-cta="how-it-works"
            onClick={() => requestAccess()}
            className={ctaClassName("navy")}
          >
            Consultar meu primeiro processo
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
          <p className="text-sm text-ink-muted">Gratuito para consultas por número CNJ.</p>
        </div>
      </div>
    </section>
  );
}
