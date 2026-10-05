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
import { useTranslations } from "next-intl";

// Faixas por pilar: cada linha traz o pilar (CRM e automacao, Business
// Intelligence, IA) a esquerda e dois recursos a direita, cada um com um
// cabecalho animado.
const pillars = [
  {
    id: "crm-automacao",
    labelKey: "pillarCrmLabel",
    taglineKey: "pillarCrmTagline",
    items: [
      {
        id: "gestao-clientes",
        header: HeaderGestao,
        titleKey: "itemClientsTitle",
        descriptionKey: "itemClientsDescription",
      },
      {
        id: "automacoes-integracoes",
        header: HeaderTribunais,
        titleKey: "itemLawsuitsTitle",
        descriptionKey: "itemLawsuitsDescription",
      },
    ],
  },
  {
    id: "business-intelligence",
    labelKey: "pillarBiLabel",
    taglineKey: "pillarBiTagline",
    items: [
      {
        id: "bi-integrado",
        header: HeaderBi,
        titleKey: "itemBiTitle",
        descriptionKey: "itemBiDescription",
      },
      {
        id: "indicadores-gestao",
        header: HeaderIndicadores,
        titleKey: "itemIndicatorsTitle",
        descriptionKey: "itemIndicatorsDescription",
      },
    ],
  },
  {
    id: "ia",
    labelKey: "pillarIaLabel",
    taglineKey: "pillarIaTagline",
    items: [
      {
        id: "classificacao-resumos-ia",
        header: HeaderRisco,
        titleKey: "itemRiskTitle",
        descriptionKey: "itemRiskDescription",
      },
      {
        id: "assistente-ia",
        header: HeaderChat,
        titleKey: "itemAssistantTitle",
        descriptionKey: "itemAssistantDescription",
      },
    ],
  },
];

export function HowItWorks() {
  const t = useTranslations("HowItWorks");
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="como-funciona" className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("intro")}</p>
        </FadeIn>

        <StaggerContainer className="mt-16 flex flex-col gap-px overflow-hidden rounded-xl border border-border bg-border">
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.id}
              id={pillar.id}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.01 : 0.25 },
                },
              }}
              className="grid scroll-mt-8 grid-cols-1 gap-px bg-border sm:grid-cols-2 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,1fr)]"
            >
              <div className="flex flex-col gap-3 bg-card p-7 sm:col-span-2 lg:col-span-1">
                <h3 className="text-xs font-semibold tracking-wider text-gold uppercase">
                  {t(pillar.labelKey)}
                </h3>
                <p className="font-serif text-lg font-medium text-neon-white">
                  {t(pillar.taglineKey)}
                </p>
              </div>

              {pillar.items.map((item) => (
                <div
                  key={item.id}
                  id={item.id}
                  className="group relative flex scroll-mt-8 flex-col gap-4 bg-card p-7 transition-colors hover:bg-accent/40"
                >
                  <item.header />
                  <h4 className="font-serif text-lg font-medium text-neon-white">
                    {t(item.titleKey)}
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(item.descriptionKey)}
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
