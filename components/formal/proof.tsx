"use client";

import { motion, useReducedMotion } from "motion/react";
import CountUp from "@/components/react-bits/count-up";
import { SectionHeading } from "./primitives";

// Numeros ilustrativos. AJUSTAR COM DADOS REAIS antes da publicacao.
const metrics = [
  { value: 27, suffix: "", label: "Tribunais estaduais e federais integrados" },
  { value: 14, suffix: "", label: "Bases consultadas em paralelo por CPF/CNPJ" },
  { value: 120000, suffix: "+", label: "Processos monitorados na plataforma" },
  { value: 85, suffix: "%", label: "Redução média no tempo de triagem manual" },
];

// ATENCAO: depoimentos ficticios para demonstracao de layout.
// SUBSTITUIR por depoimentos reais e autorizados antes de publicar — exigencia OAB.
const testimonials = [
  {
    quote:
      "A classificação automática por risco mudou a ordem do nosso dia: começamos pelo que realmente exige atenção.",
    name: "C. M.",
    role: "Sócia, escritório de contencioso",
  },
  {
    quote:
      "A unificação da busca reduziu bastante o tempo que a equipe gastava consolidando andamentos manualmente.",
    name: "F. A.",
    role: "Advogado, direito cível",
  },
];

export function FormalProof() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="numeros" className="relative overflow-hidden bg-navy py-24 text-ivory sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_100%_0%,oklch(0.79_0.095_80/8%),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          tone="dark"
          eyebrow="Em números"
          title="Escala para a rotina de escritórios e departamentos jurídicos."
        />

        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: index * 0.08 }}
              className="flex flex-col-reverse justify-end gap-3 border-t border-ivory/15 pt-6"
            >
              <dt className="text-sm leading-relaxed text-ivory/65">{metric.label}</dt>
              <dd className="font-display text-5xl leading-none font-semibold text-brass sm:text-6xl">
                <CountUp to={metric.value} duration={2.2} />
                {metric.suffix}
              </dd>
            </motion.div>
          ))}
        </dl>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
          {testimonials.map((t, index) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.55, delay: index * 0.1 }}
              className="flex flex-col justify-between rounded-2xl border border-ivory/10 bg-ivory/[0.03] p-8"
            >
              <blockquote className="font-display text-2xl leading-snug text-ivory italic sm:text-[1.7rem]">
                <span aria-hidden="true" className="mr-1 text-brass">
                  &ldquo;
                </span>
                {t.quote}
                <span aria-hidden="true" className="text-brass">
                  &rdquo;
                </span>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-ivory/10 pt-5">
                <span className="flex size-10 items-center justify-center rounded-full border border-brass/40 font-display text-base font-semibold text-brass">
                  {t.name.replace(/[\s.]/g, "")}
                </span>
                <span>
                  <span className="block text-sm font-medium text-ivory">{t.name}</span>
                  <span className="block text-xs text-ivory/55">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-10 text-xs text-ivory/40">
          Números e depoimentos ilustrativos — substituir por dados reais e
          relatos autorizados antes da publicação.
        </p>
      </div>
    </section>
  );
}
