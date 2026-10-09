import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FadeIn, StaggerContainer } from "@/components/layout/fade-in";
import { ProfileCard } from "@/components/react-bits/profile-card";
import { HorizontalStackMarquee } from "@/components/react-bits/horizontal-stack-marquee";
import BlurText from "@/components/react-bits/blur-text";
import { StarBorder } from "@/components/react-bits/star-border";
import { ShinyText } from "@/components/react-bits/shiny-text";
import { Award, Building2, Scale, Sparkles, Workflow, Bot, LayoutGrid, ArrowUpRight } from "lucide-react";

const BUILD_ITEMS = [
  { icon: Workflow, key: "codeLawItem1" },
  { icon: Bot, key: "codeLawItem2" },
  { icon: LayoutGrid, key: "codeLawItem3" },
] as const;

/** Sobre a TechTie: destino da rota "/sobre" com ProfileCard do Dr. Bruno Durão e storytelling institucional. */
export async function About() {
  const t = await getTranslations("About");

  return (
    <section id="sobre-a-techtie" className="relative scroll-mt-8 pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Bloco Principal: ProfileCard 3D do Dr. Bruno Durão ao lado da dissertação */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Coluna da esquerda: Cartão 3D Holo do Dr. Bruno Durão */}
          <div className="flex justify-center lg:col-span-5 xl:col-span-5">
            <FadeIn delay={0.1}>
              <ProfileCard
                avatarUrl="/dr_bruno_sofa.png"
                miniAvatarUrl="/dr_bruno_sofa.png"
                name="Dr. Bruno Durão"
                title="Fundador"
                handle="brunodurao"
                status="BMD Holding · DAP Advocacia"
                contactText="Contato"
                behindGlowColor="rgba(233, 195, 95, 0.45)"
              />
            </FadeIn>
          </div>

          {/* Coluna da direita: Storytelling institucional */}
          <div className="lg:col-span-7 xl:col-span-7">
            <FadeIn>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
                  {t("eyebrow")}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl lg:text-[2.6rem] lg:leading-[1.18]">
                {t("heading")}
              </h1>

              {/* Credenciais em destaque */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-soft/40 bg-gold-muted/20 px-3 py-1 text-xs font-medium text-gold-soft backdrop-blur-sm">
                  <Building2 className="size-3.5 text-gold-warm" />
                  <span>{t("badgeHolding")}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-soft/40 bg-gold-muted/20 px-3 py-1 text-xs font-medium text-gold-soft backdrop-blur-sm">
                  <Award className="size-3.5 text-gold-warm" />
                  <span>{t("badgeExperience")}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-gold-soft/40 bg-gold-muted/20 px-3 py-1 text-xs font-medium text-gold-soft backdrop-blur-sm">
                  <Scale className="size-3.5 text-gold-warm" />
                  <span>{t("badgeOrigin")}</span>
                </div>
              </div>

              {/* Parágrafos de storytelling */}
              <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80 sm:text-[1.05rem]">
                <p>{t("paragraph1")}</p>
                <p>{t("paragraph2")}</p>
                <p className="text-foreground/90 font-normal">{t("paragraph3")}</p>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Seção complementar: Engenharia e Stack Tecnológico Lado a Lado */}
        <div className="mt-20 border-t border-border/60 pt-16 sm:mt-28 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
                <Sparkles className="size-3.5 text-gold-warm" />
                <span>{t("stackEyebrow")}</span>
              </div>
              <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-neon-white sm:text-3xl lg:text-4xl">
                {t("stackHeading")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("stackDescription1")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80 sm:text-base">
                {t("stackDescription2")}
              </p>
            </FadeIn>
          </div>

          <div className="mt-10 sm:mt-12">
            <FadeIn delay={0.15}>
              <HorizontalStackMarquee />
            </FadeIn>
          </div>
        </div>

        {/* Bloco "Código e Lei": manifesto institucional com CTA de diagnóstico */}
        <div className="mt-20 border-t border-border/60 pt-16 sm:mt-28 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
                <Scale className="size-3.5 text-gold-warm" />
                <span>{t("codeLawEyebrow")}</span>
              </div>
            </FadeIn>

            <BlurText
              as="h2"
              text={t("codeLawHeading")}
              className="mt-4 font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl lg:text-[2.6rem]"
            />

            <FadeIn delay={0.1}>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("codeLawSubheading")}
              </p>
            </FadeIn>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-4 text-base leading-relaxed text-foreground/80 sm:text-[1.05rem]">
            <FadeIn delay={0.15}>
              <p>{t("codeLawParagraph1")}</p>
            </FadeIn>
          </div>

          <StaggerContainer className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {BUILD_ITEMS.map(({ icon: Icon, key }) => (
              <FadeIn key={key} y={16}>
                <div className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card/80 p-6 text-center shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:border-gold-soft/50">
                  <span className="flex size-11 items-center justify-center rounded-full bg-gold-muted/20 text-gold-warm">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-medium text-foreground/90 sm:text-base">{t(key)}</p>
                </div>
              </FadeIn>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.1}>
            <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted-foreground sm:text-base">
              {t("codeLawParagraph2")}
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-10 flex justify-center">
            <StarBorder>
              <Link
                href="/#cadastro"
                className="flex items-center gap-2 rounded-[calc(var(--radius-lg)-1px)] px-7 py-3.5 text-sm font-semibold sm:text-base"
              >
                <ShinyText>{t("codeLawCta")}</ShinyText>
                <ArrowUpRight className="size-4 text-gold-warm" aria-hidden="true" />
              </Link>
            </StarBorder>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
