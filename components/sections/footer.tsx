import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/site-config";

const institutionalLinks = [
  { href: "#", label: "Sobre a Prosec" },
  { href: "#", label: "Política de privacidade" },
  { href: "#", label: "Termos de uso" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Link href="#" className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-gold" strokeWidth={1.75} aria-hidden="true" />
              <span className="font-serif text-lg font-semibold text-foreground">
                Prosec
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              CRM jurídico com Business Intelligence integrado e inteligência
              artificial para LegalTech, para advogados, consultores e
              escritórios de advocacia.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-foreground">Institucional</p>
              <ul className="mt-4 space-y-2.5">
                {institutionalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">Contato</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>{siteConfig.contactEmail}</li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-border" />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} Prosec. Todos os direitos reservados. CNPJ{" "}
            {siteConfig.cnpj} (placeholder).
          </p>
          <p>
            Este site não oferece consultoria jurídica nem garante resultado
            processual.
          </p>
        </div>
      </div>
    </footer>
  );
}
