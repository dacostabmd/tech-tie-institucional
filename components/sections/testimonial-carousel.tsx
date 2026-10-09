"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

// Depoimentos ilustrativos de empresas do grupo/holding, a substituir por
// casos reais (nome, cargo, empresa, foto e citacao) quando disponiveis.
interface TestimonialItem {
  key: "testimonial1" | "testimonial2" | "testimonial3";
  name: string;
  initials: string;
  photo?: string;
  photoPosition?: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    key: "testimonial1",
    name: "Felipe Cardoso",
    initials: "FC",
    photo: "/felip.png",
    photoPosition: "50% 50%",
  },
  {
    key: "testimonial2",
    name: "Handerson Sales",
    initials: "HS",
    photo: "/handerson-sales.png",
    photoPosition: "50% 20%",
  },
  {
    key: "testimonial3",
    name: "Ana Caroline Carvalho",
    initials: "AC",
    photo: "/ana-caroline.jpg",
    photoPosition: "50% 20%",
  },
];

export function TestimonialCarousel() {
  const t = useTranslations("Results");
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(((next % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[index];
  const quote = t(`${current.key}Quote`);
  const role = t(`${current.key}Role`);
  const company = t(`${current.key}Company`);

  return (
    <div className="relative mx-auto max-w-4xl">
      <div className="relative min-h-[20rem] sm:min-h-[22rem]">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 * direction, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 * direction, filter: "blur(4px)" }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.35, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            {/* Ícone de aspas dourado */}
            <div className="mb-6 flex justify-center text-gold-soft/80 sm:mb-8">
              <Quote className="size-10 sm:size-12 stroke-[1.2] fill-gold-soft/10 text-gold-soft" aria-hidden="true" />
            </div>

            {/* Citação em destaque */}
            <p className="font-serif text-xl leading-relaxed font-medium text-neon-white sm:text-2xl md:text-[1.85rem] md:leading-snug">
              “{quote}”
            </p>

            {/* Autor / Cargo / Empresa */}
            <div className="mt-8 flex items-center justify-center gap-3.5 sm:mt-10">
              {current.photo ? (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-gold-soft/50 bg-card shadow-md sm:size-14">
                  <Image
                    src={current.photo}
                    alt={current.name}
                    fill
                    sizes="60px"
                    quality={95}
                    unoptimized
                    className="object-cover"
                    style={{ objectPosition: current.photoPosition ?? "50% 50%" }}
                  />
                </div>
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-gold-soft/50 bg-card text-base font-semibold text-gold-warm sm:size-14">
                  {current.initials}
                </div>
              )}

              <div className="text-left">
                <p className="text-sm font-semibold text-foreground sm:text-base">{current.name}</p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {role} · {company}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de Navegação */}
      <div className="mt-8 flex items-center justify-center gap-4 sm:mt-12">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label={t("prevLabel")}
          className="rounded-full border border-border/80 bg-card/40 p-2.5 text-foreground/70 backdrop-blur-sm transition-colors hover:border-gold-soft/60 hover:text-gold-soft"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-2">
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name + i}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-gold-soft" : "w-2 bg-border hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label={t("nextLabel")}
          className="rounded-full border border-border/80 bg-card/40 p-2.5 text-foreground/70 backdrop-blur-sm transition-colors hover:border-gold-soft/60 hover:text-gold-soft"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
