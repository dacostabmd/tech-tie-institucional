"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Home, Boxes, TrendingUp, MessageCircle, Building2, type LucideIcon } from "lucide-react";
import { whatsappHref } from "@/lib/site-config";
import { LanguageSwitcher } from "@/components/sections/language-switcher";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/solucoes": Boxes,
  "/resultados": TrendingUp,
  "/contato": MessageCircle,
  "/sobre": Building2,
};

/**
 * Trilho de navegacao em pill, so com icones (lucide-react) e tooltip com o
 * nome da pagina. O indicador animado (fundo + traco no topo) desliza entre
 * os itens via layoutId, seguindo o item ativo pela rota atual. Reaproveitado
 * identico no desktop (topo) e mobile (rodape).
 */
function NavPill({ className, layoutId }: { className?: string; layoutId: string }) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const links = [
    { href: "/", label: t("home") },
    { href: "/solucoes", label: t("solucoes") },
    { href: "/resultados", label: t("resultados") },
    { href: "/contato", label: t("contato") },
    { href: "/sobre", label: t("sobre") },
  ];

  return (
    <nav
      aria-label="Principal"
      className={`flex items-center gap-1 rounded-full border border-border bg-card/80 p-1.5 backdrop-blur-md ${className ?? ""}`}
    >
      {links.map((link) => {
        const active = pathname === link.href;
        const Icon = NAV_ICONS[link.href];
        return (
          <Tooltip key={link.href}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                prefetch
                aria-label={link.label}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-10 items-center justify-center gap-2 rounded-full px-3 transition-colors xl:px-4 ${
                  active ? "text-white" : "text-foreground/80 hover:text-gold-soft"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={layoutId}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.01 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                    className="absolute inset-0 overflow-hidden rounded-full bg-gold"
                  >
                    <span className="absolute inset-x-3 top-0.5 h-[2px] rounded-full bg-white/70" />
                  </motion.span>
                )}
                <Icon className="relative size-[1.125rem] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span className="relative hidden text-sm xl:inline">{link.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="xl:hidden">{link.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  const t = useTranslations("Navbar");
  const barRef = useRef<HTMLDivElement>(null);

  // Altura real do header (varia com fonte/zoom/breakpoint): publicada como
  // variavel CSS para o layout reservar o espaco exato no topo do <main>.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const setVar = () => {
      document.documentElement.style.setProperty("--header-h", `${bar.offsetHeight}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-20">
      <div
        ref={barRef}
        className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-4 px-6 py-6"
      >
        <Link href="/" className="flex items-center" aria-label={t("logoAriaLabel")}>
          <Image
            src="/techtie-logo-horizontal-gold.svg"
            alt="TechTie"
            width={371.1}
            height={100}
            unoptimized
            priority
            className="h-10 w-auto"
          />
        </Link>

        <NavPill className="hidden md:flex" layoutId="nav-pill-active-desktop" />

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gold-soft/60 px-5 py-2.5 text-sm text-gold-soft transition-colors hover:bg-gold-muted"
          >
            <span className="sm:hidden">{t("ctaShort")}</span>
            <span className="hidden sm:inline">{t("ctaLong")}</span>
          </a>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4 md:hidden">
        <NavPill className="shadow-2xl shadow-black/40" layoutId="nav-pill-active-mobile" />
      </div>
    </header>
  );
}
