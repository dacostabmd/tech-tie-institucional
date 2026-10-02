"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { BeamsCanvasProps } from "./beams-canvas";

// O shader fica fora do bundle inicial e so e carregado com o navegador
// ocioso: a headline (LCP) nunca compete com o WebGL.
const BeamsCanvas = dynamic(() => import("./beams-canvas"), { ssr: false });

/**
 * Fundo "Beams" (React Bits). Camadas:
 * 1. fallback CSS estatico — aparece de imediato, sem JS e sem WebGL;
 * 2. canvas WebGL animado — entra em fade sobre o fallback quando pronto.
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
      const id = w.requestIdleCallback(() => setMounted(true), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          ready ? "opacity-0" : "opacity-100",
        )}
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 6%, rgba(160,32,28,0.12) 9%, transparent 13%, transparent 20%, rgba(230,235,245,0.06) 23%, transparent 27%)",
        }}
      />
      {mounted && (
        <BeamsCanvas
          {...props}
          onReady={() => setReady(true)}
          className="absolute inset-0 animate-[beams-in_1.2s_ease-out_both]"
        />
      )}
    </div>
  );
}
