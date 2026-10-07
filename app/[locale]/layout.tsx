import type { Metadata } from "next";
import { Liter, Manrope } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

// Fonte global: Manrope (variavel, 200-800) no texto e titulos; Liter (so 400) entra
// como reserva. Servidas pelo proprio site via next/font, sem requisicao ao Google.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const liter = Liter({
  variable: "--font-liter",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

const siteUrl = "https://www.techtie.com.br";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const localePath = locale === routing.defaultLocale ? "" : `/${locale}`;
  const openGraphLocale = locale === "pt-BR" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("title"),
      template: `%s | TechTie`,
    },
    description: t("description"),
    keywords: t("keywords")
      .split(",")
      .map((keyword) => keyword.trim()),
    authors: [{ name: "TechTie" }],
    openGraph: {
      type: "website",
      locale: openGraphLocale,
      url: `${siteUrl}${localePath}`,
      siteName: "TechTie",
      title: t("title"),
      description: t("ogDescription"),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("twitterDescription"),
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "TechTie",
        url: siteUrl,
        logo: `${siteUrl}/logo.svg`,
        description: t("organizationDescription"),
      },
      {
        "@type": "SoftwareApplication",
        name: "TechTie",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: t("applicationDescription"),
        offers: {
          "@type": "Offer",
          category: "SaaS",
        },
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`dark ${manrope.variable} ${liter.variable} h-full overflow-x-hidden antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
