import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/lib/site-config";

export async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  const institutionalLinks = [
    { href: "/sobre", label: t("linkAbout") },
    { href: "/resultados", label: t("linkResults") },
    { href: "#", label: t("linkPrivacy") },
    { href: "#", label: t("linkTerms") },
  ];

  return (
    <footer className="relative border-t border-border/40 bg-background/75 pb-24 backdrop-blur-sm md:pb-0">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/techtie-app-icon.svg" alt="" width={24} height={24} unoptimized />
              <span className="font-serif text-lg font-semibold text-foreground">
                TechTie
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-foreground">{t("institutionalHeading")}</p>
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
              <p className="text-sm font-medium text-foreground">{t("contactHeading")}</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                <li>{siteConfig.contactEmail}</li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-border" />

        <div className="flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year, cnpj: siteConfig.cnpj })}</p>
          <p>{t("legalDisclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
