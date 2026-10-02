"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { submitLeadForm, type LeadFormState } from "@/app/actions/lead";

const initialState: LeadFormState = { status: "idle" };

const inputClassName =
  "h-11 rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-gold-soft focus-visible:ring-3 focus-visible:ring-gold-soft/25";

export function LeadForm() {
  const [state, formAction, isPending] = useActionState(
    submitLeadForm,
    initialState,
  );

  if (state.status === "success") {
    return (
      <Alert className="border-gold-soft/30 bg-gold-muted">
        <CheckCircle2 className="size-4 text-gold" />
        <AlertTitle className="text-foreground">Cadastro recebido</AlertTitle>
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm text-muted-foreground">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={inputClassName}
          placeholder="Seu nome"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm text-muted-foreground">
          E-mail profissional
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClassName}
          placeholder="voce@escritorio.com.br"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="oab" className="text-sm text-muted-foreground">
          OAB (opcional)
        </label>
        <input
          id="oab"
          name="oab"
          type="text"
          className={inputClassName}
          placeholder="Número de inscrição"
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-12 w-full border-transparent bg-gold text-base text-gold-foreground transition-colors hover:bg-gold/90"
      >
        {isPending ? "Enviando..." : "Testar grátis"}
      </Button>
    </form>
  );
}
