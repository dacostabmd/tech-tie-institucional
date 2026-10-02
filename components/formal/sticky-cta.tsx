"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/site-config";
import { ACCESS_SECTION_ID, useLead } from "./lead-context";
import { ctaClassName } from "./primitives";

/**
 * CTA persistente: barra inferior no mobile (testes A/B de sticky CTA
 * reportam ganhos de ~20%) e botao flutuante de WhatsApp no desktop.
 * Some no hero (que ja tem CTA) e quando o formulario final esta visivel.
 */
export function FormalStickyCta() {
  const { requestAccess } = useLead();
  const shouldReduceMotion = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const form = document.getElementById(ACCESS_SECTION_ID);
    if (!hero || !form) return;

    const heroObserver = new IntersectionObserver(([entry]) =>
      setPastHero(!entry.isIntersecting),
    );
    const formObserver = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    heroObserver.observe(hero);
    formObserver.observe(form);
    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !formVisible;
  const motionProps = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    transition: { duration: shouldReduceMotion ? 0.01 : 0.25 },
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mobile"
          {...motionProps}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-navy/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden"
        >
          <div className="flex gap-2">
            <button
              type="button"
              data-cta="sticky-mobile"
              onClick={() => requestAccess()}
              className={ctaClassName("brass", "flex-1")}
            >
              Consultar processo grátis
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              data-cta="sticky-whatsapp"
              className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-ivory/20 text-ivory"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      )}
      {visible && (
        <motion.a
          key="desktop"
          {...motionProps}
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          data-cta="float-whatsapp"
          className="fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full border border-brass/40 bg-navy text-brass shadow-[0_16px_40px_-12px_rgba(0,0,0,0.5)] transition-colors hover:bg-navy-soft md:flex"
        >
          <MessageCircle className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
