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
    <section id="como-funciona" className="relative overflow-hidden py-16 sm:py-24">
      <div className="relative mx-auto max-w-7xl px-6">
        <FadeIn className="max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
        </FadeIn>

        {/* Grade Horizontalizada: 3 Colunas dos Pilares lado a lado */}
        <StaggerContainer className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
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
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
            >
              {/* Cabecalho do Pilar */}
              <div className="flex flex-col gap-2 border-b border-border/70 bg-secondary/30 p-6">
                <span className="text-xs font-semibold tracking-wider text-gold uppercase">
                  {t(pillar.labelKey)}
                </span>
                <h3 className="font-serif text-lg font-medium text-neon-white leading-snug">
                  {t(pillar.taglineKey)}
                </h3>
              </div>

              {/* Recursos do Pilar */}
              <div className="flex flex-1 flex-col divide-y divide-border/60">
                {pillar.items.map((item) => (
                  <div
                    key={item.id}
                    id={item.id}
                    className="group relative flex flex-1 flex-col gap-3 p-6 transition-colors hover:bg-accent/30"
                  >
                    <item.header />
                    <h4 className="mt-4 font-serif text-base font-semibold text-neon-white-sm tracking-tight">
                      {t(item.titleKey)}
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {t(item.descriptionKey)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
