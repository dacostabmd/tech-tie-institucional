import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/layout/fade-in";
import CountUp from "@/components/react-bits/count-up";
import { TestimonialCarousel } from "@/components/sections/testimonial-carousel";

// Metricas ilustrativas de automacao/infraestrutura da operacao do grupo,
// a validar e substituir por numeros reais quando disponiveis.
const METRICS = [
  { to: 120, labelKey: "metricAutomationLabel", suffixKey: "metricAutomationSuffix" },
  { to: 450, labelKey: "metricHoursLabel", suffixKey: "metricHoursSuffix" },
  { to: 99.9, labelKey: "metricUptimeLabel", suffixKey: "metricUptimeSuffix" },
] as const;

/** Nossos Resultados: metricas de automacao e depoimentos de empresas parceiras. */
export async function Results() {
  const t = await getTranslations("Results");

  return (
    <>
      <section id="nossos-resultados" className="relative scroll-mt-8 py-24 sm:py-32">
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <FadeIn>
            <span className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
              {t("eyebrow")}
            </span>
            <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl">
              {t("heading")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("intro")}</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <dl className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {METRICS.map((metric) => (
                <div
                  key={metric.labelKey}
                  className="rounded-2xl border border-border bg-card/60 px-6 py-8"
                >
                  <dt className="order-2 mt-2 text-sm text-muted-foreground">
                    {t(metric.labelKey)}
                  </dt>
                  <dd className="order-1 font-serif text-4xl font-semibold text-gold-warm">
                    <CountUp to={metric.to} />
                    {t(metric.suffixKey)}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      <section className="relative py-12 sm:py-16">
        <div className="relative mx-auto max-w-5xl px-6">
          <FadeIn className="max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-neon-white sm:text-3xl">
              {t("testimonialsHeading")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("testimonialsIntro")}</p>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-10">
            <TestimonialCarousel />
          </FadeIn>
        </div>
      </section>

      <section className="relative py-24 sm:py-32">
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-neon-white sm:text-3xl">
              {t("ctaHeading")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("ctaParagraph")}</p>
            <Link
              href="/contato"
              className="mt-8 inline-flex items-center justify-center rounded-xl border border-gold-soft/60 px-6 py-3 text-sm text-gold-soft transition-colors hover:bg-gold-muted"
            >
              {t("ctaButton")}
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
