"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { BeamsCanvasProps } from "./beams-canvas";

// O shader fica fora do bundle inicial e so e carregado com o navegador
// ocioso: a headline (LCP) nunca compete com o WebGL.
const BeamsCanvas = dynamic(() => import("./beams-canvas"), { ssr: false });

// Uma vez exibida nesta sessao da aba, a cena pula o idle-delay e o fade:
// evita o "piscar" ao remontar (troca de idioma, back/forward do navegador).
let shownOnce = false;

/**
 * Cena do hero (React Bits "Beams", adaptado): logo dourada e circuitos, desenhados
 * em WebGL sobre transparente. Entra em fade quando o primeiro frame fica pronto;
 * o fundo visual vem do Grainient, por baixo.
 */
export function Beams({ className, ...props }: BeamsCanvasProps) {
  const [mounted, setMounted] = useState(shownOnce);
  const [ready, setReady] = useState(shownOnce);

  useEffect(() => {
    if (shownOnce) return;
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
          onReady={() => {
            shownOnce = true;
            setReady(true);
          }}
          className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}
        />
      )}
    </div>
  );
}
