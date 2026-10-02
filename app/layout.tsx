import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://www.techtie.com.br";

const siteTitle = "TechTie | CRM jurídico com Business Intelligence e IA para LegalTech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | TechTie",
  },
  description:
    "TechTie é um CRM jurídico com Business Intelligence integrado e inteligência artificial para LegalTech: gestão de clientes e carteira, acompanhamento processual em 27 tribunais, painéis de BI e IA para escritórios de advocacia.",
  keywords: [
    "crm jurídico",
    "crm para advogados",
    "software para escritório de advocacia",
    "business intelligence jurídico",
    "inteligência artificial jurídica",
    "legaltech",
    "acompanhamento processual",
    "gestão de carteira de processos",
  ],
  authors: [{ name: "TechTie" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "TechTie",
    title: siteTitle,
    description:
      "Gerencie clientes e processos, enxergue o escritório em painéis de BI e conte com IA feita para LegalTech. Sigilo profissional e conformidade com a LGPD.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TechTie - CRM jurídico com Business Intelligence e IA para LegalTech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description:
      "CRM jurídico com BI integrado e IA para LegalTech: carteira, prazos, 27 tribunais e indicadores em uma única plataforma.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "TechTie",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description:
        "CRM jurídico com Business Intelligence integrado e inteligência artificial para LegalTech, para advogados, consultores e escritórios de advocacia.",
    },
    {
      "@type": "SoftwareApplication",
      name: "TechTie",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "CRM jurídico com gestão de clientes e carteira, acompanhamento processual em 27 tribunais estaduais e federais, painéis de Business Intelligence integrados e inteligência artificial para LegalTech.",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
