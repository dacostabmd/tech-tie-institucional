"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

// Liga os CTAs espalhados pela pagina ao formulario final: qualquer CTA pode
// levar o visitante ate #acesso, ja com o numero CNJ digitado no hero.

type LeadContextValue = {
  cnj: string;
  setCnj: (value: string) => void;
  requestAccess: (cnj?: string) => void;
};

const LeadContext = createContext<LeadContextValue | null>(null);

export const ACCESS_SECTION_ID = "acesso";
export const ACCESS_FIRST_FIELD_ID = "lead-name";
export const ACCESS_FORM_CARD_ID = "acesso-formulario";

export function LeadProvider({ children }: { children: ReactNode }) {
  const [cnj, setCnj] = useState("");

  const requestAccess = useCallback((value?: string) => {
    if (value !== undefined) setCnj(value);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Desktop: secao inteira (copy + formulario lado a lado). Mobile: direto ao
    // cartao do formulario, que fica abaixo do texto.
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    document
      .getElementById(isDesktop ? ACCESS_SECTION_ID : ACCESS_FORM_CARD_ID)
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });

    window.setTimeout(
      () => document.getElementById(ACCESS_FIRST_FIELD_ID)?.focus({ preventScroll: true }),
      reduceMotion ? 0 : 700,
    );
  }, []);

  const value = useMemo(() => ({ cnj, setCnj, requestAccess }), [cnj, requestAccess]);

  return <LeadContext.Provider value={value}>{children}</LeadContext.Provider>;
}

export function useLead() {
  const context = useContext(LeadContext);
  if (!context) throw new Error("useLead deve ser usado dentro de <LeadProvider>.");
  return context;
}
