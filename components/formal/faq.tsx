"use client";

import { Accordion } from "radix-ui";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/layout/fade-in";
import { whatsappHref } from "@/lib/site-config";
import { ctaClassName, SectionHeading } from "./primitives";

// FAQ como tratamento de objecoes: cada resposta remove uma duvida que
// impediria o cadastro.
const faqs = [
  {
    question: "A TechTie garante resultado em processos judiciais?",
    answer:
      "Não. A TechTie é uma ferramenta de acompanhamento e organização processual. Ela não oferece consultoria jurídica nem garante qualquer resultado em processos judiciais, que dependem exclusivamente da análise técnica do advogado responsável.",
  },
  {
    question: "É possível testar a plataforma antes de contratar?",
    answer:
      "Sim. A busca de processos por número CNJ é gratuita e pode ser usada como primeiro contato com a plataforma antes de avaliar os demais planos.",
  },
  {
    question: "Quais tribunais são cobertos pela busca unificada?",
    answer:
      "A plataforma integra 27 tribunais estaduais e federais via número CNJ, além de realizar varredura paralela em 14 bases para buscas por CPF ou CNPJ.",
  },
  {
    question: "Como funciona a classificação de risco dos eventos?",
    answer:
      "Cada movimentação processual é analisada automaticamente e classificada como urgente (ex.: penhora, bloqueio, leilão), positiva (ex.: arquivamento) ou rotineira, para facilitar a priorização da análise.",
  },
  {
    question: "Preciso instalar algum programa?",
    answer:
      "Não. A TechTie é uma plataforma web: basta um navegador atualizado para consultar e acompanhar os processos.",
  },
  {
    question: "Consultores conseguem ver processos de terceiros?",
    answer:
      "Não. O acesso de consultores é restrito aos processos vinculados ao próprio CPF ou CNPJ, respeitando o escopo de titularidade dos dados.",
  },
  {
    question: "Como a TechTie trata dados pessoais e sigilo profissional?",
    answer:
      "Os dados são tratados em conformidade com a LGPD, com criptografia e controles de acesso que buscam preservar o sigilo profissional entre advogado e cliente.",
  },
];

export function FormalFaq() {
  return (
    <section id="duvidas" className="relative bg-paper py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Dúvidas frequentes"
            title="Antes de começar."
            description="Respostas diretas sobre funcionamento, dados e escopo da plataforma."
          />
          <FadeIn delay={0.1} className="mt-8">
            <p className="text-sm text-ink-muted">Não encontrou sua pergunta?</p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="faq-whatsapp"
              className={ctaClassName("outline-dark", "mt-3")}
            >
              Falar com um especialista
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <Accordion.Root type="single" collapsible className="border-t border-rule">
            {faqs.map((faq, index) => (
              <Accordion.Item key={faq.question} value={`faq-${index}`} className="border-b border-rule">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 py-6 text-left font-display text-xl font-semibold text-ink outline-none focus-visible:text-brass-deep sm:text-2xl">
                    {faq.question}
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-rule text-brass-deep transition-[transform,background-color] duration-300 group-hover:bg-ivory group-data-[state=open]:rotate-45">
                      <Plus className="size-4" aria-hidden="true" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="max-w-2xl pb-6 leading-relaxed text-ink-muted">{faq.answer}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </FadeIn>
      </div>
    </section>
  );
}
