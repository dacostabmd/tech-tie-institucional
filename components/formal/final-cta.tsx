"use client";

import { useActionState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { submitLeadForm, type LeadFormState } from "@/app/actions/lead";
import BlurText from "@/components/react-bits/blur-text";
import { FadeIn } from "@/components/layout/fade-in";
import { CNJ_PLACEHOLDER, formatCnj } from "@/lib/cnj";
import { whatsappHref } from "@/lib/site-config";
import {
  ACCESS_FIRST_FIELD_ID,
  ACCESS_FORM_CARD_ID,
  ACCESS_SECTION_ID,
  useLead,
} from "./lead-context";
import { ctaClassName, Eyebrow, useAnimatedBackground } from "./primitives";

const LightRays = dynamic(() => import("@/components/react-bits/light-rays"), { ssr: false });

const initialState: LeadFormState = { status: "idle" };

// Expectativa clara do que acontece apos o envio reduz a hesitacao no clique.
const nextSteps = [
  "Você informa nome e e-mail profissional.",
  "Nossa equipe libera o seu acesso à plataforma.",
  "Você consulta processos por número CNJ sem custo.",
];

const inputClassName =
  "h-12 w-full rounded-lg border border-rule bg-ivory px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-ink/35 focus:border-brass-deep focus:ring-3 focus:ring-brass/30";

function Field({
  id,
  label,
  optional,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-muted">(opcional)</span>}
      </label>
      {children}
    </div>
  );
}

function LeadForm() {
  const { cnj, setCnj } = useLead();
  const [state, formAction, isPending] = useActionState(submitLeadForm, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <CheckCircle2 className="size-10 text-risk-positive" strokeWidth={1.5} aria-hidden="true" />
        <h3 className="font-display text-3xl font-semibold text-ink">Cadastro recebido</h3>
        <p className="leading-relaxed text-ink-muted">{state.message}</p>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="success-whatsapp"
          className={ctaClassName("outline-dark", "mt-2")}
        >
          Adiantar pelo WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="origem" value="lp-formal" />
      <Field id={ACCESS_FIRST_FIELD_ID} label="Nome completo">
        <input
          id={ACCESS_FIRST_FIELD_ID}
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Seu nome"
          className={inputClassName}
        />
      </Field>
      <Field id="lead-email" label="E-mail profissional">
        <input
          id="lead-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="voce@escritorio.com.br"
          className={inputClassName}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="lead-whatsapp" label="WhatsApp" optional>
          <input
            id="lead-whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="(00) 00000-0000"
            className={inputClassName}
          />
        </Field>
        <Field id="lead-cnj" label="Nº do processo" optional>
          <input
            id="lead-cnj"
            name="cnj"
            inputMode="numeric"
            autoComplete="off"
            value={cnj}
            onChange={(e) => setCnj(formatCnj(e.target.value))}
            placeholder={CNJ_PLACEHOLDER}
            className={`${inputClassName} font-mono text-sm`}
          />
        </Field>
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-risk-urgent">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        data-cta="lead-submit"
        className={ctaClassName("navy", "mt-2 h-13 w-full text-base")}
      >
        {isPending ? "Enviando..." : "Criar acesso gratuito"}
        {!isPending && (
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </button>

      {/* Microcopy de reversao de risco logo abaixo do botao. */}
      <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
        <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Sem compromisso. Seus dados são tratados conforme a LGPD e usados apenas
        para liberar o acesso.
      </p>
    </form>
  );
}

export function FormalFinalCta() {
  const showRays = useAnimatedBackground();

  return (
    <section
      id={ACCESS_SECTION_ID}
      className="relative scroll-mt-16 overflow-hidden bg-navy-deep py-24 text-ivory sm:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.79_0.095_80/12%),transparent_70%)]" />
        {showRays && (
          <div className="absolute inset-0 opacity-70">
            <LightRays
              raysOrigin="top-center"
              raysColor="#dbb472"
              raysSpeed={0.6}
              lightSpread={0.9}
              rayLength={1.6}
              fadeDistance={1.1}
              followMouse
              mouseInfluence={0.06}
              noiseAmount={0.05}
            />
          </div>
        )}
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1fr_minmax(0,460px)]">
        <div>
          <Eyebrow tone="dark">Acesso gratuito</Eyebrow>
          <BlurText
            as="h2"
            text="Comece pelo primeiro processo. A consulta por CNJ é gratuita."
            delay={50}
            className="mt-5 max-w-xl text-balance font-display text-4xl leading-[1.05] font-semibold text-ivory sm:text-5xl lg:text-6xl"
          />
          <FadeIn delay={0.2}>
            <ol className="mt-10 space-y-4">
              {nextSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-4 text-ivory/80">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-brass/50 font-display text-base font-semibold text-brass">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <figure className="mt-12 max-w-md border-l border-brass/40 pl-5">
              <blockquote className="font-display text-xl leading-snug text-ivory/85 italic">
                &ldquo;Os resumos executivos são objetivos e facilitam o
                acompanhamento de processos fora da minha área direta.&rdquo;
              </blockquote>
              {/* Depoimento ficticio — substituir por relato real e autorizado (OAB). */}
              <figcaption className="mt-3 text-xs text-ivory/50">
                R. T., consultor jurídico (ilustrativo)
              </figcaption>
            </figure>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div
            id={ACCESS_FORM_CARD_ID}
            className="scroll-mt-28 rounded-2xl bg-ivory p-7 text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-brass/20 sm:p-9"
          >
            <h3 className="font-display text-3xl font-semibold">Criar acesso gratuito</h3>
            <p className="mt-2 mb-7 text-sm text-ink-muted">
              Leva menos de um minuto. Campos opcionais agilizam o atendimento.
            </p>
            <LeadForm />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
