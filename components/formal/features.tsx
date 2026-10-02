"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MessagesSquare, SearchCheck, Settings2, Sparkles, Workflow, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SpotlightCard from "@/components/react-bits/spotlight-card";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./primitives";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  /** Cartao horizontal de largura total (texto + visual lado a lado). */
  wide?: boolean;
  visual?: ReactNode;
};

function RiskVisual() {
  const rows = [
    { label: "Urgente", items: "Penhora · Bloqueio · Leilão", tone: "bg-risk-urgent" },
    { label: "Positiva", items: "Arquivamento · Extinção", tone: "bg-risk-positive" },
    { label: "Rotineira", items: "Juntada · Conclusão", tone: "bg-risk-routine" },
  ];
  return (
    <ul className="mt-8 space-y-2.5">
      {rows.map((row) => (
        <li
          key={row.label}
          className="flex items-center gap-3 rounded-lg border border-rule bg-ivory px-4 py-3"
        >
          <span className={cn("size-2 shrink-0 rounded-full", row.tone)} aria-hidden="true" />
          <span className="w-20 text-sm font-semibold text-ink">{row.label}</span>
          <span className="truncate text-sm text-ink-muted">{row.items}</span>
        </li>
      ))}
    </ul>
  );
}

function SummaryVisual() {
  return (
    <div className="mt-8 rounded-lg border border-rule bg-ivory p-4" aria-hidden="true">
      <div className="h-2 w-3/4 rounded bg-ink/10" />
      <div className="mt-2 h-2 w-full rounded bg-ink/10" />
      <div className="mt-2 h-2 w-5/6 rounded bg-ink/10" />
      <div className="mt-4 h-2 w-1/2 rounded bg-brass-deep/30" />
    </div>
  );
}

function IntegrationVisual() {
  return (
    <ul className="mt-8 flex flex-wrap gap-2 lg:mt-0 lg:max-w-sm lg:justify-end">
      {["CRM do escritório", "Gestão jurídica", "Notificações automáticas"].map((item) => (
        <li
          key={item}
          className="rounded-full border border-rule bg-ivory px-4 py-2 text-sm text-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

const features: Feature[] = [
  {
    icon: Gauge,
    title: "Classificação automática de risco",
    description:
      "Cada movimentação é analisada e sinalizada como urgente, positiva ou rotineira — a equipe começa o dia pelo que exige atenção.",
    className: "sm:col-span-2",
    visual: <RiskVisual />,
  },
  {
    icon: Sparkles,
    title: "Resumos executivos por IA",
    description:
      "Sínteses técnicas e objetivas de andamentos extensos, para leitura rápida e decisão fundamentada.",
    visual: <SummaryVisual />,
  },
  {
    icon: SearchCheck,
    title: "Busca CNJ gratuita",
    description: "Consulte qualquer processo pelo número único CNJ, sem custo, em 27 tribunais.",
  },
  {
    icon: Workflow,
    title: "Varredura em 14 bases",
    description: "Rastreamento simultâneo por CPF ou CNPJ para localizar processos vinculados a uma parte.",
  },
  {
    icon: MessagesSquare,
    title: "Chat jurídico especializado",
    description: "Assistente conversacional com contexto processual para consultas rápidas sobre os casos.",
  },
  {
    icon: Settings2,
    title: "Automação e integração com CRM",
    description:
      "Notificações automatizadas e integração com as ferramentas de gestão jurídica e o CRM do escritório.",
    className: "sm:col-span-2 lg:col-span-3",
    wide: true,
    visual: <IntegrationVisual />,
  },
];

export function FormalFeatures() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="recursos" className="relative bg-ivory py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Recursos"
          title="Tudo o que o acompanhamento processual exige, em um único painel."
          description="Da localização do processo à leitura executiva, sem alternar entre portais."
        />

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: shouldReduceMotion ? 0.01 : 0.5,
                delay: shouldReduceMotion ? 0 : (index % 3) * 0.08,
              }}
              className={feature.className}
            >
              <SpotlightCard
                spotlightColor="rgba(130, 90, 39, 0.10)"
                className="h-full rounded-2xl border border-rule bg-paper/60 p-7 transition-colors hover:border-brass-deep/30 sm:p-8"
              >
                <div
                  className={cn(feature.wide && "lg:flex lg:items-center lg:justify-between lg:gap-10")}
                >
                  <div>
                    <span className="flex size-11 items-center justify-center rounded-full border border-brass-deep/30 text-brass-deep">
                      <feature.icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-semibold text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-prose leading-relaxed text-ink-muted">
                      {feature.description}
                    </p>
                  </div>
                  {feature.visual}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
