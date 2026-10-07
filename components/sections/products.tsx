"use client";

import { useTranslations } from "next-intl";
import { FilteredGrid, type FilteredGridItem } from "@/components/sections/filtered-grid";
import {
  ChatBoltIcon,
  CrmIcon,
  DashboardIcon,
  DataEnrichIcon,
  GearsIcon,
  IconDefs,
  ScalesIcon,
} from "@/components/sections/hero-icons";

// Grade de produtos ilustrativos, a substituir por cases reais. Cada item
// reaproveita os icones do hero (mesmas solucoes anunciadas na Home).
type Category = "crm" | "bi" | "automacao";

const PRODUCTS: Omit<FilteredGridItem<Category>, "title">[] = [
  { id: "crm", category: "crm", Illustration: CrmIcon },
  { id: "data-enrich", category: "crm", Illustration: DataEnrichIcon },
  { id: "dashboards", category: "bi", Illustration: DashboardIcon },
  { id: "operations", category: "bi", Illustration: GearsIcon },
  { id: "automation", category: "automacao", Illustration: ChatBoltIcon },
  { id: "sites", category: "automacao", Illustration: ScalesIcon },
];

const PRODUCT_TITLE_KEYS: Record<string, string> = {
  crm: "productCrmTitle",
  "data-enrich": "productDataEnrichTitle",
  dashboards: "productDashboardsTitle",
  operations: "productOperationsTitle",
  automation: "productAutomationTitle",
  sites: "productSitesTitle",
};

export function Products() {
  const t = useTranslations("Products");

  return (
    <>
      <IconDefs />
      <FilteredGrid
        eyebrow={t("eyebrow")}
        heading={t("heading")}
        intro={t("intro")}
        placeholderNote={t("placeholderNote")}
        filters={[
          { key: "all", label: t("filterAll") },
          { key: "crm", label: t("filterCrm") },
          { key: "bi", label: t("filterBi") },
          { key: "automacao", label: t("filterAutomacao") },
        ]}
        items={PRODUCTS.map((product) => ({
          ...product,
          title: t(PRODUCT_TITLE_KEYS[product.id]),
        }))}
      />
    </>
  );
}
