"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { BeamsCanvasProps } from "./beams-canvas";

// O shader fica fora do bundle inicial e so e carregado com o navegador
// ocioso: a headline (LCP) nunca compete com o WebGL.
const BeamsCanvas = dynamic(() => import("./beams-canvas"), { ssr: false });

/**
 * Cena do hero (React Bits "Beams", adaptado): logo dourada e circuitos, desenhados
 * em WebGL sobre transparente. Entra em fade quando o primeiro frame fica pronto;
 * o fundo visual vem do Grainient, por baixo.
 */
export function Beams({ className, ...props }: BeamsCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMounted(true), { timeout: 200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      {mounted && (
        <BeamsCanvas
          {...props}
          onReady={() => setReady(true)}
          className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}
