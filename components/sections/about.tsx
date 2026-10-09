import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/layout/fade-in";
import { ProfileCard } from "@/components/react-bits/profile-card";
import { HorizontalStackMarquee } from "@/components/react-bits/horizontal-stack-marquee";
import { Award, Building2, Scale, Sparkles } from "lucide-react";

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
      </div>
    </section>
  );
}
