"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FadeIn, StaggerContainer } from "@/components/layout/fade-in";

// Layout "grade com filtros": pills de categoria acima de um grid de cards
// (ilustracao + titulo). Reaproveitado em /servicos e /produtos com
// categorias e itens proprios de cada pagina.
export interface FilteredGridItem<Category extends string> {
  id: string;
  category: Category;
  Illustration: ComponentType;
  title: string;
}

export interface FilteredGridProps<Category extends string> {
  eyebrow: string;
  heading: string;
  intro: string;
  filters: { key: Category | "all"; label: string }[];
  items: FilteredGridItem<Category>[];
  placeholderNote?: string;
  itemBadge?: ReactNode;
}

export function FilteredGrid<Category extends string>({
  eyebrow,
  heading,
  intro,
  filters,
  items,
  placeholderNote,
}: FilteredGridProps<Category>) {
  const shouldReduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Category | "all">("all");

  const filtered = items.filter((item) => filter === "all" || item.category === filter);

  return (
    <section className="relative scroll-mt-8 py-24 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        <FadeIn className="max-w-2xl">
          <span className="text-xs font-semibold tracking-[0.18em] text-gold-soft uppercase">
            {eyebrow}
          </span>
          <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-neon-white sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-4 text-muted-foreground">{intro}</p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-10 flex flex-wrap gap-2">
          {filters.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-gold text-white"
                    : "border border-border text-foreground/70 hover:border-gold-soft/50 hover:text-gold-soft"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </FadeIn>

        <StaggerContainer
          key={filter}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: shouldReduceMotion ? 0.01 : 0.25 },
                },
              }}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card/70 p-6"
            >
              <div className="flex items-center justify-center rounded-xl border border-border/60 bg-background/40 p-6">
                <item.Illustration />
              </div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              {placeholderNote && (
                <span className="w-fit rounded-full border border-gold-soft/30 bg-background/50 px-2.5 py-0.5 text-[0.65rem] tracking-wide text-gold-soft/80 uppercase">
                  {placeholderNote}
                </span>
              )}
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
