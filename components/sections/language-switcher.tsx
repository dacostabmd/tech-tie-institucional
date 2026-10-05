"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const shortLabel: Record<string, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function switchTo(nextLocale: (typeof routing.locales)[number]) {
    setOpen(false);
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("ariaLabel")}
          className="flex h-8 min-w-10 items-center justify-center rounded-full border border-border/60 px-3 text-xs font-semibold tracking-wide text-foreground/80 transition-colors hover:text-gold-soft"
        >
          {shortLabel[locale]}
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex min-w-28 flex-col gap-0.5">
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-left text-sm transition-colors",
              loc === locale
                ? "bg-gold-muted text-gold"
                : "text-foreground/80 hover:bg-muted hover:text-foreground",
            )}
          >
            {t(loc)}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
