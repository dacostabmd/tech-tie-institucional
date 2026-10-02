import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Wordmark } from "./primitives";

const institutionalLinks = [
  { href: "#", label: "Sobre a TechTie" },
  { href: "#", label: "Política de privacidade" },
  { href: "#", label: "Termos de uso" },
];

const pageLinks = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#seguranca", label: "Segurança" },
  { href: "#duvidas", label: "Dúvidas" },
];

export function FormalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ivory/10 bg-navy-deep pb-28 text-ivory md:pb-0">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Wordmark tone="dark" />
            <p className="mt-5 text-sm leading-relaxed text-ivory/60">
              Plataforma de acompanhamento processual jurídico inteligente para
              advogados, consultores e escritórios de advocacia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Página</p>
              <ul className="mt-4 space-y-2.5">
                {pageLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-ivory/65 hover:text-ivory">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brass uppercase">
                Institucional
              </p>
              <ul className="mt-4 space-y-2.5">
                {institutionalLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-ivory/65 hover:text-ivory">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-brass uppercase">Contato</p>
              <p className="mt-4 text-sm text-ivory/65">{siteConfig.contactEmail}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ivory/10 pt-8 text-xs text-ivory/45 sm:flex-row sm:justify-between">
          <p>
            &copy; {year} TechTie. Todos os direitos reservados. CNPJ {siteConfig.cnpj} (placeholder).
          </p>
          <p>Este site não oferece consultoria jurídica nem garante resultado processual.</p>
        </div>
      </div>
    </footer>
  );
}
