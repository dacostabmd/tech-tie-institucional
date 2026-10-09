"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  ChatBoltIcon,
  CrmIcon,
  DashboardIcon,
  DataEnrichIcon,
  GearsIcon,
  IconDefs,
  ScalesIcon,
} from "@/components/sections/hero-icons";
import { ShinyText } from "@/components/react-bits/shiny-text";
import { StackIconsRow } from "@/components/react-bits/stack-icons-row";
import { STACK_ICONS } from "@/components/sections/stack-icons";

// Solucoes em duas colunas, abaixo do texto, na coluna da esquerda. A logo fica na
// coluna da direita; os circuitos do WebGL ligam a logo aos tres cartoes da coluna
// de cartoes mais proxima dela (indices impares).
const cards: { key: string; href: string; Icon: ComponentType }[] = [
  { key: "cardCrm", href: "/solucoes", Icon: CrmIcon },
  { key: "cardDataEnrich", href: "/solucoes", Icon: DataEnrichIcon },
  { key: "cardLawsuits", href: "/solucoes", Icon: ScalesIcon },
  { key: "cardOperations", href: "/solucoes", Icon: GearsIcon },
  { key: "cardDashboards", href: "/solucoes", Icon: DashboardIcon },
  { key: "cardAutomation", href: "/solucoes", Icon: ChatBoltIcon },
];

/**
 * Hero. A cena WebGL (logo dourada, circuitos, piso) vive no fundo da pagina e se
 * ancora nos elementos marcados com `data-scene-anchor` (ver beams-canvas.tsx).
 * As ancoras ficam em wrappers sem transform, para a posicao lida ser a final.
 */
export function Hero() {
  const t = useTranslations("Hero");
  const shouldReduceMotion = useReducedMotion();
  const rise = (delay: number, distance = 24) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0.01 : 0.7, delay: shouldReduceMotion ? 0 : delay },
  });

  return (
    <section id="topo" className="relative flex min-h-[100svh] flex-col">
      <IconDefs />

      <div className="mx-auto grid w-full max-w-[96rem] flex-1 items-center gap-x-12 gap-y-8 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_auto]">
        {/* Coluna da esquerda: texto e cartoes de solucoes. */}
        <div className="flex flex-col items-start xl:mb-10">
          <motion.span
            {...rise(0)}
            className="mb-5 text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase"
          >
            {t("eyebrow")}
          </motion.span>

          <motion.h1
            {...rise(0.1)}
            className="text-balance leading-[1.12] tracking-wide uppercase"
          >
            <span className="block text-[clamp(1.5rem,2.2vw,2.35rem)] font-bold text-gold-soft">
              {t("titleLine1")}
            </span>
            <span className="mt-1 block text-[clamp(1.4rem,2vw,2.2rem)] font-light text-foreground/90">
              {t("titleLine2")}
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.2)}
            className="mt-6 max-w-md text-base leading-relaxed text-foreground/80"
          >
            {t.rich("paragraph", {
              brand: (chunks) => (
                <ShinyText className="font-semibold">{chunks}</ShinyText>
              ),
            })}
          </motion.p>

          <ul className="mt-8 grid w-full max-w-[34rem] grid-cols-2 gap-3">
            {cards.map(({ key, href, Icon }, i) => (
              <li
                key={key}
                // Ancora dos circuitos: so os cartoes da coluna da direita do grupo, a
                // que fica ao lado da logo (i impar).
                data-scene-anchor={i % 2 === 1 ? `card-${(i - 1) / 2}` : undefined}
                className="min-h-[7rem] transition-[filter] duration-300 focus-within:drop-shadow-[0_0_14px_rgba(233,195,95,0.35)] hover:drop-shadow-[0_0_14px_rgba(233,195,95,0.35)]"
              >
                <motion.div {...rise(0.3 + i * 0.07, 16)} className="h-full">
                  <Link
                    href={href}
                    className="hero-card group h-full min-h-[7rem] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-soft"
                  >
                    <span aria-hidden="true" className="hero-card-body" />
                    <span className="relative flex h-full flex-col justify-between gap-2 px-4 py-3">
                      <span className="flex items-start justify-between">
                        <span className="h-[3rem] w-[4rem]">
                          <Icon />
                        </span>
                        <ArrowUpRight
                          className="size-4 text-gold-soft/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-soft"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-[0.7rem] leading-snug font-medium tracking-[0.1em] text-gold-soft uppercase">
                        {t(key)}
                      </span>
                    </span>
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
          {/* Selo de stack tecnologico na coluna da esquerda, abaixo dos cartoes */}
          <motion.div
            {...rise(0.4)}
            className="mt-8 flex w-full max-w-[34rem] flex-col items-start gap-2.5"
          >
            <span className="text-xs font-semibold tracking-wider text-foreground/70 uppercase">
              {t("stackLabel")}
            </span>
            <StackIconsRow icons={STACK_ICONS} />
          </motion.div>
        </div>

        {/* Coluna da direita: reserva o espaco da logo (proporcao 4:5) desenhada pelo WebGL. */}
        <div
          data-scene-anchor="logo"
          aria-hidden="true"
          className="mx-auto aspect-[4/5] h-[min(40svh,22rem)] xl:mx-0 xl:mr-[4vw] xl:h-[min(52svh,34rem)]"
        />
      </div>

      <div data-scene-anchor="hero-end" className="relative z-10 flex justify-center px-6 pt-2 pb-6" />
    </section>
  );
}
