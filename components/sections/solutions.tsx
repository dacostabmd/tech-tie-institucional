"use client";

import { useTranslations } from "next-intl";
import { FilteredGrid, type FilteredGridItem } from "@/components/sections/filtered-grid";
import {
  HeaderGestao,
  HeaderTribunais,
  HeaderBi,
  HeaderIndicadores,
  HeaderRisco,
  HeaderChat,
} from "@/components/sections/card-headers";

// Grade de solucoes ilustrativas, a substituir por cases reais. Cada item
// pertence a um dos 3 pilares (mesmos de "Como funciona" na Home) e reaproveita
// os cabecalhos animados ja existentes como ilustracao do card.
type Pillar = "crm" | "bi" | "ia";

const PROJECTS: Omit<FilteredGridItem<Pillar>, "title">[] = [
  { id: "crm-1", category: "crm", Illustration: HeaderGestao },
  { id: "crm-2", category: "crm", Illustration: HeaderTribunais },
  { id: "bi-1", category: "bi", Illustration: HeaderBi },
  { id: "bi-2", category: "bi", Illustration: HeaderIndicadores },
  { id: "ia-1", category: "ia", Illustration: HeaderRisco },
  { id: "ia-2", category: "ia", Illustration: HeaderChat },
];

const PROJECT_TITLE_KEYS: Record<string, string> = {
  "crm-1": "projectCrmTitle",
  "crm-2": "projectAutomationTitle",
  "bi-1": "projectBiTitle",
  "bi-2": "projectIndicatorsTitle",
  "ia-1": "projectClassificationTitle",
  "ia-2": "projectAssistantTitle",
};

export function Solutions() {
  const t = useTranslations("Solutions");

  return (
    <FilteredGrid
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      intro={t("intro")}
      placeholderNote={t("placeholderNote")}
      filters={[
        { key: "all", label: t("filterAll") },
        { key: "crm", label: t("filterCrm") },
        { key: "bi", label: t("filterBi") },
        { key: "ia", label: t("filterIa") },
      ]}
      items={PROJECTS.map((project) => ({
        ...project,
        title: t(PROJECT_TITLE_KEYS[project.id]),
      }))}
    />
  );
}
