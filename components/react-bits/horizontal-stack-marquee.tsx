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

const ROW_1: TechItem[] = [
  { name: "LangChain", category: "Agentes & IA", path: siLangchain.path },
  { name: "Python", category: "IA & Engenharia", path: siPython.path },
  { name: "PostgreSQL", category: "Banco Relacional", path: siPostgresql.path },
  { name: "Next.js", category: "Full Stack & Web", path: siNextdotjs.path },
  { name: "TypeScript", category: "Arquitetura", path: siTypescript.path },
  { name: "FastAPI", category: "APIs & Microsserviços", path: siFastapi.path },
  { name: "Supabase", category: "Backend & Auth", path: siSupabase.path },
  { name: "Docker", category: "Containers & Deploy", path: siDocker.path },
  { name: "Redis", category: "Cache & Filas", path: siRedis.path },
  { name: "Tailwind CSS", category: "Design System", path: siTailwindcss.path },
];

const ROW_2: TechItem[] = [
  { name: "React", category: "Interfaces Reativas", path: siReact.path },
  { name: "Node.js", category: "Runtime Backend", path: siNodedotjs.path },
  { name: "Flutter", category: "Mobile Multiplataforma", path: siFlutter.path },
  { name: "Firebase", category: "Cloud & Realtime", path: siFirebase.path },
  { name: "GraphQL", category: "APIs Flexíveis", path: siGraphql.path },
  { name: "Prisma", category: "ORM & Migrations", path: siPrisma.path },
  { name: "MongoDB", category: "NoSQL & Documentos", path: siMongodb.path },
  { name: "Angular", category: "Sistemas Enterprise", path: siAngular.path },
  { name: "Hostinger", category: "Cloud & VPS", path: siHostinger.path },
];

function MarqueeRow({
  items,
  reverse = false,
  duration = 38,
}: {
  items: TechItem[];
  reverse?: boolean;
  duration?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const stream = [...items, ...items, ...items];

  return (
    <div className="flex overflow-hidden py-1.5">
      <motion.div
        className="flex shrink-0 items-center gap-3.5"
        initial={{ x: reverse ? "-33.33%" : "0%" }}
        animate={shouldReduceMotion ? { x: "0%" } : { x: reverse ? "0%" : "-33.33%" }}
        transition={{
          duration: shouldReduceMotion ? 0.01 : duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {stream.map((tech, idx) => (
          <Tooltip key={`${tech.name}-${idx}`}>
            <TooltipTrigger asChild>
              <div className="group relative flex h-[4.25rem] w-[15rem] shrink-0 cursor-default items-center gap-3.5 rounded-2xl border border-border/70 bg-card/60 p-3 backdrop-blur-md transition-all duration-300 hover:border-gold-soft/80 hover:bg-card/90 hover:shadow-[0_0_20px_rgba(233,195,95,0.22)]">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gold-soft/30 bg-gold-muted/30 text-gold-warm transition-transform duration-300 group-hover:scale-105 group-hover:border-gold-soft/60 group-hover:bg-gold-muted/60">
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
                  <p className="truncate text-sm font-semibold text-foreground/95 transition-colors group-hover:text-gold-soft">
                    {tech.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
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

export function HorizontalStackMarquee({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-3",
        "[mask-image:linear-gradient(to_right,transparent_0%,black_6%,black_94%,transparent_100%)]",
        className,
      )}
    >
      <div className="flex flex-col gap-2.5">
        <MarqueeRow items={ROW_1} duration={36} />
        <MarqueeRow items={ROW_2} reverse duration={42} />
      </div>
    </div>
  );
}
