"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { motion, useReducedMotion } from "motion/react";
import { whatsappHref } from "@/lib/site-config";
import { LanguageSwitcher } from "@/components/sections/language-switcher";

/**
 * Trilho de navegacao em pill com indicador animado: o realce (fundo + traco
 * no topo) desliza entre os itens via layoutId, seguindo o item ativo pela
 * rota atual. Reaproveitado identico no desktop (topo) e mobile (rodape).
 */
function NavPill({ className, layoutId }: { className?: string; layoutId: string }) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const links = [
    { href: "/", label: t("home") },
    { href: "/produtos", label: t("produtos") },
    { href: "/servicos", label: t("servicos") },
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
        return (
          <Link
            key={link.href}
            href={link.href}
            prefetch
            aria-current={active ? "page" : undefined}
            className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
              active ? "text-gold-foreground" : "text-foreground/80 hover:text-gold-soft"
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
                <span className="absolute inset-x-3 top-0.5 h-[2px] rounded-full bg-gold-foreground/70" />
              </motion.span>
            )}
            <span className="relative">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  const t = useTranslations("Navbar");

  return (
    <header className="relative z-20">
      <div className="mx-auto flex w-full max-w-[96rem] items-center justify-between gap-4 px-6 py-6">
        <Link href="/" className="flex items-center gap-3" aria-label={t("logoAriaLabel")}>
          <Image src="/techtie-app-icon.svg" alt="" width={32} height={32} unoptimized priority />
          <span className="text-xl font-semibold tracking-[0.2em] text-gold-soft">TECHTIE</span>
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
