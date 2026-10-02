"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import BlurText from "@/components/react-bits/blur-text";
import RotatingText from "@/components/react-bits/rotating-text";
import { CNJ_PLACEHOLDER, formatCnj, isCompleteCnj } from "@/lib/cnj";
import { whatsappHref } from "@/lib/site-config";
import { CasePanel } from "./case-panel";
import { useLead } from "./lead-context";
import { ctaClassName, useAnimatedBackground } from "./primitives";

// WebGL fica fora do bundle inicial: nao atrasa o LCP (headline).
const Threads = dynamic(() => import("@/components/react-bits/threads"), { ssr: false });

const audiences = [
  "advogados autônomos",
  "escritórios de contencioso",
  "departamentos jurídicos",
  "consultores",
];

const reassurances = ["Busca por CNJ gratuita", "Sem compromisso", "Conforme a LGPD"];

const trustFacts = [
  { value: "27", label: "tribunais estaduais e federais" },
  { value: "14", label: "bases em varredura paralela" },
  { value: "IA", label: "classificação de risco e resumos" },
  { value: "LGPD", label: "sigilo profissional preservado" },
];

function HeroBackdrop() {
  const showThreads = useAnimatedBackground(768);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Base estatica: tambem e o fallback sem WebGL / movimento reduzido. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,oklch(0.32_0.06_262),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_60%_50%_at_30%_100%,oklch(0.79_0.095_80/10%),transparent_70%)]" />
      {showThreads && (
        // Duas mascaras aninhadas: some nas bordas verticais e a esquerda,
        // para as linhas nunca cruzarem headline/subtitulo.
        <div className="absolute inset-x-0 top-[18%] h-[75%] opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
          <div className="size-full [mask-image:linear-gradient(to_right,transparent_35%,black_70%)]">
            <Threads color={[0.86, 0.72, 0.45]} amplitude={1.1} distance={0.15} />
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,var(--f-navy))]" />
    </div>
  );
}

function CnjQuickForm() {
  const { requestAccess } = useLead();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Campo vazio nao bloqueia: o visitante segue para o cadastro mesmo assim.
    if (value && !isCompleteCnj(value)) {
      setError("O número CNJ tem 20 dígitos. Confira e tente novamente.");
      return;
    }
    setError(null);
    requestAccess(value);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl">
      <label htmlFor="hero-cnj" className="mb-2.5 block text-sm text-ivory/70">
        Comece pelo número de um processo
      </label>
      <div className="flex flex-col gap-2 rounded-xl bg-ivory/[0.06] p-1.5 ring-1 ring-ivory/15 transition-shadow focus-within:ring-brass/70 sm:flex-row">
        <input
          id="hero-cnj"
          name="cnj"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => {
            setValue(formatCnj(e.target.value));
            if (error) setError(null);
          }}
          placeholder={CNJ_PLACEHOLDER}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "hero-cnj-error" : undefined}
          className="h-12 min-w-0 flex-1 rounded-lg bg-transparent px-4 font-mono text-[15px] tracking-wide text-ivory outline-none placeholder:text-ivory/30"
        />
        <button type="submit" data-cta="hero-cnj" className={ctaClassName("brass", "shrink-0")}>
          Consultar grátis
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
      {error && (
        <p id="hero-cnj-error" role="alert" className="mt-2 text-sm text-[oklch(0.8_0.12_40)]">
          {error}
        </p>
      )}
      <p className="mt-3 text-sm text-ivory/60">
        Prefere buscar por CPF ou CNPJ?{" "}
        <button
          type="button"
          onClick={() => requestAccess()}
          className="font-medium text-brass underline decoration-brass/40 underline-offset-4 hover:decoration-brass"
        >
          Solicite a varredura
        </button>{" "}
        ou{" "}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="hero-demo"
          className="font-medium text-ivory underline decoration-ivory/30 underline-offset-4 hover:decoration-ivory"
        >
          agende uma demonstração
        </a>
        .
      </p>
    </form>
  );
}

export function FormalHero() {
  const shouldReduceMotion = useReducedMotion();
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: shouldReduceMotion ? 0.01 : 0.6,
      delay: shouldReduceMotion ? 0 : delay,
      ease: [0.21, 0.47, 0.32, 0.98] as const,
    },
  });

  return (
    <section id="inicio" className="relative overflow-hidden bg-navy text-ivory">
      <HeroBackdrop />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pt-32 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-40 lg:pb-24">
        <div className="flex flex-col items-start">
          <motion.p
            {...fade(0)}
            className="flex flex-wrap items-center gap-x-2 text-[11px] font-semibold tracking-[0.22em] text-brass uppercase"
          >
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-70" />
            Monitoramento processual para
            <RotatingText texts={audiences} className="text-ivory" />
          </motion.p>

          <BlurText
            as="h1"
            text="Nenhuma movimentação relevante fora do seu radar."
            delay={70}
            className="mt-6 max-w-[17ch] text-balance font-display text-5xl leading-[1.02] font-semibold tracking-[-0.015em] text-ivory sm:text-6xl lg:text-[4.25rem]"
          />

          <motion.p
            {...fade(0.25)}
            className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-ivory/75"
          >
            A Prosec unifica a consulta em 27 tribunais, rastreia CPF e CNPJ em
            14 bases em paralelo e classifica cada andamento por risco — com
            resumos executivos gerados por IA, em um único painel.
          </motion.p>

          <motion.div {...fade(0.4)} className="mt-10 w-full">
            <CnjQuickForm />
          </motion.div>

          <motion.ul
            {...fade(0.5)}
            className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ivory/70"
          >
            {reassurances.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-brass" strokeWidth={2.25} aria-hidden="true" />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <CasePanel />
      </div>

      <div className="relative border-t border-ivory/10">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 px-6 lg:grid-cols-4">
          {trustFacts.map((fact, index) => (
            <motion.div
              key={fact.label}
              {...fade(0.6 + index * 0.08)}
              className="flex flex-col-reverse justify-end gap-1 border-ivory/10 py-6 pr-4 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <dt className="text-sm text-ivory/60">{fact.label}</dt>
              <dd className="font-display text-3xl leading-none font-semibold text-brass">
                {fact.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
