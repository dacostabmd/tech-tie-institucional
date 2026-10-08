"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StackIconsRowProps {
  icons: { name: string; path: string }[];
  /** Duracao total de uma volta do brilho passando por todos os icones. */
  sweepDuration?: number;
  className?: string;
}

/**
 * Fileira de logos (React Bits, estilo "marquee" estatico): todas as tecnologias
 * ficam visiveis ao mesmo tempo, em goldenrod, com um brilho neon leve que
 * percorre os icones em sequencia (scanner), em loop continuo. Cada icone tem
 * um tooltip com o nome da tecnologia.
 */
export function StackIconsRow({ icons, sweepDuration = 4, className }: StackIconsRowProps) {
  const shouldReduceMotion = useReducedMotion();
  const step = sweepDuration / icons.length;

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
      {icons.map((icon, i) => (
        <Tooltip key={icon.name}>
          <TooltipTrigger asChild>
            <motion.svg
              viewBox="0 0 24 24"
              role="img"
              aria-label={icon.name}
              tabIndex={0}
              className="size-[2.90625em] shrink-0 fill-current text-gold-warm outline-none"
              initial={false}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      filter: [
                        "drop-shadow(0 0 0px currentColor)",
                        "drop-shadow(0 0 5px currentColor)",
                        "drop-shadow(0 0 0px currentColor)",
                      ],
                    }
              }
              transition={{
                duration: sweepDuration * 0.35,
                delay: i * step,
                repeat: Infinity,
                repeatDelay: sweepDuration - sweepDuration * 0.35,
                ease: "easeInOut",
              }}
            >
              <path d={icon.path} />
            </motion.svg>
          </TooltipTrigger>
          <TooltipContent>{icon.name}</TooltipContent>
        </Tooltip>
      ))}
    </span>
  );
}
