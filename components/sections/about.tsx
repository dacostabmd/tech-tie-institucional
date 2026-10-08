import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/layout/fade-in";

/** Sobre a TechTie: destino do link "Sobre a TechTie" do menu. */
export async function About() {
  const t = await getTranslations("About");

  return (
    <section id="sobre-a-techtie" className="relative scroll-mt-8 py-24 sm:py-32">
      <div className="relative mx-auto max-w-3xl px-6">
        <FadeIn>
          <span className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("paragraph1")}</p>
          <p className="mt-4 text-muted-foreground">{t("paragraph2")}</p>
        </FadeIn>
      </div>
    </section>
  );
}
