import type { Metadata } from "next";
import { ComingSoon } from "@/components/sections/coming-soon";

export const metadata: Metadata = {
  title: "Produtos",
};

export default function ProdutosPage() {
  return (
    <ComingSoon
      title="Nossos produtos"
      description="Em breve, o detalhamento completo das soluções TechTie: CRM, dashboards de BI, enriquecimento de dados e muito mais."
    />
  );
}
