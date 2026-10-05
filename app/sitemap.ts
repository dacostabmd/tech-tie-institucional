import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

const siteUrl = "https://www.techtie.com.br";

const paths = ["/", "/produtos", "/servicos", "/contato", "/sobre"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((href) => ({
    url: `${siteUrl}${getPathname({ href, locale: routing.defaultLocale })}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: href === "/" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${siteUrl}${getPathname({ href, locale })}`,
        ]),
      ),
    },
  }));
}
