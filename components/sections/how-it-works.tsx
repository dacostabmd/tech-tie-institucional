"use client";

import {
  Users,
  Network,
  ChartColumn,
  LayoutDashboard,
  Sparkles,
  MessagesSquare,
} from "lucide-react";
import { FadeIn, StaggerContainer } from "@/components/layout/fade-in";
import { motion, useReducedMotion } from "motion/react";

// Tres pilares (CRM, Business Intelligence, IA para LegalTech), dois cards cada.
// A leitura em coluna (lg) segue os pilares: 1-4 CRM, 2-5 BI, 3-6 IA.
const items = [
  {
    icon: Users,
    label: "CRM jurídico",
    title: "Gestão de clientes e carteira",
    description:
      "Clientes, partes, processos, prazos e tarefas em um só lugar, com histórico completo de relacionamento, responsáveis por caso e automação de notificações.",
  },
  {
    icon: ChartColumn,
    label: "Business Intelligence",
    title: "BI integrado ao CRM",
    description:
      "Painéis nativos sobre carteira, prazos, produtividade e risco, sem exportar planilhas nem conectar ferramentas externas. Decisões baseadas nos dados do próprio escritório.",
  },
  {
    icon: Sparkles,
    label: "IA para LegalTech",
    title: "Risco e resumos por IA",
    description:
      "Cada movimentação é classificada automaticamente — urgente (penhora, bloqueio, leilão), positiva ou rotineira — e resumida em linguagem objetiva, priorizando a fila de trabalho da equipe.",
  },
  {
    icon: Network,
    label: "CRM jurídico",
    title: "Acompanhamento processual unificado",
    description:
      "Busca pelo número CNJ em 27 tribunais estaduais e federais e varredura por CPF ou CNPJ em múltiplas bases, com os andamentos vinculados ao cadastro do cliente.",
  },
  {
    icon: LayoutDashboard,
    label: "Business Intelligence",
    title: "Indicadores de gestão",
    description:
      "Volume de processos por área, tribunal e fase, concentração de risco e carga por advogado, para direcionar equipe, prioridades e investimento.",
  },
  {
    icon: MessagesSquare,
    label: "IA para LegalTech",
    title: "Assistente jurídico conversacional",
    description:
      "IA treinada em contexto jurídico e processual: consulte a carteira, peça resumos e encontre informações em linguagem natural, direto no CRM.",
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

        <StaggerContainer className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.01 : 0.55 },
                },
              }}
              className="group relative flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-accent/40"
            >
              <span className="text-xs font-semibold tracking-wider text-gold uppercase">
                {item.label}
              </span>
              <div className="flex size-10 items-center justify-center rounded-lg border border-gold-soft/25 bg-gold-muted">
                <item.icon className="size-5 text-gold" strokeWidth={1.75} />
              </div>
              <h3 className="font-serif text-lg font-medium text-neon-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
