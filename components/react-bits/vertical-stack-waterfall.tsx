"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  siAngular,
  siDocker,
  siFastapi,
  siFirebase,
  siFlutter,
  siGraphql,
  siHostinger,
  siLangchain,
  siMongodb,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRedis,
  siSupabase,
  siTailwindcss,
  siTypescript,
} from "simple-icons";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface TechItem {
  name: string;
  category: string;
  path: string;
}

const COL_1: TechItem[] = [
  { name: "N8N", category: "Automação", path: siN8n.path },
  { name: "LangChain", category: "Agentes IA", path: siLangchain.path },
  { name: "PostgreSQL", category: "Banco de Dados", path: siPostgresql.path },
  { name: "Next.js", category: "Full Stack", path: siNextdotjs.path },
  { name: "Python", category: "Engenharia IA", path: siPython.path },
  { name: "TypeScript", category: "Arquitetura", path: siTypescript.path },
  { name: "Docker", category: "Infraestrutura", path: siDocker.path },
  { name: "FastAPI", category: "APIs & Microsserviços", path: siFastapi.path },
  { name: "Redis", category: "Cache & Filas", path: siRedis.path },
  { name: "Tailwind CSS", category: "Design System", path: siTailwindcss.path },
];

const COL_2: TechItem[] = [
  { name: "Supabase", category: "Backend & Auth", path: siSupabase.path },
  { name: "Node.js", category: "Backend", path: siNodedotjs.path },
  { name: "React", category: "Interfaces", path: siReact.path },
  { name: "Flutter", category: "Mobile", path: siFlutter.path },
  { name: "Firebase", category: "Cloud Realtime", path: siFirebase.path },
  { name: "Angular", category: "Enterprise", path: siAngular.path },
  { name: "Hostinger", category: "Cloud & VPS", path: siHostinger.path },
  { name: "Prisma", category: "ORM", path: siPrisma.path },
  { name: "MongoDB", category: "NoSQL", path: siMongodb.path },
  { name: "GraphQL", category: "APIs", path: siGraphql.path },
];

function WaterfallColumn({
  items,
  duration = 28,
  className,
}: {
  items: TechItem[];
  duration?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  // Duplicamos os itens para um loop contínuo perfeito sem interrupções
  const stream = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="flex flex-col gap-3.5 pb-3.5"
        initial={{ y: "-50%" }}
        animate={shouldReduceMotion ? { y: "0%" } : { y: "0%" }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {stream.map((tech, idx) => (
          <Tooltip key={`${tech.name}-${idx}`}>
            <TooltipTrigger asChild>
              <div className="group relative flex cursor-default items-center gap-3 rounded-xl border border-border/70 bg-card/45 p-3 backdrop-blur-md transition-all duration-300 hover:border-gold-soft/70 hover:bg-card/85 hover:shadow-[0_0_16px_rgba(233,195,95,0.22)]">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-gold-soft/30 bg-gold-muted/30 text-gold-warm transition-transform duration-300 group-hover:scale-105 group-hover:border-gold-soft/60 group-hover:bg-gold-muted/50">
                  <svg
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label={tech.name}
                    className="size-5 fill-current"
                  >
                    <path d={tech.path} />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground/95 transition-colors group-hover:text-gold-soft sm:text-sm">
                    {tech.name}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground sm:text-[11px]">
                    {tech.category}
                  </p>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold text-gold-soft">{tech.name}</p>
              <p className="text-xs text-muted-foreground">{tech.category}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </motion.div>
    </div>
  );
}

export function VerticalStackWaterfall({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-[480px] w-full max-w-[22rem] overflow-hidden rounded-2xl border border-border/60 bg-card/25 p-2.5 shadow-2xl backdrop-blur-lg sm:h-[540px] lg:h-[600px] lg:max-w-[26rem]",
        "[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]",
        className,
      )}
    >
      <div className="grid h-full grid-cols-2 gap-2.5 sm:gap-3">
        <WaterfallColumn items={COL_1} duration={26} />
        <WaterfallColumn items={COL_2} duration={32} className="pt-8 sm:pt-12" />
      </div>
    </div>
  );
}
