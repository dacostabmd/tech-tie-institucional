"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { submitLeadForm, type LeadFormState } from "@/app/actions/lead";

const initialState: LeadFormState = { status: "idle" };

const inputClassName =
  "h-11 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-gold-soft focus-visible:ring-3 focus-visible:ring-gold-soft/25";

export function LeadForm() {
  const t = useTranslations("LeadForm");
  const [state, formAction, isPending] = useActionState(
    submitLeadForm,
    initialState,
  );

  if (state.status === "success") {
    return (
      <Alert className="border-gold-soft/30 bg-gold-muted">
        <CheckCircle2 className="size-4 text-gold" />
        <AlertTitle className="text-foreground">{t("successTitle")}</AlertTitle>
        <AlertDescription>{t("successMessage")}</AlertDescription>
      </Alert>
    );
  }

  const errorMessage =
    state.status === "error"
      ? state.reason === "invalid-email"
        ? t("errorInvalidEmail")
        : t("errorMissingFields")
      : null;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm text-muted-foreground">
          {t("nameLabel")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={inputClassName}
          placeholder={t("namePlaceholder")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-muted-foreground">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClassName}
          placeholder={t("emailPlaceholder")}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="company" className="text-sm text-muted-foreground">
          {t("oabLabel")}
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className={inputClassName}
          placeholder={t("oabPlaceholder")}
        />
      </div>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-12 w-full border-transparent bg-gold text-base text-gold-foreground transition-colors hover:bg-gold/90"
      >
        {isPending ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
