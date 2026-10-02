"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLead } from "./lead-context";
import { ctaClassName, Wordmark } from "./primitives";

const links = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#seguranca", label: "Segurança" },
  { href: "#duvidas", label: "Dúvidas" },
];

export function FormalNavbar() {
  const { requestAccess } = useLead();
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-ivory/10 bg-navy/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        <Link href="#inicio" aria-label="TechTie — início">
          <Wordmark tone="dark" />
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-ivory/70 transition-colors hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <button
            type="button"
            data-cta="navbar"
            onClick={() => requestAccess()}
            className={ctaClassName("brass", "h-10 px-5 text-sm")}
          >
            Consultar grátis
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="formal-mobile-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="flex size-10 items-center justify-center rounded-lg border border-ivory/15 text-ivory md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="formal-mobile-menu"
            aria-label="Navegação principal mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.25 }}
            className="overflow-hidden border-t border-ivory/10 md:hidden"
          >
            <ul className="flex flex-col px-6 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-base text-ivory/80 hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <button
                  type="button"
                  data-cta="navbar-mobile"
                  onClick={() => {
                    setOpen(false);
                    requestAccess();
                  }}
                  className={ctaClassName("brass", "w-full")}
                >
                  Consultar processo grátis
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
