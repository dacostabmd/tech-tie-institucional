import { getTranslations } from "next-intl/server";
import { LeadForm } from "@/components/sections/lead-form";
import { FadeIn } from "@/components/layout/fade-in";

/** Cadastro: destino de "Agendar consulta gratuita" e do link "Contato" do menu. */
export async function LeadSection() {
  const t = await getTranslations("LeadSection");

  return (
    <section id="cadastro" className="relative scroll-mt-8 py-24 sm:py-32">
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <FadeIn className="max-w-xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("paragraph")}</p>
          <p className="mt-6 text-xs text-muted-foreground">{t("disclaimer")}</p>
        </FadeIn>

        <FadeIn className="w-full rounded-2xl border border-border bg-card/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-8 lg:ml-auto lg:max-w-md">
          <h3 className="font-serif text-2xl font-semibold tracking-tight text-neon-white">
            {t("formHeading")}
          </h3>
          <p className="mt-3 mb-6 text-sm text-muted-foreground">{t("formSubheading")}</p>
          <LeadForm />
        </FadeIn>
      </div>
    </section>
  );
}
