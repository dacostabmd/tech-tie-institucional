import type { Metadata } from "next";
import { ComingSoon } from "@/components/sections/coming-soon";

export const metadata: Metadata = {
  title: "Serviços",
};

export default function ServicosPage() {
  return (
    <ComingSoon
      title="Nossos serviços"
      description="Em breve, os detalhes dos serviços da TechTie: automações, integrações e inteligência artificial aplicada à sua operação."
    />
  );
}
