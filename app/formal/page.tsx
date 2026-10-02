import type { Metadata } from "next";
import { LeadProvider } from "@/components/formal/lead-context";
import { FormalNavbar } from "@/components/formal/navbar";
import { FormalHero } from "@/components/formal/hero";
import { FormalProblem } from "@/components/formal/problem";
import { FormalHowItWorks } from "@/components/formal/how-it-works";
import { FormalFeatures } from "@/components/formal/features";
import { FormalProof } from "@/components/formal/proof";
import { FormalSecurity } from "@/components/formal/security";
import { FormalFaq } from "@/components/formal/faq";
import { FormalFinalCta } from "@/components/formal/final-cta";
import { FormalFooter } from "@/components/formal/footer";
import { FormalStickyCta } from "@/components/formal/sticky-cta";

// Variante formal da landing page. Fica fora do indice e aponta o canonical
// para "/" ate ser promovida (ou usada em teste A/B), evitando conteudo duplicado.
export const metadata: Metadata = {
  title: "Acompanhamento processual com rigor institucional",
  description:
    "Consulta unificada em 27 tribunais, varredura por CPF/CNPJ em 14 bases e classificacao de risco por IA. Comece com a busca CNJ gratuita.",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

// Estrutura: Problema -> Solucao -> Prova -> CTA, com um unico CTA primario
// ("Consultar gratis") repetido ao longo da pagina.
export default function FormalPage() {
  return (
    <LeadProvider>
      <FormalNavbar />
      <main className="flex-1">
        <FormalHero />
        <FormalProblem />
        <FormalHowItWorks />
        <FormalFeatures />
        <FormalProof />
        <FormalSecurity />
        <FormalFaq />
        <FormalFinalCta />
      </main>
      <FormalFooter />
      <FormalStickyCta />
    </LeadProvider>
  );
}
