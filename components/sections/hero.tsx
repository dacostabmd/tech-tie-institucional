"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/sections/lead-form";
import { whatsappHref } from "@/lib/site-config";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative flex items-center overflow-hidden lg:min-h-[70vh]">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.6 }}
            className="mb-6 inline-flex items-center text-xs font-semibold tracking-wider text-neon-white uppercase"
          >
            CRM jurídico para advogados e escritórios
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, delay: shouldReduceMotion ? 0 : 0.1 }}
            className="text-balance font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-neon-white sm:text-5xl"
          >
            O CRM jurídico com BI integrado e IA feita para LegalTech
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, delay: shouldReduceMotion ? 0 : 0.2 }}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-foreground/80"
          >
            Centralize clientes, processos e prazos em um único sistema,
            acompanhe 27 tribunais estaduais e federais, enxergue a operação
            do escritório em painéis de Business Intelligence e conte com uma
            inteligência artificial treinada para o contexto jurídico — com
            sigilo profissional e conformidade com a LGPD.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, delay: shouldReduceMotion ? 0 : 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Button
              asChild
              size="lg"
              className="group h-12 bg-gold px-6 text-base text-gold-foreground transition-colors hover:bg-gold/90 lg:hidden"
            >
              <Link href="#cadastro">
                Testar grátis
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-border bg-transparent px-6 text-base text-foreground hover:bg-accent"
            >
              <Link href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Falar no WhatsApp
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, delay: shouldReduceMotion ? 0 : 0.4 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            Acesso de consultores restrito ao próprio CPF ou CNPJ. Sem promessa
            de resultado processual.
          </motion.p>
        </div>

        <motion.div
          id="cadastro"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.7, delay: shouldReduceMotion ? 0 : 0.3 }}
          className="w-full scroll-mt-24 rounded-2xl border border-border bg-card/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-8 lg:ml-auto lg:max-w-md"
        >
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-neon-white">
            Comece a gerir seu escritório com inteligência
          </h2>
          <p className="mt-3 mb-6 text-sm text-muted-foreground">
            Cadastre-se para conhecer o CRM jurídico da Prosec: gestão de
            carteira, painéis de BI e IA para LegalTech em uma única
            plataforma.
          </p>
          <LeadForm />
        </motion.div>
      </div>
    </section>
  );
}
