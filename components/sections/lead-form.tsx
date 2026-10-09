"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Building2, User, ChevronDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { submitLeadForm, type LeadFormState } from "@/app/actions/lead";

const initialState: LeadFormState = { status: "idle" };

const inputClassName =
  "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground outline-none placeholder:text-muted-foreground transition-all duration-200 focus-visible:border-gold-soft focus-visible:ring-2 focus-visible:ring-gold-soft/25";

function maskCnpj(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function maskCpf(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function LeadForm() {
  const t = useTranslations("LeadForm");
  const [state, formAction, isPending] = useActionState(
    submitLeadForm,
    initialState,
  );

  const [docType, setDocType] = useState<"cnpj" | "cpf">("cnpj");
  const [docNumber, setDocNumber] = useState("");
  const [phone, setPhone] = useState("");

  const handleDocTypeChange = (type: "cnpj" | "cpf") => {
    setDocType(type);
    setDocNumber("");
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDocNumber(docType === "cnpj" ? maskCnpj(val) : maskCpf(val));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(maskPhone(e.target.value));
  };

  if (state.status === "success") {
    return (
      <Alert className="border-gold-soft/40 bg-gold-muted/30 p-6">
        <CheckCircle2 className="size-5 text-gold" />
        <AlertTitle className="text-base font-medium text-foreground">
          {t("successTitle")}
        </AlertTitle>
        <AlertDescription className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {t("successMessage")}
        </AlertDescription>
      </Alert>
    );
  }

  const errorMessage =
    state.status === "error"
      ? state.reason === "invalid-email"
        ? t("errorInvalidEmail")
        : state.reason === "invalid-document"
          ? t("errorInvalidDocument")
          : state.reason === "server-error"
            ? t("errorServer")
            : t("errorMissingFields")
      : null;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* Hidden DocType & Origem */}
      <input type="hidden" name="docType" value={docType} />
      <input type="hidden" name="origem" value="Landing Page TechTie" />

      {/* Tipo de Documento: CNPJ ou CPF */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {t("docTypeLabel")}
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-card/60 border border-input">
          <button
            type="button"
            onClick={() => handleDocTypeChange("cnpj")}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-all duration-150 ${
              docType === "cnpj"
                ? "bg-gold/15 text-gold border border-gold-soft/30 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <Building2 className="size-3.5" />
            <span>{t("docTypeCnpj")}</span>
          </button>
          <button
            type="button"
            onClick={() => handleDocTypeChange("cpf")}
            className={`flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium rounded-md transition-all duration-150 ${
              docType === "cpf"
                ? "bg-gold/15 text-gold border border-gold-soft/30 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            <User className="size-3.5" />
            <span>{t("docTypeCpf")}</span>
          </button>
        </div>
      </div>

      {/* Nome Completo */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
          {t("nameLabel")} <span className="text-gold">*</span>
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

      {/* E-mail Corporativo */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
          {t("emailLabel")} <span className="text-gold">*</span>
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

      {/* Documento (CNPJ ou CPF) e Empresa lado a lado em telas maiores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="document" className="text-xs font-medium text-muted-foreground">
            {docType === "cnpj" ? t("docNumberLabelCnpj") : t("docNumberLabelCpf")}
          </label>
          <input
            id="document"
            name="document"
            type="text"
            value={docNumber}
            onChange={handleDocChange}
            className={inputClassName}
            placeholder={
              docType === "cnpj"
                ? t("docNumberPlaceholderCnpj")
                : t("docNumberPlaceholderCpf")
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-xs font-medium text-muted-foreground">
            {docType === "cnpj" ? t("companyLabelCnpj") : t("companyLabelCpf")}
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className={inputClassName}
            placeholder={
              docType === "cnpj"
                ? t("companyPlaceholderCnpj")
                : t("companyPlaceholderCpf")
            }
          />
        </div>
      </div>

      {/* Segmento da Empresa (Obrigatório) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="segment" className="text-xs font-medium text-muted-foreground">
          {t("segmentLabel")} <span className="text-gold">*</span>
        </label>
        <div className="relative">
          <select
            id="segment"
            name="segment"
            required
            defaultValue=""
            className={`${inputClassName} appearance-none pr-10 cursor-pointer`}
          >
            <option value="" disabled className="bg-neutral-900 text-muted-foreground">
              {t("segmentPlaceholder")}
            </option>
            <option value="Tecnologia / Software / SaaS" className="bg-neutral-900 text-foreground">
              {t("segments.tecnologia")}
            </option>
            <option value="Jurídico / Advocacia / Legaltech" className="bg-neutral-900 text-foreground">
              {t("segments.juridico")}
            </option>
            <option value="Saúde / Clínicas / Farmacêutica" className="bg-neutral-900 text-foreground">
              {t("segments.saude")}
            </option>
            <option value="Varejo / E-commerce / Comércio" className="bg-neutral-900 text-foreground">
              {t("segments.varejo")}
            </option>
            <option value="Serviços Financeiros / Contabilidade" className="bg-neutral-900 text-foreground">
              {t("segments.financeiro")}
            </option>
            <option value="Imobiliário / Construção Civil" className="bg-neutral-900 text-foreground">
              {t("segments.imobiliario")}
            </option>
            <option value="Logística / Transporte / Distribuição" className="bg-neutral-900 text-foreground">
              {t("segments.logistica")}
            </option>
            <option value="Indústria / Manufatura" className="bg-neutral-900 text-foreground">
              {t("segments.industria")}
            </option>
            <option value="Educação / Treinamentos / EdTech" className="bg-neutral-900 text-foreground">
              {t("segments.educacao")}
            </option>
            <option value="Consultoria / Serviços B2B" className="bg-neutral-900 text-foreground">
              {t("segments.consultoria")}
            </option>
            <option value="Outro segmento" className="bg-neutral-900 text-foreground">
              {t("segments.outro")}
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* WhatsApp / Telefone (Opcional) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="whatsapp" className="text-xs font-medium text-muted-foreground">
          {t("whatsappLabel")}
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          className={inputClassName}
          placeholder={t("whatsappPlaceholder")}
        />
      </div>

      {/* Mensagem de Erro */}
      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          {errorMessage}
        </div>
      )}

      {/* Botão de Envio */}
      <Button
        type="submit"
        disabled={isPending}
        className="mt-2 h-12 w-full border-transparent bg-gold text-sm font-semibold text-gold-foreground shadow-lg shadow-gold/15 transition-all hover:bg-gold/90 hover:shadow-gold/25 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            {t("submitting")}
          </span>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
