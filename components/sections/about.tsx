import { getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/layout/fade-in";
import { ProfileCard } from "@/components/react-bits/profile-card";
import { VerticalStackWaterfall } from "@/components/react-bits/vertical-stack-waterfall";
import { Award, Building2, Scale, Sparkles } from "lucide-react";

/** Sobre a TechTie: destino da rota "/sobre" com ProfileCard do Dr. Bruno Durão e storytelling institucional. */
export async function About() {
  const t = await getTranslations("About");

  return (
    <section id="sobre-a-techtie" className="relative scroll-mt-8 py-16 sm:py-24">
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
                title="Fundador & Sócio"
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

        {/* Seção complementar: Engenharia e Stack Tecnológico com Cascata */}
        <div className="mt-24 border-t border-border/60 pt-16 sm:mt-32 sm:pt-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <FadeIn>
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
                  <Sparkles className="size-3.5 text-gold-warm" />
                  <span>Stack & Engenharia</span>
                </div>
                <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-neon-white sm:text-3xl">
                  Tecnologia de ponta a ponta para operações de alta escala
                </h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Nossa infraestrutura combina agentes de inteligência artificial autônomos, pipelines de automação em N8N e LangChain, bancos de dados em alta disponibilidade e interfaces fluidas em Next.js e Flutter.
                </p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  Cada componente é selecionado para garantir segurança de dados corporativos, disponibilidade contínua e integração nativa com os sistemas centrais do seu negócio.
                </p>
              </FadeIn>
            </div>

            <div className="flex justify-center lg:col-span-5">
              <FadeIn delay={0.15}>
                <VerticalStackWaterfall />
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
