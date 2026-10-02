"use client";

import {
  HeaderGestao,
  HeaderTribunais,
  HeaderBi,
  HeaderIndicadores,
  HeaderRisco,
  HeaderChat,
} from "@/components/sections/card-headers";
import { FadeIn, StaggerContainer } from "@/components/layout/fade-in";
import { motion, useReducedMotion } from "motion/react";

// Faixas por pilar: cada linha traz o pilar (CRM, Business Intelligence, IA para
// LegalTech) a esquerda e dois recursos a direita, cada um com um cabecalho animado.
const pillars = [
  {
    label: "CRM jurídico",
    tagline: "Organize a operação do escritório.",
    items: [
      {
        header: HeaderGestao,
        title: "Gestão de clientes e carteira",
        description:
          "Clientes, partes, processos, prazos e tarefas em um só lugar, com histórico completo de relacionamento, responsáveis por caso e automação de notificações.",
      },
      {
        header: HeaderTribunais,
        title: "Acompanhamento processual unificado",
        description:
          "Busca pelo número CNJ em 27 tribunais estaduais e federais e varredura por CPF ou CNPJ em múltiplas bases, com os andamentos vinculados ao cadastro do cliente.",
      },
    ],
  },
  {
    label: "Business Intelligence",
    tagline: "Enxergue os números que importam.",
    items: [
      {
        header: HeaderBi,
        title: "BI integrado ao CRM",
        description:
          "Painéis nativos sobre carteira, prazos, produtividade e risco, sem exportar planilhas nem conectar ferramentas externas. Decisões baseadas nos dados do próprio escritório.",
      },
      {
        header: HeaderIndicadores,
        title: "Indicadores de gestão",
        description:
          "Volume de processos por área, tribunal e fase, concentração de risco e carga por advogado, para direcionar equipe, prioridades e investimento.",
      },
    ],
  },
  {
    label: "IA para LegalTech",
    tagline: "Acelere o trabalho da equipe.",
    items: [
      {
        header: HeaderRisco,
        title: "Risco e resumos por IA",
        description:
          "Cada movimentação é classificada automaticamente — urgente (penhora, bloqueio, leilão), positiva ou rotineira — e resumida em linguagem objetiva, priorizando a fila de trabalho da equipe.",
      },
      {
        header: HeaderChat,
        title: "Assistente jurídico conversacional",
        description:
          "IA treinada em contexto jurídico e processual: consulte a carteira, peça resumos e encontre informações em linguagem natural, direto no CRM.",
      },
    ],
  },
];

export function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="como-funciona" className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl">
            Três pilares em uma única plataforma
          </h2>
          <p className="mt-4 text-muted-foreground">
            CRM jurídico para organizar a operação, Business Intelligence para
            enxergá-la e inteligência artificial para LegalTech para
            acelerá-la — integrados desde a base, não remendados com
            ferramentas externas.
          </p>
        </FadeIn>

        <StaggerContainer className="mt-16 flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.label}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.01 : 0.55 },
                },
              }}
              className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]"
            >
              <div className="flex flex-col gap-3 bg-card p-7 sm:col-span-2 lg:col-span-1">
                <h3 className="text-xs font-semibold tracking-wider text-gold uppercase">
                  {pillar.label}
                </h3>
                <p className="font-serif text-lg font-medium text-neon-white">
                  {pillar.tagline}
                </p>
              </div>

              {pillar.items.map((item) => (
                <div
                  key={item.title}
                  className="group relative flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-accent/40"
                >
                  <item.header />
                  <h4 className="font-serif text-lg font-medium text-neon-white">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
