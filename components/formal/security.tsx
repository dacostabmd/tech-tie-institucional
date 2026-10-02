"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeading } from "./primitives";

// Pilares numerados como paragrafos (§) — reforca a linguagem formal/juridica.
const pillars = [
  {
    title: "Conformidade com a LGPD",
    description:
      "Dados processuais e pessoais tratados conforme a Lei Geral de Proteção de Dados, com finalidade e controles de acesso bem definidos.",
  },
  {
    title: "Criptografia de dados",
    description:
      "Informações armazenadas e transmitidas com criptografia, reduzindo a exposição de dados sensíveis a terceiros não autorizados.",
  },
  {
    title: "Sigilo profissional",
    description:
      "Arquitetura pensada para preservar o sigilo entre advogado e cliente, com segregação de acesso por usuário e por escritório.",
  },
  {
    title: "Acesso restrito por titularidade",
    description:
      "Consultores visualizam apenas os processos vinculados ao próprio CPF ou CNPJ, limitando o escopo de dados acessíveis.",
  },
];

export function FormalSecurity() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="seguranca" className="relative bg-ivory py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Segurança e conformidade"
            title="Sigilo profissional como premissa, não como recurso."
            description="A Prosec trata dados processuais e pessoais com controles técnicos e organizacionais alinhados à legislação vigente."
          />
        </div>

        <ol className="divide-y divide-rule border-y border-rule">
          {pillars.map((pillar, index) => (
            <motion.li
              key={pillar.title}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.5, delay: index * 0.08 }}
              className="grid grid-cols-[3.5rem_1fr] gap-4 py-8"
            >
              <span className="font-display text-2xl font-semibold text-brass-deep">
                §&nbsp;{index + 1}º
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{pillar.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
